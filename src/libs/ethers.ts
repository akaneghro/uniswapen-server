import { ethers } from "ethers";

/**
 * @description convert an amount to wei
 * @param amount The amount to convert
 * @param decimals The decimals of the token
 * @returns The amount in wei
 */
export const convertToWei = (amount: string, decimals: number): number => {
    return parseInt(
        ethers.utils.parseUnits(amount.toString(), decimals).toString()
    );
};

/**
 * @description convert an amount to gwei
 * @param amount The amount to convert
 * @returns The amount in gwei
 */
export const converToGwei = (amount: string): number => {
    return parseInt(ethers.utils.parseUnits(amount.toString(), 9).toString());
};

/**
 * @description Get the wallet
 * @returns The wallet
 */
export const getWallet = (): ethers.Wallet => {
    const wallet = new ethers.Wallet(process.env.WALLET_SECRET ?? "");

    return wallet;
};

/**
 * @description Get the connected wallet
 * @returns The connected wallet
 */
export const getConnectedWallet = (): ethers.Wallet => {
    const wallet = new ethers.Wallet(process.env.WALLET_SECRET);
    const connectedWallet = wallet.connect(global.provider);

    return connectedWallet;
};

/**
 * @description Get the contract from an address and an abi
 * @param contractAddress The address of the contract
 * @param contractABI The abi of the contract
 * @returns The contract
 */
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
    tokenAbi: string,
    tokenDecimals: number
): Promise<string> => {
    try {
        const contract = getContract(tokenAddress, tokenAbi);

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
 * @param tokenAbi The abi of the token
 */
export const aproveToken = async (
    tokenAddress: string,
    tokenAbi: ethers.ContractInterface,
    amount: number
) => {
    try {
        const tokenContract = getContract(tokenAddress, tokenAbi);

        await tokenContract
            .connect(getConnectedWallet())
            .approve(process.env.POSITION_MANAGER_ADDRESS ?? "", amount);
    } catch (error) {
        console.log(error);
        throw new Error("Error approving token");
    }
};
