import { ethers } from "ethers";
import ERC20ABI from "../contracts/ERC20ABI.json";

/**
 * @description Get the connected wallet
 * @returns The connected wallet
 */
export const getConnectedWallet = (): ethers.Wallet => {
    const wallet = new ethers.Wallet(process.env.WALLET_SECRET);
    const connectedWallet = wallet.connect(global.provider);

    return connectedWallet;
};

export const getContract = (
    contractAddress: string,
    contractABI: ethers.ContractInterface
): ethers.Contract => {
    const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        global.provider
    );

    return contract;
};

/**
 * @description Get the token balance of an address
 * @param ownerAddress The address of the owner
 * @param tokenAddress The address of the token
 * @param tokenDecimals The decimals of the token
 * @returns The balance of the address
 */
export const getAddressBalance = async (
    ownerAddress: string,
    tokenAddress: string,
    tokenDecimals: number
): Promise<string> => {
    try {
        const contract = new ethers.Contract(
            tokenAddress,
            ERC20ABI,
            global.provider
        );

        const balance: string = (
            (await contract.balanceOf(ownerAddress)) /
            10 ** tokenDecimals
        ).toString();

        return balance;
    } catch (error) {
        console.log(error);
        throw new Error("Error getting address balance");
    }
};

/**
 * @description Aprove a token to be used by a contract
 * @param tokenAddress The address of the token
 */
export const aproveToken = async (tokenAddress: string) => {
    try {
        const tokenContract = getContract(tokenAddress, ERC20ABI);

        await tokenContract
            .connect(getConnectedWallet())
            .approve(process.env.POSITION_MANAGER_ADDRESS ?? "", 1000000000);
    } catch (error) {
        console.log(error);
        throw new Error("Error approving token");
    }
};
