/**
 * @description Query to get data from the pool
 * @param ownerAddress Address of the owner of the position
 */
export const getTokensIdQuery = (ownerAddress: string, poolABI: string) => {
    `{
        positions(where: {
            owner: "${ownerAddress}"
            pool: "${poolABI}"
        }) {
            id
            owner
        }
    }`;
};
