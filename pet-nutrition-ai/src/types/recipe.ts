export interface NutrientInfo {
  nutrientId: number;
  nutrientName: string;
  amount: number;
  unit: string;
}

export interface RecipeIngredient {
  id: string;
  fdcId: number;
  description: string;
  amount: number; // in grams
  nutrients: NutrientInfo[];
}

export interface RecipeTotals {
  protein: number;
  fat: number;
  carbs: number;
  calories: number;
}

export interface Recipe {
  ingredients: RecipeIngredient[];
  totals: RecipeTotals;
}
