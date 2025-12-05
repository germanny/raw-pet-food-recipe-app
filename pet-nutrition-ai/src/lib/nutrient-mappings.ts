/**
 * USDA Nutrient ID mappings
 * https://fdc.nal.usda.gov/help.html#nutrientIDs
 */
export const NUTRIENT_IDS = {
  PROTEIN: 1003,
  TOTAL_FAT: 1004,
  CARBS: 1005,
  ENERGY: 1008, // Calories
  CALCIUM: 1087,
  PHOSPHORUS: 1092,
  IRON: 1089,
} as const;

export const NUTRIENT_NAMES: Record<number, string> = {
  [NUTRIENT_IDS.PROTEIN]: "Protein",
  [NUTRIENT_IDS.TOTAL_FAT]: "Total Fat",
  [NUTRIENT_IDS.CARBS]: "Carbohydrate",
  [NUTRIENT_IDS.ENERGY]: "Energy",
  [NUTRIENT_IDS.CALCIUM]: "Calcium",
  [NUTRIENT_IDS.PHOSPHORUS]: "Phosphorus",
  [NUTRIENT_IDS.IRON]: "Iron",
};
