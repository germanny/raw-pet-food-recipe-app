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

export interface EnhancedTotals extends RecipeTotals {
  totalWeight: number;
  dryMatter: number;

  // Caloric breakdown
  proteinCalories: number;
  fatCalories: number;
  carbCalories: number;

  // % of calories
  percentProteinCalories: number;
  percentFatCalories: number;
  percentCarbCalories: number;

  // As Fed percentages
  proteinAsFed: number;
  fatAsFed: number;

  // Caloric basis (g/1000kcal)
  proteinPer1000kcal: number;
  fatPer1000kcal: number;
}
