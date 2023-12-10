import axios from "axios";
import JSBI from "jsbi";
import {
    getContract,
    convertToWei,
    aproveToken,
    getConnectedWallet,
} from "./ethers";
import { getContractAbiPolygonScan } from "./polygon";
import { getTokensIdQuery } from "../libs/queries";
import { getTokenData } from "../libs/tokens";
import PositionManagerABI from "../contracts/PositionManagerABI.json";
import {
    Pool,
    Position,
    nearestUsableTick,
    FullMath,
    TickMath,
    computePoolAddress,
    FeeAmount,
    MintOptions,
    NonfungiblePositionManager,
} from "@uniswap/v3-sdk";
import { Token, BigintIsh, Percent } from "@uniswap/sdk-core";
import IUniswapV3Pool from "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json";
import INonfungiblePositionManager from "@uniswap/v3-periphery/artifacts/contracts/interfaces/INonfungiblePositionManager.sol/INonfungiblePositionManager.json";
import IERC20Metadata from "@uniswap/v3-periphery/artifacts/contracts/interfaces/IERC20Metadata.sol/IERC20Metadata.json";

/**
 * @description Create a pool instance with the current data
 * @returns The pool intance with its data
 */
const getPoolState = async (tokenA: Token, tokenB: Token, poolFee: number) => {
    const poolAddress = getPoolAddress(tokenA, tokenB, poolFee);

    const poolContract = getContract(poolAddress, IUniswapV3Pool.abi);

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
 * @description Mint a new liquidity position.
 * @param token0Code The code of the first token
 * @param amount0 The amount of token0 to mint
 * @param token1Code The code of the second token
 * @param amount1 The amount of token1 to mint
 */
export const mint = async (
    token0Code: string,
    amount0: BigintIsh,
    token1Code: string,
    amount1: BigintIsh
) => {
    const tokenData0 = getTokenData(token0Code);
    const tokenData1 = getTokenData(token1Code);

    await aproveToken(
        tokenData0.token.address,
        IERC20Metadata.abi,
        convertToWei(amount0.toString(), tokenData0.token.decimals)
    );

    await aproveToken(
        tokenData1.token.address,
        IERC20Metadata.abi,
        convertToWei(amount1.toString(), tokenData1.token.decimals)
    );

    const poolState = await getPoolState(
        tokenData0.token,
        tokenData1.token,
        FeeAmount.LOW
    );

    const configuredPool = new Pool(
        tokenData0.token,
        tokenData1.token,
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
            poolState.tickSpacing * 500,
        tickUpper:
            nearestUsableTick(poolState.tick, poolState.tickSpacing) +
            poolState.tickSpacing * 500,
        amount0: convertToWei(amount0.toString(), tokenData0.token.decimals),
        amount1: convertToWei(amount1.toString(), tokenData1.token.decimals),
        useFullPrecision: true,
    });

    const mintOptions: MintOptions = {
        recipient: global.owner,
        deadline: Math.floor(Date.now() / 1000) + 60 * 5, //5 minutes
        slippageTolerance: new Percent(50, 10_000),
    };

    // get calldata for minting a position
    const { calldata, value } = NonfungiblePositionManager.addCallParameters(
        position,
        mintOptions
    );

    const gasPrice = await global.provider.getFeeData();

    console.log("gas price:", gasPrice.gasPrice.toString());

    const nonce = await global.provider.getTransactionCount(
        global.owner,
        "latest"
    );

    console.log("nonce:", nonce);

    const transaction = {
        data: calldata,
        to: process.env.POSITION_MANAGER_ADDRESS ?? "",
        value: value,
        from: global.owner,
        gasPrice: gasPrice.gasPrice * 1.5,
    };

    const estimatedGas = await global.provider.estimateGas(transaction);

    console.log("estimated gas:", estimatedGas.toString());

    const signer = getConnectedWallet();

    // const tx = await signer.sendTransaction(transaction);

    // console.log(tx);

    //----------------------------------------------

    // const params = {
    //     token0: tokenData0.token.address,
    //     token1: tokenData1.token.address,
    //     fee: poolState.fee,
    //     tickLower: position.tickLower,
    //     tickUpper: position.tickUpper,
    //     amount0Desired: position.amount0,
    //     amount1Desired: position.amount1,
    //     amount0Min: position.amount0,
    //     amount1Min: position.amount1,
    //     recipient: global.owner,
    //     deadline: Math.floor(Date.now() / 1000) + 60 * 5, //5 minutes
    // };

    // const nonfungiblePositionManagerContract = getContract(
    //     process.env.POSITION_MANAGER_ADDRESS ?? "",
    //     INonfungiblePositionManager.abi
    // );

    // const signer = getConnectedWallet();

    // const tx = await nonfungiblePositionManagerContract.connect(signer).mint(
    //     params,
    //     {
    //         gasPrice: gasPrice.gasPrice * 1.5,
    //     }
    //     //{ gasLimit: ethers.utils.hexlify(1000000) }
    // );

    // console.log(tx);
};

/**
 * @description Get the pool address from two tokens
 * @param tokenA The first token
 * @param tokenB The second token
 * @param poolFee The fee of the pool
 */
const getPoolAddress = (
    tokenA: Token,
    tokenB: Token,
    poolFee: number
): string => {
    return computePoolAddress({
        factoryAddress: process.env.POOL_FACTORY_ADDRESS ?? "",
        tokenA: tokenA,
        tokenB: tokenB,
        fee: poolFee,
    });
};

/**
 * @description Get the tokens id from an owner in a pool
 * @param ownerAddress The address of the owner
 */
export const getPositionsFromOwner = async (
    token0Code: string,
    token1Code: string,
    ownerAddress: string
) => {
    try {
        const tokenData0 = getTokenData(token0Code);
        const tokenData1 = getTokenData(token1Code);

        const poolAddress = getPoolAddress(
            tokenData0.token,
            tokenData1.token,
            FeeAmount.LOW
        );

        const poolAbi = await getContractAbiPolygonScan(poolAddress);

        const query = getTokensIdQuery(ownerAddress, poolAbi.toString());

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
export const getTwapPrice = async (
    token0Code: string,
    token1Code: string,
    seconds: number
): Promise<string> => {
    try {
        const tokenData0 = getTokenData(token0Code);
        const tokenData1 = getTokenData(token1Code);

        const poolAddress = getPoolAddress(
            tokenData0.token,
            tokenData1.token,
            FeeAmount.LOW
        );

        const poolAbi = await getContractAbiPolygonScan(poolAddress);

        const pool = getContract(poolAddress, poolAbi);

        const observeData = await pool.observe([seconds, 0]);

        const tickCumulatives = observeData.tickCumulatives.map((t) =>
            Number(t)
        );

        const tickCumulativesDelta = tickCumulatives[1] - tickCumulatives[0];

        const arithmeticMeanTick = (tickCumulativesDelta / seconds).toFixed(0);

        const arithmeticMeanTickInt = parseInt(arithmeticMeanTick);

        const sqrtRatioX96 = TickMath.getSqrtRatioAtTick(arithmeticMeanTickInt);

        return getPriceFromSqrtRatio(
            tokenData0.token,
            tokenData1.token,
            sqrtRatioX96
        );
    } catch (error) {
        console.log(error);
        throw new Error("Error getting TWAP price");
    }
};

/**
 * @description Get the price from a tick
 * @param tick The tick to get the price from
 * @param baseToken The base token
 * @param quoteToken The quote token
 */
const getPriceFromTick = (
    baseToken: Token,
    quoteToken: Token,
    tick: number
) => {
    const sqrtRatioX96 = TickMath.getSqrtRatioAtTick(tick);

    return getPriceFromSqrtRatio(baseToken, quoteToken, sqrtRatioX96);
};

/**
 * @description Get the price from a sqrt ratio
 * @param sqrtRatioX96 The sqrt ratio
 * @param baseToken The base token
 * @param quoteToken The quote token
 * @returns The price
 */
const getPriceFromSqrtRatio = (
    baseToken: Token,
    quoteToken: Token,
    sqrtRatioX96: JSBI
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
