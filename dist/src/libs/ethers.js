"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.aproveToken = exports.getAddressBalance = exports.getContract = exports.getConnectedWallet = exports.getWallet = exports.converToGwei = exports.convertToWei = void 0;
var ethers_1 = require("ethers");
/**
 * @description convert an amount to wei
 * @param amount The amount to convert
 * @param decimals The decimals of the token
 * @returns The amount in wei
 */
var convertToWei = function (amount, decimals) {
    return parseInt(ethers_1.ethers.utils.parseUnits(amount.toString(), decimals).toString());
};
exports.convertToWei = convertToWei;
/**
 * @description convert an amount to gwei
 * @param amount The amount to convert
 * @returns The amount in gwei
 */
var converToGwei = function (amount) {
    return parseInt(ethers_1.ethers.utils.parseUnits(amount.toString(), 9).toString());
};
exports.converToGwei = converToGwei;
/**
 * @description Get the wallet
 * @returns The wallet
 */
var getWallet = function () {
    var _a;
    var wallet = new ethers_1.ethers.Wallet((_a = process.env.WALLET_SECRET) !== null && _a !== void 0 ? _a : "");
    return wallet;
};
exports.getWallet = getWallet;
/**
 * @description Get the connected wallet
 * @returns The connected wallet
 */
var getConnectedWallet = function () {
    var wallet = new ethers_1.ethers.Wallet(process.env.WALLET_SECRET);
    var connectedWallet = wallet.connect(global.provider);
    return connectedWallet;
};
exports.getConnectedWallet = getConnectedWallet;
/**
 * @description Get the contract from an address and an abi
 * @param contractAddress The address of the contract
 * @param contractABI The abi of the contract
 * @returns The contract
 */
var getContract = function (contractAddress, contractABI) {
    var contract = new ethers_1.ethers.Contract(contractAddress, contractABI, global.provider);
    return contract;
};
exports.getContract = getContract;
/**
 * @description Get the token balance of an address
 * @param ownerAddress The address of the owner
 * @param tokenAddress The address of the token
 * @param tokenDecimals The decimals of the token
 * @returns The balance of the address
 */
var getAddressBalance = function (ownerAddress, tokenAddress, tokenAbi, tokenDecimals) { return __awaiter(void 0, void 0, void 0, function () {
    var contract, balance, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                contract = (0, exports.getContract)(tokenAddress, tokenAbi);
                return [4 /*yield*/, contract.balanceOf(ownerAddress)];
            case 1:
                balance = ((_a.sent()) /
                    Math.pow(10, tokenDecimals)).toString();
                return [2 /*return*/, balance];
            case 2:
                error_1 = _a.sent();
                console.log(error_1);
                throw new Error("Error getting address balance");
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getAddressBalance = getAddressBalance;
/**
 * @description Aprove a token to be used by a contract
 * @param tokenAddress The address of the token
 * @param tokenAbi The abi of the token
 */
var aproveToken = function (tokenAddress, tokenAbi, amount) { return __awaiter(void 0, void 0, void 0, function () {
    var tokenContract, error_2;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                tokenContract = (0, exports.getContract)(tokenAddress, tokenAbi);
                return [4 /*yield*/, tokenContract
                        .connect((0, exports.getConnectedWallet)())
                        .approve((_a = process.env.POSITION_MANAGER_ADDRESS) !== null && _a !== void 0 ? _a : "", amount)];
            case 1:
                _b.sent();
                return [3 /*break*/, 3];
            case 2:
                error_2 = _b.sent();
                console.log(error_2);
                throw new Error("Error approving token");
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.aproveToken = aproveToken;
