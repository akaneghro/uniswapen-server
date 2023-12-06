import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { routes } from "./routes/routes";
import ProviderInstance from "./services/ProviderInstance";

const port = process.env.PORT ? process.env.PORT : 8080;

global.isProduction = process.env.NODE_ENV === "production";

global.provider = ProviderInstance.getInstance();

const app = express();

app.disable("x-powered-by");

app.use(cors());

app.use(bodyParser.json());

app.use("/", routes);

app.listen(port, () => {
    console.log("Listening port", port, "http://localhost:" + port + "/");
});
