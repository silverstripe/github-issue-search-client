/**
 * These types will be search via the GraphQL API
 */
export const graphqlTypes = ['issue', 'pr'];

/**
 * These types will be search via the Rest API
 */
export const restTypes = ['code', 'commits'];

/**
 * Should the provided type be resolve with the GraphQL API
 * @param {string} type
 * @returns bool
 */
export function isGraphqlType(type) {
  return graphqlTypes.includes(type);
}

/**
 * Should the provided type be resolve with the REST API
 * @param {string} type
 * @returns bool
 */
 export function isRestType(type) {
  return restTypes.includes(type);
}
