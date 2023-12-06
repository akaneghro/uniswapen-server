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
exports.getTwapPrice = exports.getPositionsFromOwner = exports.mint = void 0;
var axios_1 = __importDefault(require("axios"));
var jsbi_1 = __importDefault(require("jsbi"));
var ethers_1 = require("./ethers");
var queries_1 = require("../libs/queries");
var tokens_1 = require("../libs/tokens");
var PositionManagerABI_json_1 = __importDefault(require("../contracts/PositionManagerABI.json"));
var PoolABI_json_1 = __importDefault(require("../contracts/PoolABI.json"));
var v3_sdk_1 = require("@uniswap/v3-sdk");
var IUniswapV3Pool_json_1 = __importDefault(require("@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json"));
var INonfungiblePositionManager_json_1 = __importDefault(require("@uniswap/v3-periphery/artifacts/contracts/interfaces/INonfungiblePositionManager.sol/INonfungiblePositionManager.json"));
/**
 * @description Create a pool instance with the current data
 * @returns The pool intance with its data
 */
var getPoolState = function (tokenA, tokenB, poolFee) { return __awaiter(void 0, void 0, void 0, function () {
    var currentPoolAddress, poolContract, _a, token0, token1, fee, tickSpacing, liquidity, slot0;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                currentPoolAddress = (0, v3_sdk_1.computePoolAddress)({
                    factoryAddress: (_b = process.env.POOL_FACTORY_ADDRESS) !== null && _b !== void 0 ? _b : "",
                    tokenA: tokenA,
                    tokenB: tokenB,
                    fee: poolFee,
                });
                poolContract = (0, ethers_1.getContract)(currentPoolAddress, IUniswapV3Pool_json_1.default.abi);
                return [4 /*yield*/, Promise.all([
                        poolContract.token0(),
                        poolContract.token1(),
                        poolContract.fee(),
                        poolContract.tickSpacing(),
                        poolContract.liquidity(),
                        poolContract.slot0(),
                    ])];
            case 1:
                _a = _c.sent(), token0 = _a[0], token1 = _a[1], fee = _a[2], tickSpacing = _a[3], liquidity = _a[4], slot0 = _a[5];
                return [2 /*return*/, {
                        token0: token0,
                        token1: token1,
                        fee: fee,
                        tickSpacing: tickSpacing,
                        liquidity: liquidity,
                        sqrtPriceX96: slot0[0],
                        tick: slot0[1],
                    }];
        }
    });
}); };
/**
 * @description Mint a lew liquidity position.
 * @param amount0 The amount of token0 to mint
 * @param amount1 The amount of token1 to mint
 */
var mint = function (amount0, amount1) { return __awaiter(void 0, void 0, void 0, function () {
    var poolState, configuredPool, position, params, nonfungiblePositionManagerContract;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, (0, ethers_1.aproveToken)(tokens_1.WETH_TOKEN.address)];
            case 1:
                _b.sent();
                return [4 /*yield*/, (0, ethers_1.aproveToken)(tokens_1.USDC_TOKEN.address)];
            case 2:
                _b.sent();
                return [4 /*yield*/, getPoolState(tokens_1.WETH_TOKEN, tokens_1.USDC_TOKEN, v3_sdk_1.FeeAmount.LOW)];
            case 3:
                poolState = _b.sent();
                configuredPool = new v3_sdk_1.Pool(tokens_1.WETH_TOKEN, tokens_1.USDC_TOKEN, poolState.fee, poolState.sqrtPriceX96.toString(), poolState.liquidity.toString(), poolState.tick);
                position = v3_sdk_1.Position.fromAmounts({
                    pool: configuredPool,
                    tickLower: (0, v3_sdk_1.nearestUsableTick)(poolState.tick, poolState.tickSpacing) -
                        poolState.tickSpacing * 50,
                    tickUpper: (0, v3_sdk_1.nearestUsableTick)(poolState.tick, poolState.tickSpacing) +
                        poolState.tickSpacing * 50,
                    amount0: amount0,
                    amount1: amount1,
                    useFullPrecision: true,
                });
                params = {
                    token0: tokens_1.WETH_TOKEN.address,
                    token1: tokens_1.USDC_TOKEN.address,
                    fee: poolState.fee,
                    tickLower: position.tickLower.toString(),
                    tickUpper: position.tickUpper.toString(),
                    amount0Desired: position.amount0.toString(),
                    amount1Desired: position.amount1.toString(),
                    amount0Min: position.amount0.toString(),
                    amount1Min: position.amount1.toString(),
                    recipient: process.env.WALLET,
                    deadline: Math.floor(Date.now() / 1000) + 60 * 10, //10 minutes
                };
                nonfungiblePositionManagerContract = (0, ethers_1.getContract)((_a = process.env.POSITION_MANAGER_ADDRESS) !== null && _a !== void 0 ? _a : "", INonfungiblePositionManager_json_1.default.abi);
                return [2 /*return*/];
        }
    });
}); };
exports.mint = mint;
/**
 * @description Get the tokens id from an owner in a pool
 * @param ownerAddress The address of the owner
 */
var getPositionsFromOwner = function (ownerAddress) { return __awaiter(void 0, void 0, void 0, function () {
    var query, response, positions, pool_1, error_1;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                query = (0, queries_1.getTokensIdQuery)(ownerAddress, PoolABI_json_1.default.toString());
                return [4 /*yield*/, axios_1.default.post((_a = process.env.POOL_SUBGRAPH) !== null && _a !== void 0 ? _a : "", JSON.stringify({ query: query }))];
            case 1:
                response = _c.sent();
                positions = response.data.data.positions;
                pool_1 = (0, ethers_1.getContract)((_b = process.env.POSITION_MANAGER_ADDRESS) !== null && _b !== void 0 ? _b : "", PositionManagerABI_json_1.default);
                positions.map(function (p) {
                    return pool_1
                        .positions(p.id)
                        .call()
                        .then(function (position) { return console.log(position); });
                });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _c.sent();
                console.log(error_1);
                throw new Error("Error getting positions from owner");
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getPositionsFromOwner = getPositionsFromOwner;
/**
 * @description The the Time Weight Average Price for tokens in a pool
 * @param seconds The last x seonds to calculate the TWAP
 */
var getTwapPrice = function (seconds) { return __awaiter(void 0, void 0, void 0, function () {
    var pool, observeData, tickCumulatives, tickCumulativesDelta, arithmeticMeanTick, arithmeticMeanTickInt, sqrtRatioX96, error_2;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                pool = (0, ethers_1.getContract)((_a = process.env.POOL_ADDRESS) !== null && _a !== void 0 ? _a : "", PoolABI_json_1.default);
                return [4 /*yield*/, pool.observe([seconds, 0])];
            case 1:
                observeData = _b.sent();
                tickCumulatives = observeData.tickCumulatives.map(function (t) {
                    return Number(t);
                });
                tickCumulativesDelta = tickCumulatives[1] - tickCumulatives[0];
                arithmeticMeanTick = (tickCumulativesDelta / seconds).toFixed(0);
                arithmeticMeanTickInt = parseInt(arithmeticMeanTick);
                sqrtRatioX96 = v3_sdk_1.TickMath.getSqrtRatioAtTick(arithmeticMeanTickInt);
                return [2 /*return*/, getPriceFromSqrtRatio(sqrtRatioX96, tokens_1.WETH_TOKEN, tokens_1.USDC_TOKEN)];
            case 2:
                error_2 = _b.sent();
                console.log(error_2);
                throw new Error("Error getting TWAP price");
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getTwapPrice = getTwapPrice;
var getPriceFromSqrtRatio = function (sqrtRatioX96, baseToken, quoteToken) {
    var ratioX96 = jsbi_1.default.multiply(sqrtRatioX96, sqrtRatioX96);
    var baseAmount = jsbi_1.default.BigInt(Math.pow(10, baseToken.decimals));
    var shiftedAmount = jsbi_1.default.leftShift(jsbi_1.default.BigInt(1), jsbi_1.default.BigInt(192));
    var quoteAmount;
    if (baseToken.address < quoteToken.address) {
        quoteAmount = v3_sdk_1.FullMath.mulDivRoundingUp(ratioX96, baseAmount, shiftedAmount);
    }
    else {
        quoteAmount = v3_sdk_1.FullMath.mulDivRoundingUp(shiftedAmount, baseAmount, ratioX96);
    }
    var price = quoteAmount.toString() / Math.pow(10, quoteToken.decimals);
    return price.toString();
};
