import { EnhancedTotals, RecipeIngredient, RecipeTotals } from "@/types/recipe";
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

export function calculateEnhancedTotals(
  ingredients: RecipeIngredient[]
): EnhancedTotals {
  // Sum up all macronutrients
  const totals = calculateRecipeTotals(ingredients);

  // Calculate total weight
  const totalWeight = ingredients.reduce((sum, i) => sum + i.amount, 0);

  // Calculate calories from each macronutrient
  const proteinCalories = totals.protein * 4; // Atwater
  const fatCalories = totals.fat * 9;
  const carbCalories = totals.carbs * 4;

  // Calculate percentages
  const percentProteinCalories = (proteinCalories / totals.calories) * 100;
  const percentFatCalories = (fatCalories / totals.calories) * 100;
  const percentCarbCalories = (carbCalories / totals.calories) * 100;

  // Calculate as fed percentages
  const proteinAsFed = (totals.protein / totalWeight) * 100;
  const fatAsFed = (totals.fat / totalWeight) * 100;

  // Caloric basis (g/1000kcal)
  const caloricBasis = 1000 / totals.calories;
  const proteinPer1000kcal = totals.protein * caloricBasis;
  const fatPer1000kcal = totals.fat * caloricBasis;

  // Estimate dry matter (rough approximation since we don't have water data)
  // Most raw meat is ~70-75% water
  const dryMatter = totalWeight * 0.25; // Rough estimate

  return {
    ...totals,
    totalWeight,
    dryMatter,
    proteinCalories,
    fatCalories,
    carbCalories,
    percentProteinCalories,
    percentFatCalories,
    percentCarbCalories,
    proteinAsFed,
    fatAsFed,
    proteinPer1000kcal,
    fatPer1000kcal,
  };
}
