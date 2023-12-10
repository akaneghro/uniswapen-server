import axios from "axios";
import { ethers } from "ethers";
import { convertToWei } from "./ethers";

/**
 * @description Get the estimated base fee from polygon gas api
 * @returns The estimated base fee
 */
export const getMaticGasBase = async () => {
    const response = await axios.get(process.env.POLYGON_GAS_API ?? "");

    return parseInt((response.data.estimatedBaseFee * 10 ** 9).toString());
};

/**
 * @description Get the max priority fee low from polygon gas api
 * @returns The max priority fee low
 */
export const getMaticMaxPriorityFeeLow = async () => {
    const response = await axios.get(process.env.POLYGON_GAS_API ?? "");

    return convertToWei(response.data.safeLow.maxPriorityFee.toString(), 9);
};

/**
 * @description Get the max priority fee standard from polygon gas api
 * @returns The max priority fee standard
 */
export const getMaticMaxPriorityFeeStandard = async () => {
    const response = await axios.get(process.env.POLYGON_GAS_API ?? "");

    return convertToWei(response.data.standard.maxPriorityFee.toString(), 9);
};

/**
 * @description Get the max priority fee fast from polygon gas api
 * @returns The max priority fee fast
 */
export const getMaticMaxPriorityFeeFast = async () => {
    const response = await axios.get(process.env.POLYGON_GAS_API ?? "");

    return convertToWei(response.data.fast.maxPriorityFee.toString(), 9);
};

/**
 * @description Get the contract abi from polygon scan api. The contract must be verified
 * @param contractAddress The address of the contract
 */
export const getContractAbiPolygonScan = async (
    contractAddress: string
): Promise<ethers.ContractInterface> => {
    try {
        const res = await axios.get(
            `https://api.polygonscan.com/api?module=contract&action=getabi&address=${contractAddress}&apikey=${
                process.env.POLYGONSCAN_API_KEY ?? ""
            }`
        );

        const contract = await res.data.json();

        return JSON.parse(contract.result);
    } catch (error) {
        console.log(error);
        throw new Error("Error getting contract abi");
    }
};
