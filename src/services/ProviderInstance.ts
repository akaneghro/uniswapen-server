import { ethers } from "ethers";

export default class ProviderInstance {
    private static instance: ProviderInstance;
    public provider: ethers.providers.JsonRpcProvider;

    private constructor() {
        this.provider = new ethers.providers.JsonRpcProvider(
            process.env.RPC_URL ?? ""
        );
    }

    public static getInstance(): ethers.providers.JsonRpcProvider {
        if (!ProviderInstance.instance) {
            ProviderInstance.instance = new ProviderInstance();
        }

        return ProviderInstance.instance.provider;
    }
}
