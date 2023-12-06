import { Router } from "express";
import { getTwapPrice, mint } from "../libs/uniswap";
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
    const twap: string = await getTwapPrice(1000);

    res.send(twap);
});

routes.post("/createPosition", async (req, res) => {
    console.log(req.body);

    await mint(req.body.amount0, req.body.amount1);

    res.send("ok");
});
