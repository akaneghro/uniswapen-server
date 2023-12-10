"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokenData = exports.USDC_TOKEN_DATA = exports.WETH_TOKEN_DATA = void 0;
var sdk_core_1 = require("@uniswap/sdk-core");
var WETH_json_1 = __importDefault(require("../contracts/WETH.json"));
var USDC_json_1 = __importDefault(require("../contracts/USDC.json"));
exports.WETH_TOKEN_DATA = {
    token: new sdk_core_1.Token(parseInt(process.env.CHAIN_ID), process.env.NODE_ENV === "production"
        ? WETH_json_1.default.address
        : WETH_json_1.default.addressTestnet, WETH_json_1.default.decimals, "WETH"),
    abi: JSON.stringify(process.env.NODE_ENV === "production" ? WETH_json_1.default.abi : WETH_json_1.default.abiTestnet),
};
exports.USDC_TOKEN_DATA = {
    token: new sdk_core_1.Token(parseInt(process.env.CHAIN_ID), process.env.NODE_ENV === "production"
        ? USDC_json_1.default.address
        : USDC_json_1.default.addressTestnet, USDC_json_1.default.decimals, "USDC"),
    abi: JSON.stringify(process.env.NODE_ENV === "production" ? USDC_json_1.default.abi : USDC_json_1.default.abiTestnet),
};
var tokenDataList = [exports.WETH_TOKEN_DATA, exports.USDC_TOKEN_DATA];
var getTokenData = function (tokenCode) {
    return tokenDataList.find(function (tokenData) { return tokenData.token.symbol === tokenCode; });
};
exports.getTokenData = getTokenData;
