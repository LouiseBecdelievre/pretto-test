// src/lib/wp.ts

import { request, gql } from "graphql-request";

// URL du GraphQL (mock ou réel)
const endpoint = process.env.WP_GQL_ENDPOINT!;
if (!endpoint) {
  throw new Error("WP_GQL_ENDPOINT is not defined in environment variables");
}

/**
 * Fonction générique pour faire des requêtes GraphQL vers WordPress (ou mock)
 * @param query La requête GraphQL
 * @param variables Les variables passées à la requête (optionnel)
 * @returns Le résultat typé de la requête
 */
export async function wp<T>(query: string, variables?: Record<string, any>): Promise<T> {
  try {
    const data = await request<T>(endpoint, query, variables);
    return data;
  } catch (error: any) {
    console.error("GraphQL request error:", error);
    // On rejette ou retour d'erreur selon ton choix
    throw new Error(`GraphQL request failed: ${error.message || error}`);
  }
}
