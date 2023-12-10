import { Token } from "@uniswap/sdk-core";
import ethers from "ethers";

export interface TokenData {
    token: Token;
    abi: ethers.ContractInterface;
}
