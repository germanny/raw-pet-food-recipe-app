import { EnhancedTotals } from "@/types/recipe";

/**
 * Domain knowledge for pet nutrition
 * Extracted from feeding worksheet
 */
export const NUTRITION_KNOWLEDGE = {
  atwaterFactors: {
    protein: 4, // kcal/g
    fat: 9,
    carbohydrate: 4,
  },

  merMultipliers: {
    avgNeutered: 1.6,
    avgIntact: 1.8,
    weightLoss: 1.0,
    weightGain: 1.7,
    lightWork: 2.0,
    moderateWork: 3.0,
    heavyWork: 6.0,
    growthUnder4Months: 3.0,
    growthOver4Months: 2.0,
  },

  primordialDiet: {
    dogs: {
      proteinAsFed: 0.2, // 20%
      caloriesFromProtein: 0.49, // 49%
      fatAsFed: 0.1, // 10%
      caloriesFromFat: 0.45, // 45%
    },
    cats: {
      caloriesFromProtein: 0.52, // 52%
      caloriesFromFat: 0.46, // 46%
    },
  },

  recipeGuidelines: {
    bonePercentage: { min: 0.12, max: 0.15 }, // 12-15%
    organMeatsPercentage: { min: 0.1, max: 0.15 }, // 10-15%
    liverMaxPercentage: 0.1, // max 10%
    heartPercentage: 0.02, // 2%
    ruminantPercentage: 0.5, // Half of diet should be ruminant
  },

  requirements: {
    cats: {
      taurineMgPerDay: 100,
    },
    omegaRatio: "1.3:1", // Omega 6:Omega 3
  },

  formulas: {
    metabolicWeight: (weightKg: number) => Math.pow(weightKg, 0.75),
    rer: (weightKg: number) => 70 * Math.pow(weightKg, 0.75),
    mer: (rer: number, multiplier: number) => rer * multiplier,
    dailyCaloricNeeds: (weightKg: number) => 100 * Math.pow(weightKg, 0.67),
    dryMatter: (moisture: number) => 100 - moisture,
    nutrientDryMatterBasis: (nutrient: number, dryMatter: number) =>
      (nutrient / dryMatter) * 100,
    caloricBasis: (kcalIn100g: number) => 1000 / kcalIn100g,
    percentCaloriesFromNutrient: (nutrientKcal: number, totalKcal: number) =>
      (nutrientKcal / totalKcal) * 100,
  },
};

export const NUTRITION_TARGETS = {
  dog: {
    proteinAsFed: 20, // 20%
    caloriesFromProtein: 49, // 49%
    fatAsFed: 10, // 10%
    caloriesFromFat: 45, // 45%
    note: "Twice as much protein as fat",
  },
  cat: {
    caloriesFromProtein: 52, // 52%
    caloriesFromFat: 46, // 46%
  },
};

export const ATWATER_FACTORS = {
  protein: 4, // kcal/g
  fat: 9, // kcal/g
  carbohydrate: 4, // kcal/g
};

export function analyzeRecipe(totals: EnhancedTotals, petType: "dog" | "cat") {
  const targets = NUTRITION_TARGETS[petType];

  return {
    proteinStatus: {
      actual: totals.percentProteinCalories,
      target: targets.caloriesFromProtein,
      status:
        totals.percentProteinCalories >= targets.caloriesFromProtein
          ? "good"
          : "low",
      diff: totals.percentProteinCalories - targets.caloriesFromProtein,
    },
    fatStatus: {
      actual: totals.percentFatCalories,
      target: targets.caloriesFromFat,
      status:
        totals.percentFatCalories >= targets.caloriesFromFat ? "good" : "low",
      diff: totals.percentFatCalories - targets.caloriesFromFat,
    },
  };
}
