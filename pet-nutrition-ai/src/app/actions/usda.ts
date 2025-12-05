"use server";

import { USDAService } from "@/services/USDAService";
import { SearchFoodsParams, USDASearchResponse } from "@/types/usda";

/**
 * Server action to search USDA database
 * This wraps the service class for use in Next.js
 */
export async function searchUSDAFoods(
  params: SearchFoodsParams
): Promise<USDASearchResponse> {
  const apiKey = process.env.USDA_API_KEY;

  if (!apiKey) {
    throw new Error("USDA API key not configured");
  }

  const service = new USDAService(apiKey);
  return service.searchFoods(params);
}
