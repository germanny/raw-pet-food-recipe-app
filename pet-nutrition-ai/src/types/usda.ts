/**
 * USDA FoodData Central API Types
 */

export interface USDANutrient {
  nutrientId: number;
  nutrientName: string;
  nutrientNumber: string;
  unitName: string;
  value: number;
}

export interface USDAFoodItem {
  fdcId: number;
  description: string;
  dataType: string;
  foodNutrients: USDANutrient[];
}

export interface USDASearchResponse {
  foods: USDAFoodItem[];
  totalHits: number;
  currentPage: number;
  totalPages: number;
}

export interface SearchFoodsParams {
  query: string;
  pageSize?: number;
  pageNumber?: number;
  dataType?: string[];
}
