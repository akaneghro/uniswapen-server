"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ethers_1 = require("ethers");
var ProviderInstance = /** @class */ (function () {
    function ProviderInstance() {
        var _a;
        this.provider = new ethers_1.ethers.providers.JsonRpcProvider((_a = process.env.RPC_URL) !== null && _a !== void 0 ? _a : "");
    }
    ProviderInstance.getInstance = function () {
        if (!ProviderInstance.instance) {
            ProviderInstance.instance = new ProviderInstance();
        }
        return ProviderInstance.instance.provider;
    };
    return ProviderInstance;
}());
exports.default = ProviderInstance;
