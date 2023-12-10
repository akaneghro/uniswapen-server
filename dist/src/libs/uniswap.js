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
var polygon_1 = require("./polygon");
var queries_1 = require("../libs/queries");
var tokens_1 = require("../libs/tokens");
var PositionManagerABI_json_1 = __importDefault(require("../contracts/PositionManagerABI.json"));
var v3_sdk_1 = require("@uniswap/v3-sdk");
var sdk_core_1 = require("@uniswap/sdk-core");
var IUniswapV3Pool_json_1 = __importDefault(require("@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json"));
var IERC20Metadata_json_1 = __importDefault(require("@uniswap/v3-periphery/artifacts/contracts/interfaces/IERC20Metadata.sol/IERC20Metadata.json"));
/**
 * @description Create a pool instance with the current data
 * @returns The pool intance with its data
 */
var getPoolState = function (tokenA, tokenB, poolFee) { return __awaiter(void 0, void 0, void 0, function () {
    var poolAddress, poolContract, _a, token0, token1, fee, tickSpacing, liquidity, slot0;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                poolAddress = getPoolAddress(tokenA, tokenB, poolFee);
                poolContract = (0, ethers_1.getContract)(poolAddress, IUniswapV3Pool_json_1.default.abi);
                return [4 /*yield*/, Promise.all([
                        poolContract.token0(),
                        poolContract.token1(),
                        poolContract.fee(),
                        poolContract.tickSpacing(),
                        poolContract.liquidity(),
                        poolContract.slot0(),
                    ])];
            case 1:
                _a = _b.sent(), token0 = _a[0], token1 = _a[1], fee = _a[2], tickSpacing = _a[3], liquidity = _a[4], slot0 = _a[5];
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
 * @description Mint a new liquidity position.
 * @param token0Code The code of the first token
 * @param amount0 The amount of token0 to mint
 * @param token1Code The code of the second token
 * @param amount1 The amount of token1 to mint
 */
var mint = function (token0Code, amount0, token1Code, amount1) { return __awaiter(void 0, void 0, void 0, function () {
    var tokenData0, tokenData1, poolState, configuredPool, position, mintOptions, _a, calldata, value, gasPrice, nonce, transaction, estimatedGas, signer;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                tokenData0 = (0, tokens_1.getTokenData)(token0Code);
                tokenData1 = (0, tokens_1.getTokenData)(token1Code);
                return [4 /*yield*/, (0, ethers_1.aproveToken)(tokenData0.token.address, IERC20Metadata_json_1.default.abi, (0, ethers_1.convertToWei)(amount0.toString(), tokenData0.token.decimals))];
            case 1:
                _c.sent();
                return [4 /*yield*/, (0, ethers_1.aproveToken)(tokenData1.token.address, IERC20Metadata_json_1.default.abi, (0, ethers_1.convertToWei)(amount1.toString(), tokenData1.token.decimals))];
            case 2:
                _c.sent();
                return [4 /*yield*/, getPoolState(tokenData0.token, tokenData1.token, v3_sdk_1.FeeAmount.LOW)];
            case 3:
                poolState = _c.sent();
                configuredPool = new v3_sdk_1.Pool(tokenData0.token, tokenData1.token, poolState.fee, poolState.sqrtPriceX96.toString(), poolState.liquidity.toString(), poolState.tick);
                position = v3_sdk_1.Position.fromAmounts({
                    pool: configuredPool,
                    tickLower: (0, v3_sdk_1.nearestUsableTick)(poolState.tick, poolState.tickSpacing) -
                        poolState.tickSpacing * 500,
                    tickUpper: (0, v3_sdk_1.nearestUsableTick)(poolState.tick, poolState.tickSpacing) +
                        poolState.tickSpacing * 500,
                    amount0: (0, ethers_1.convertToWei)(amount0.toString(), tokenData0.token.decimals),
                    amount1: (0, ethers_1.convertToWei)(amount1.toString(), tokenData1.token.decimals),
                    useFullPrecision: true,
                });
                mintOptions = {
                    recipient: global.owner,
                    deadline: Math.floor(Date.now() / 1000) + 60 * 5,
                    slippageTolerance: new sdk_core_1.Percent(50, 10000),
                };
                _a = v3_sdk_1.NonfungiblePositionManager.addCallParameters(position, mintOptions), calldata = _a.calldata, value = _a.value;
                return [4 /*yield*/, global.provider.getFeeData()];
            case 4:
                gasPrice = _c.sent();
                console.log("gas price:", gasPrice.gasPrice.toString());
                return [4 /*yield*/, global.provider.getTransactionCount(global.owner, "latest")];
            case 5:
                nonce = _c.sent();
                console.log("nonce:", nonce);
                transaction = {
                    data: calldata,
                    to: (_b = process.env.POSITION_MANAGER_ADDRESS) !== null && _b !== void 0 ? _b : "",
                    value: value,
                    from: global.owner,
                    gasPrice: gasPrice.gasPrice * 1.5,
                };
                return [4 /*yield*/, global.provider.estimateGas(transaction)];
            case 6:
                estimatedGas = _c.sent();
                console.log("estimated gas:", estimatedGas.toString());
                signer = (0, ethers_1.getConnectedWallet)();
                return [2 /*return*/];
        }
    });
}); };
exports.mint = mint;
/**
 * @description Get the pool address from two tokens
 * @param tokenA The first token
 * @param tokenB The second token
 * @param poolFee The fee of the pool
 */
var getPoolAddress = function (tokenA, tokenB, poolFee) {
    var _a;
    return (0, v3_sdk_1.computePoolAddress)({
        factoryAddress: (_a = process.env.POOL_FACTORY_ADDRESS) !== null && _a !== void 0 ? _a : "",
        tokenA: tokenA,
        tokenB: tokenB,
        fee: poolFee,
    });
};
/**
 * @description Get the tokens id from an owner in a pool
 * @param ownerAddress The address of the owner
 */
var getPositionsFromOwner = function (token0Code, token1Code, ownerAddress) { return __awaiter(void 0, void 0, void 0, function () {
    var tokenData0, tokenData1, poolAddress, poolAbi, query, response, positions, pool_1, error_1;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 3, , 4]);
                tokenData0 = (0, tokens_1.getTokenData)(token0Code);
                tokenData1 = (0, tokens_1.getTokenData)(token1Code);
                poolAddress = getPoolAddress(tokenData0.token, tokenData1.token, v3_sdk_1.FeeAmount.LOW);
                return [4 /*yield*/, (0, polygon_1.getContractAbiPolygonScan)(poolAddress)];
            case 1:
                poolAbi = _c.sent();
                query = (0, queries_1.getTokensIdQuery)(ownerAddress, poolAbi.toString());
                return [4 /*yield*/, axios_1.default.post((_a = process.env.POOL_SUBGRAPH) !== null && _a !== void 0 ? _a : "", JSON.stringify({ query: query }))];
            case 2:
                response = _c.sent();
                positions = response.data.data.positions;
                pool_1 = (0, ethers_1.getContract)((_b = process.env.POSITION_MANAGER_ADDRESS) !== null && _b !== void 0 ? _b : "", PositionManagerABI_json_1.default);
                positions.map(function (p) {
                    return pool_1
                        .positions(p.id)
                        .call()
                        .then(function (position) { return console.log(position); });
                });
                return [3 /*break*/, 4];
            case 3:
                error_1 = _c.sent();
                console.log(error_1);
                throw new Error("Error getting positions from owner");
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getPositionsFromOwner = getPositionsFromOwner;
/**
 * @description The the Time Weight Average Price for tokens in a pool
 * @param seconds The last x seonds to calculate the TWAP
 */
var getTwapPrice = function (token0Code, token1Code, seconds) { return __awaiter(void 0, void 0, void 0, function () {
    var tokenData0, tokenData1, poolAddress, poolAbi, pool, observeData, tickCumulatives, tickCumulativesDelta, arithmeticMeanTick, arithmeticMeanTickInt, sqrtRatioX96, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                tokenData0 = (0, tokens_1.getTokenData)(token0Code);
                tokenData1 = (0, tokens_1.getTokenData)(token1Code);
                poolAddress = getPoolAddress(tokenData0.token, tokenData1.token, v3_sdk_1.FeeAmount.LOW);
                return [4 /*yield*/, (0, polygon_1.getContractAbiPolygonScan)(poolAddress)];
            case 1:
                poolAbi = _a.sent();
                pool = (0, ethers_1.getContract)(poolAddress, poolAbi);
                return [4 /*yield*/, pool.observe([seconds, 0])];
            case 2:
                observeData = _a.sent();
                tickCumulatives = observeData.tickCumulatives.map(function (t) {
                    return Number(t);
                });
                tickCumulativesDelta = tickCumulatives[1] - tickCumulatives[0];
                arithmeticMeanTick = (tickCumulativesDelta / seconds).toFixed(0);
                arithmeticMeanTickInt = parseInt(arithmeticMeanTick);
                sqrtRatioX96 = v3_sdk_1.TickMath.getSqrtRatioAtTick(arithmeticMeanTickInt);
                return [2 /*return*/, getPriceFromSqrtRatio(tokenData0.token, tokenData1.token, sqrtRatioX96)];
            case 3:
                error_2 = _a.sent();
                console.log(error_2);
                throw new Error("Error getting TWAP price");
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getTwapPrice = getTwapPrice;
/**
 * @description Get the price from a tick
 * @param tick The tick to get the price from
 * @param baseToken The base token
 * @param quoteToken The quote token
 */
var getPriceFromTick = function (baseToken, quoteToken, tick) {
    var sqrtRatioX96 = v3_sdk_1.TickMath.getSqrtRatioAtTick(tick);
    return getPriceFromSqrtRatio(baseToken, quoteToken, sqrtRatioX96);
};
/**
 * @description Get the price from a sqrt ratio
 * @param sqrtRatioX96 The sqrt ratio
 * @param baseToken The base token
 * @param quoteToken The quote token
 * @returns The price
 */
var getPriceFromSqrtRatio = function (baseToken, quoteToken, sqrtRatioX96) {
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
