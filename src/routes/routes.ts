import { Router } from "express";
import { mint, getTwapPrice } from "../libs/uniswap";
import { getEthUsdPrice } from "../libs/link";

export const routes = Router();

routes.get("/", async (req, res) => {
    res.send("Hello world");
});

routes.get("/ethPrice", async (req, res) => {
    const price: string = await getEthUsdPrice();

    res.send(price);
});

routes.get("/twapPrice", async (req, res) => {
    const twap: string = await getTwapPrice("WETH", "USDC", 1000);

    res.send(twap);
});

routes.post("/createPosition", async (req, res) => {
    const positionReq = req.body.position;

    const tx = await mint(
        positionReq.token0,
        positionReq.amount0,
        positionReq.token1,
        positionReq.amount1
    );

    res.send("ok");
});
