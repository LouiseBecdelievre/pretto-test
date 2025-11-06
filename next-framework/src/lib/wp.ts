import { request } from "graphql-request";

const endpoint = process.env.WP_GQL_ENDPOINT!;
if (!endpoint) {
  throw new Error("WP_GQL_ENDPOINT is not defined in environment variables");
}

/**
 * Fonction générique pour faire des requêtes GraphQL vers WordPress
 * @param query 
 * @param variables 
 * @returns Request result
 */
export async function wp<T>(query: string, variables?: Record<string, any>): Promise<T> {
  try {
    const data = await request<T>(endpoint, query, variables);
    return data;
  } catch (error: any) {
    console.error("GraphQL request error:", error);

    throw new Error(`GraphQL request failed: ${error.message || error}`);
  }
}
