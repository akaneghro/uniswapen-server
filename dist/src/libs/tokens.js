"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.USDC_TOKEN = exports.WETH_TOKEN = void 0;
var sdk_core_1 = require("@uniswap/sdk-core");
var WETH_json_1 = __importDefault(require("../contracts/WETH.json"));
var USDC_json_1 = __importDefault(require("../contracts/USDC.json"));
exports.WETH_TOKEN = new sdk_core_1.Token(parseInt(process.env.CHAIN_ID), process.env.NODE_ENV === "production" ? WETH_json_1.default.address : WETH_json_1.default.addressTestnet, WETH_json_1.default.decimals, "WETH", "Wrapped Ether");
exports.USDC_TOKEN = new sdk_core_1.Token(parseInt(process.env.CHAIN_ID), process.env.NODE_ENV === "production" ? USDC_json_1.default.address : USDC_json_1.default.addressTestnet, USDC_json_1.default.decimals, "USDC", "'USD//C'");
