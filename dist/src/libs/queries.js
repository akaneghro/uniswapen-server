"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokensIdQuery = void 0;
/**
 * @description Query to get data from the pool
 * @param ownerAddress Address of the owner of the position
 */
var getTokensIdQuery = function (ownerAddress, poolABI) {
    "{\n        positions(where: {\n            owner: \"".concat(ownerAddress, "\"\n            pool: \"").concat(poolABI, "\"\n        }) {\n            id\n            owner\n        }\n    }");
};
exports.getTokensIdQuery = getTokensIdQuery;
