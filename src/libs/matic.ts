import { ethers } from "ethers";
import axios from "axios";

export const getMaticGasPrice = async () => {
    const response = await axios.get(process.env.MATIC_GAS_API ?? "");

    const estimatedBaseFee = parseInt(
        (response.data.estimatedBaseFee * 10 ** 9).toString()
    );

    const safeLowGasPrice = ethers.utils.parseUnits(
        response.data.safeLow.maxPriorityFee.toString(),
        9
    );

    const standardGasPrice = ethers.utils.parseUnits(
        response.data.standard.maxPriorityFee.toString(),
        9
    );

    const fastGasPrice = ethers.utils.parseUnits(
        response.data.fast.maxPriorityFee.toString(),
        9
    );

    return `Base fee: ${estimatedBaseFee.toString()} - Low: ${safeLowGasPrice.toString()} - Standard: ${standardGasPrice.toString()} - Fast: ${fastGasPrice.toString()}`;
};
