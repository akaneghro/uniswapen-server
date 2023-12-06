import axios from "axios";
import JSBI from "jsbi";
import { getContract, aproveToken } from "./ethers";
import { getTokensIdQuery } from "../libs/queries";
import { WETH_TOKEN, USDC_TOKEN } from "../libs/tokens";
import PositionManagerABI from "../contracts/PositionManagerABI.json";
import PoolABI from "../contracts/PoolABI.json";
import {
    Pool,
    Position,
    nearestUsableTick,
    FullMath,
    TickMath,
    computePoolAddress,
    FeeAmount,
} from "@uniswap/v3-sdk";
import { Token, BigintIsh } from "@uniswap/sdk-core";
import IUniswapV3Pool from "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json";
import INonfungiblePositionManager from "@uniswap/v3-periphery/artifacts/contracts/interfaces/INonfungiblePositionManager.sol/INonfungiblePositionManager.json";

/**
 * @description Create a pool instance with the current data
 * @returns The pool intance with its data
 */
const getPoolState = async (tokenA: Token, tokenB: Token, poolFee: number) => {
    const currentPoolAddress = computePoolAddress({
        factoryAddress: process.env.POOL_FACTORY_ADDRESS ?? "",
        tokenA: tokenA,
        tokenB: tokenB,
        fee: poolFee,
    });

    const poolContract = getContract(currentPoolAddress, IUniswapV3Pool.abi);

    const [token0, token1, fee, tickSpacing, liquidity, slot0] =
        await Promise.all([
            poolContract.token0(),
            poolContract.token1(),
            poolContract.fee(),
            poolContract.tickSpacing(),
            poolContract.liquidity(),
            poolContract.slot0(),
        ]);

    return {
        token0,
        token1,
        fee,
        tickSpacing,
        liquidity,
        sqrtPriceX96: slot0[0],
        tick: slot0[1],
    };
};

/**
 * @description Mint a lew liquidity position.
 * @param amount0 The amount of token0 to mint
 * @param amount1 The amount of token1 to mint
 */
export const mint = async (amount0: BigintIsh, amount1: BigintIsh) => {
    await aproveToken(WETH_TOKEN.address);
    await aproveToken(USDC_TOKEN.address);

    const poolState = await getPoolState(WETH_TOKEN, USDC_TOKEN, FeeAmount.LOW);

    const configuredPool = new Pool(
        WETH_TOKEN,
        USDC_TOKEN,
        poolState.fee,
        poolState.sqrtPriceX96.toString(),
        poolState.liquidity.toString(),
        poolState.tick
    );

    //Creating a position fromAmounts define the maximum amount of currency within both amounts that can be spent
    const position: Position = Position.fromAmounts({
        pool: configuredPool,
        tickLower:
            nearestUsableTick(poolState.tick, poolState.tickSpacing) -
            poolState.tickSpacing * 50,
        tickUpper:
            nearestUsableTick(poolState.tick, poolState.tickSpacing) +
            poolState.tickSpacing * 50,
        amount0: amount0,
        amount1: amount1,
        useFullPrecision: true,
    });

    const params = {
        token0: WETH_TOKEN.address,
        token1: USDC_TOKEN.address,
        fee: poolState.fee,
        tickLower: position.tickLower.toString(),
        tickUpper: position.tickUpper.toString(),
        amount0Desired: position.amount0.toString(),
        amount1Desired: position.amount1.toString(),
        amount0Min: position.amount0.toString(),
        amount1Min: position.amount1.toString(),
        recipient: process.env.WALLET,
        deadline: Math.floor(Date.now() / 1000) + 60 * 10, //10 minutes
    };

    const nonfungiblePositionManagerContract = getContract(
        process.env.POSITION_MANAGER_ADDRESS ?? "",
        INonfungiblePositionManager.abi
    );

    // const tx = await nonfungiblePositionManagerContract
    //     .connect(getConnectedWallet())
    //     .mint(
    //         params
    //         //{ gasLimit: ethers.utils.hexlify(1000000) }
    //     );

    // console.log(tx);
};

/**
 * @description Get the tokens id from an owner in a pool
 * @param ownerAddress The address of the owner
 */
export const getPositionsFromOwner = async (ownerAddress: string) => {
    try {
        const query = getTokensIdQuery(ownerAddress, PoolABI.toString());

        const response = await axios.post(
            process.env.POOL_SUBGRAPH ?? "",
            JSON.stringify({ query })
        );

        const positions = response.data.data.positions;

        const pool = getContract(
            process.env.POSITION_MANAGER_ADDRESS ?? "",
            PositionManagerABI
        );

        positions.map((p) =>
            pool
                .positions(p.id)
                .call()
                .then((position) => console.log(position))
        );
    } catch (error) {
        console.log(error);
        throw new Error("Error getting positions from owner");
    }
};

/**
 * @description The the Time Weight Average Price for tokens in a pool
 * @param seconds The last x seonds to calculate the TWAP
 */
export const getTwapPrice = async (seconds: number): Promise<string> => {
    try {
        const pool = getContract(process.env.POOL_ADDRESS ?? "", PoolABI);

        const observeData = await pool.observe([seconds, 0]);

        const tickCumulatives = observeData.tickCumulatives.map((t) =>
            Number(t)
        );

        const tickCumulativesDelta = tickCumulatives[1] - tickCumulatives[0];

        const arithmeticMeanTick = (tickCumulativesDelta / seconds).toFixed(0);

        const arithmeticMeanTickInt = parseInt(arithmeticMeanTick);

        const sqrtRatioX96 = TickMath.getSqrtRatioAtTick(arithmeticMeanTickInt);

        return getPriceFromSqrtRatio(sqrtRatioX96, WETH_TOKEN, USDC_TOKEN);
    } catch (error) {
        console.log(error);
        throw new Error("Error getting TWAP price");
    }
};

const getPriceFromSqrtRatio = (
    sqrtRatioX96: JSBI,
    baseToken: Token,
    quoteToken: Token
) => {
    const ratioX96 = JSBI.multiply(sqrtRatioX96, sqrtRatioX96);

    const baseAmount = JSBI.BigInt(10 ** baseToken.decimals);

    const shiftedAmount = JSBI.leftShift(JSBI.BigInt(1), JSBI.BigInt(192));

    let quoteAmount;

    if (baseToken.address < quoteToken.address) {
        quoteAmount = FullMath.mulDivRoundingUp(
            ratioX96,
            baseAmount,
            shiftedAmount
        );
    } else {
        quoteAmount = FullMath.mulDivRoundingUp(
            shiftedAmount,
            baseAmount,
            ratioX96
        );
    }

    const price = quoteAmount.toString() / 10 ** quoteToken.decimals;

    return price.toString();
};
