import { getContract } from "./ethers";
import AggregatorABI from "../contracts/AggregatorABI.json";

export const getEthUsdPrice = async (): Promise<string> => {
    try {
        const priceFeed = getContract(
            process.env.AGGREGATOR_ADDRESS ?? "",
            AggregatorABI
        );

        const latestData = await priceFeed.latestRoundData();

        const priceRound = (latestData[1] / 10 ** 8).toFixed(2);

        return priceRound;
    } catch (error) {
        console.log(error);
        throw new Error("Error getting ETH price");
    }
};
