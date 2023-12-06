import { ethers } from "ethers";
import PositionManagerABI from "../contracts/PositionManagerABI.json";

/**
 * @description Increase the liquidity of a position
 * @param owner  The owner of the position
 * @param tokenId The id of the position
 * @param amount0Desired The amount of token0 to add
 * @param amount1Desired The amount of token1 to add
 */
export const increaseLiquidity = async (
    tokenId: number,
    amount0Desired: number,
    amount1Desired: number
) => {
    const pool = new ethers.Contract(
        process.env.POSITION_MANAGER_ADDRESS ?? "",
        PositionManagerABI,
        global.provider
    );

    const wallet = new ethers.Wallet(process.env.WALLET_SECRET ?? "");
    const connectedWallet = wallet.connect(global.provider);

    const params = {
        tokenId,
        amount0Desired: amount0Desired.toString(),
        amount1Desired: amount1Desired.toString(),
        amount0Min: 0,
        amount1Min: 0,
        deadline: Math.floor(Date.now() / 1000) + 60 * 10,
    };

    pool.connect(connectedWallet)
        .increaseLiquidity(params, { gasLimit: 1000000 })
        .then((tx) => {
            console.log(tx);

            tx.wait().then((receipt) => {
                console.log(receipt);
            });
        });
};

/**
 * @description Decrease the liquidity of a position
 * @param owner  The owner of the position
 * @param tokenId The id of the position
 * @param liquidityPercentage The percentage in decimals of liquidity to remove
 */
export const decreaseLiquidity = async (
    owner: string,
    tokenId: number,
    liquidityPercentage: number
) => {
    if (liquidityPercentage > 1) {
        throw new Error("Liquidity percentage must be in decimals");
    }

    const pool = new ethers.Contract(
        process.env.POSITION_MANAGER_ADDRESS ?? "",
        PositionManagerABI,
        global.provider
    );

    const wallet = new ethers.Wallet(process.env.WALLET_SECRET ?? "");
    const connectedWallet = wallet.connect(global.provider);

    pool.connect(connectedWallet)
        .positions(tokenId)
        .then((position) => {
            const totalLiquidity = position.liquidity.toString();
            const liquidityToDecrease =
                parseInt(totalLiquidity) * liquidityPercentage;

            const params = {
                tokenId,
                liquidity: liquidityToDecrease.toString(),
                amount0Min: 0,
                amount1Min: 0,
                deadline: Math.floor(Date.now() / 1000) + 60 * 10,
            };

            pool.connect(connectedWallet)
                .decreaseLiquidity(params, { gasLimit: 1000000 })
                .then((tx) => {
                    console.log(tx);

                    tx.wait().then((receipt) => {
                        console.log(receipt);
                    });
                });
        });
};
