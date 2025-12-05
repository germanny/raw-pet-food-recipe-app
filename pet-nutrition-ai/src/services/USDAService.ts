import { USDASearchResponse, SearchFoodsParams } from "@/types/usda";

/**
 * USDA FoodData Central API Service
 * Handles all interactions with the USDA database
 */
export class USDAService {
  private readonly baseUrl = "https://api.nal.usda.gov/fdc/v1";
  private readonly apiKey: string;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error("USDA API key is required");
    }
    this.apiKey = apiKey;
  }

  /**
   * Search for food items in the USDA database
   */
  async searchFoods(params: SearchFoodsParams): Promise<USDASearchResponse> {
    const {
      query,
      pageSize = 10,
      pageNumber = 1,
      dataType = ["SR Legacy"],
    } = params;

    const url = new URL(`${this.baseUrl}/foods/search`);
    url.searchParams.append("api_key", this.apiKey);
    url.searchParams.append("query", query);
    url.searchParams.append("pageSize", pageSize.toString());
    url.searchParams.append("pageNumber", pageNumber.toString());
    dataType.forEach((type) => url.searchParams.append("dataType", type));

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // Don't cache for fresh results
    });

    if (!response.ok) {
      throw new Error(
        `USDA API error: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  }

  /**
   * Get details for a specific food item
   */
  async getFoodDetails(fdcId: number) {
    const url = `${this.baseUrl}/food/${fdcId}?api_key=${this.apiKey}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `USDA API error: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  }
}
