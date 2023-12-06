import { Token } from "@uniswap/sdk-core";
import WETH from "../contracts/WETH.json";
import USDC from "../contracts/USDC.json";

export const WETH_TOKEN = new Token(
    parseInt(process.env.CHAIN_ID),
    process.env.NODE_ENV === "production" ? WETH.address : WETH.addressTestnet,
    WETH.decimals,
    "WETH",
    "Wrapped Ether"
);

export const USDC_TOKEN = new Token(
    parseInt(process.env.CHAIN_ID),
    process.env.NODE_ENV === "production" ? USDC.address : USDC.addressTestnet,
    USDC.decimals,
    "USDC",
    "'USD//C'"
);
