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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decreaseLiquidity = exports.increaseLiquidity = void 0;
var ethers_1 = require("ethers");
var PositionManagerABI_json_1 = __importDefault(require("../contracts/PositionManagerABI.json"));
/**
 * @description Increase the liquidity of a position
 * @param owner  The owner of the position
 * @param tokenId The id of the position
 * @param amount0Desired The amount of token0 to add
 * @param amount1Desired The amount of token1 to add
 */
var increaseLiquidity = function (tokenId, amount0Desired, amount1Desired) { return __awaiter(void 0, void 0, void 0, function () {
    var pool, wallet, connectedWallet, params;
    var _a, _b;
    return __generator(this, function (_c) {
        pool = new ethers_1.ethers.Contract((_a = process.env.POSITION_MANAGER_ADDRESS) !== null && _a !== void 0 ? _a : "", PositionManagerABI_json_1.default, global.provider);
        wallet = new ethers_1.ethers.Wallet((_b = process.env.WALLET_SECRET) !== null && _b !== void 0 ? _b : "");
        connectedWallet = wallet.connect(global.provider);
        params = {
            tokenId: tokenId,
            amount0Desired: amount0Desired.toString(),
            amount1Desired: amount1Desired.toString(),
            amount0Min: 0,
            amount1Min: 0,
            deadline: Math.floor(Date.now() / 1000) + 60 * 10,
        };
        pool.connect(connectedWallet)
            .increaseLiquidity(params, { gasLimit: 1000000 })
            .then(function (tx) {
            console.log(tx);
            tx.wait().then(function (receipt) {
                console.log(receipt);
            });
        });
        return [2 /*return*/];
    });
}); };
exports.increaseLiquidity = increaseLiquidity;
/**
 * @description Decrease the liquidity of a position
 * @param owner  The owner of the position
 * @param tokenId The id of the position
 * @param liquidityPercentage The percentage in decimals of liquidity to remove
 */
var decreaseLiquidity = function (owner, tokenId, liquidityPercentage) { return __awaiter(void 0, void 0, void 0, function () {
    var pool, wallet, connectedWallet;
    var _a, _b;
    return __generator(this, function (_c) {
        if (liquidityPercentage > 1) {
            throw new Error("Liquidity percentage must be in decimals");
        }
        pool = new ethers_1.ethers.Contract((_a = process.env.POSITION_MANAGER_ADDRESS) !== null && _a !== void 0 ? _a : "", PositionManagerABI_json_1.default, global.provider);
        wallet = new ethers_1.ethers.Wallet((_b = process.env.WALLET_SECRET) !== null && _b !== void 0 ? _b : "");
        connectedWallet = wallet.connect(global.provider);
        pool.connect(connectedWallet)
            .positions(tokenId)
            .then(function (position) {
            var totalLiquidity = position.liquidity.toString();
            var liquidityToDecrease = parseInt(totalLiquidity) * liquidityPercentage;
            var params = {
                tokenId: tokenId,
                liquidity: liquidityToDecrease.toString(),
                amount0Min: 0,
                amount1Min: 0,
                deadline: Math.floor(Date.now() / 1000) + 60 * 10,
            };
            pool.connect(connectedWallet)
                .decreaseLiquidity(params, { gasLimit: 1000000 })
                .then(function (tx) {
                console.log(tx);
                tx.wait().then(function (receipt) {
                    console.log(receipt);
                });
            });
        });
        return [2 /*return*/];
    });
}); };
exports.decreaseLiquidity = decreaseLiquidity;
