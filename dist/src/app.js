"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var body_parser_1 = __importDefault(require("body-parser"));
var routes_1 = require("./routes/routes");
var ProviderInstance_1 = __importDefault(require("./services/ProviderInstance"));
var port = process.env.PORT ? process.env.PORT : 8080;
global.isProduction = process.env.NODE_ENV === "production";
global.provider = ProviderInstance_1.default.getInstance();
global.owner = (_a = process.env.WALLET) !== null && _a !== void 0 ? _a : "";
var app = (0, express_1.default)();
app.disable("x-powered-by");
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use("/", routes_1.routes);
app.listen(port, function () {
    console.log("Listening port", port, "http://localhost:" + port + "/");
});
