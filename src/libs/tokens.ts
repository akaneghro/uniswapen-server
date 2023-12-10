import { Token } from "@uniswap/sdk-core";
import { TokenData } from "../models/TokenData";
import WETH from "../contracts/WETH.json";
import USDC from "../contracts/USDC.json";

export const WETH_TOKEN_DATA: TokenData = {
    token: new Token(
        parseInt(process.env.CHAIN_ID),
        process.env.NODE_ENV === "production"
            ? WETH.address
            : WETH.addressTestnet,
        WETH.decimals,
        "WETH"
    ),
    abi: JSON.stringify(
        process.env.NODE_ENV === "production" ? WETH.abi : WETH.abiTestnet
    ),
};

export const USDC_TOKEN_DATA: TokenData = {
    token: new Token(
        parseInt(process.env.CHAIN_ID),
        process.env.NODE_ENV === "production"
            ? USDC.address
            : USDC.addressTestnet,
        USDC.decimals,
        "USDC"
    ),
    abi: JSON.stringify(
        process.env.NODE_ENV === "production" ? USDC.abi : USDC.abiTestnet
    ),
};

const tokenDataList: TokenData[] = [WETH_TOKEN_DATA, USDC_TOKEN_DATA];

export const getTokenData = (tokenCode: string): TokenData => {
    return tokenDataList.find(
        (tokenData) => tokenData.token.symbol === tokenCode
    );
};
