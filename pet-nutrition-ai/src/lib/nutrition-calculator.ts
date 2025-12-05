import { RecipeIngredient, RecipeTotals } from "@/types/recipe";
import { NUTRIENT_IDS } from "./nutrient-mappings";

/**
 * Calculate nutritional totals for a recipe
 * USDA values are per 100g, so we scale by ingredient amount
 */
export function calculateRecipeTotals(
  ingredients: RecipeIngredient[]
): RecipeTotals {
  const totals: RecipeTotals = {
    protein: 0,
    fat: 0,
    carbs: 0,
    calories: 0,
  };

  ingredients.forEach((ingredient) => {
    ingredient.nutrients.forEach((nutrient) => {
      // Scale by amount (USDA is per 100g)
      const scaledAmount = (nutrient.amount * ingredient.amount) / 100;

      switch (nutrient.nutrientId) {
        case NUTRIENT_IDS.PROTEIN:
          totals.protein += scaledAmount;
          break;
        case NUTRIENT_IDS.TOTAL_FAT:
          totals.fat += scaledAmount;
          break;
        case NUTRIENT_IDS.CARBS:
          totals.carbs += scaledAmount;
          break;
        case NUTRIENT_IDS.ENERGY:
          totals.calories += scaledAmount;
          break;
      }
    });
  });

  // Round to 2 decimal places
  return {
    protein: Math.round(totals.protein * 100) / 100,
    fat: Math.round(totals.fat * 100) / 100,
    carbs: Math.round(totals.carbs * 100) / 100,
    calories: Math.round(totals.calories * 100) / 100,
  };
}
