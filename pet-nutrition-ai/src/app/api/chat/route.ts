import { streamText, convertToModelMessages } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";
import { NUTRITION_KNOWLEDGE } from "@/lib/nutrition-knowledge";

const SYSTEM_PROMPT = `You are a pet nutrition expert specializing in raw food diets. You help users analyze recipes based on primordial diet principles.

CORE NUTRITIONAL KNOWLEDGE:
- Atwater Factors: Protein = 4 kcal/g, Fat = 9 kcal/g, Carbs = 4 kcal/g
- Recipe composition: 8-10% bone, 8-10% organ meats (including liver), max 10% liver, 2% heart, remainder is muscle meat
- Half of diet should be ruminant, add poultry/fish for linoleic acid
- Cats need 100mg taurine/day
- Target Omega 6:Omega 3 ratio of 1.3:1

TARGET RATIOS:
Dogs:
- 20% protein as fed
- 49% of calories from protein
- 10% fat as fed
- 45% of calories from fat
- Twice as much protein as fat

Cats:
- 52% of calories from protein
- 46% of calories from fat

CALCULATIONS YOU CAN DO:
1. % calories from protein = (protein_g * 4) / total_calories * 100
2. % calories from fat = (fat_g * 9) / total_calories * 100
3. % as fed = (nutrient_g / total_weight_g) * 100
4. Caloric basis (g/1000kcal) = nutrient_g * (1000 / total_calories)

When analyzing recipes, calculate:
- Calculate actual percentages
- Compare to targets
- Identify if too high/low
- Suggest specific adjustments ("add 50g chicken breast to increase protein")

Always show your calculations and cite specific guidelines.`;

export async function POST(req: Request) {
  const body = await req.json();
  const { messages, currentRecipe } = body;

  // Build context about the current recipe
  let recipeContext = "\n\nCurrent Recipe:\n";
  if (currentRecipe?.ingredients?.length > 0) {
    recipeContext += "Ingredients:\n";
    currentRecipe.ingredients.forEach((ing: any) => {
      recipeContext += `- ${ing.description}: ${ing.amount}g (Protein: ${ing.protein}g, Fat: ${ing.fat}g)\n`;
    });
    recipeContext += `\nTotals:\n`;
    recipeContext += `- Weight: ${currentRecipe.totals.weight}g\n`;
    recipeContext += `- Protein: ${currentRecipe.totals.protein}g\n`;
    recipeContext += `- Fat: ${currentRecipe.totals.fat}g\n`;
    recipeContext += `- Carbs: ${currentRecipe.totals.carbs}g\n`;
    recipeContext += `- Calories: ${currentRecipe.totals.calories}\n`;
  } else {
    recipeContext += "No ingredients added yet.\n";
  }

  const result = await streamText({
    model: anthropic("claude-3-5-haiku-20241022"),
    system: SYSTEM_PROMPT + recipeContext,
    messages: convertToModelMessages(messages),
    tools: {
      analyzeRecipe: {
        description:
          "Analyze the current recipe's nutritional balance for cats. " +
          "Use this tool when the user asks about recipe balance, ratios, or whether the recipe meets nutritional guidelines. " +
          "The current recipe data is already provided in the system context.",
        inputSchema: z.object({
          // No parameters needed - we use currentRecipe from context
        }),
        execute: async () => {
          // Use the currentRecipe data that was passed in the request
          if (!currentRecipe?.totals || currentRecipe.totals.calories === 0) {
            return {
              error:
                "No recipe data available to analyze. Please add ingredients first.",
            };
          }

          const { protein, fat, carbs, calories } = currentRecipe.totals;

          // Calculate % calories from protein and fat
          const proteinCalories = protein * 4;
          const fatCalories = fat * 9;
          const carbCalories = carbs * 4;
          const percentProteinCal = (proteinCalories / calories) * 100;
          const percentFatCal = (fatCalories / calories) * 100;
          const percentCarbCal = (carbCalories / calories) * 100;

          // Calculate as-fed percentages (assuming total weight)
          const totalWeight = currentRecipe.ingredients.reduce(
            (sum: number, ing: any) => sum + ing.amount,
            0
          );
          const percentProteinAsFed = (protein / totalWeight) * 100;
          const percentFatAsFed = (fat / totalWeight) * 100;

          // Compare to guidelines
          const catGuidelines = NUTRITION_KNOWLEDGE.primordialDiet.cats;

          return {
            recipe: {
              totalProtein: protein,
              totalFat: fat,
              totalCarbs: carbs,
              totalCalories: calories,
              totalWeight,
              ingredientCount: currentRecipe.ingredients.length,
            },
            percentages: {
              proteinCalories: percentProteinCal,
              fatCalories: percentFatCal,
              carbCalories: percentCarbCal,
              proteinAsFed: percentProteinAsFed,
              fatAsFed: percentFatAsFed,
            },
            targets: {
              proteinCalories: catGuidelines.caloriesFromProtein * 100,
              fatCalories: catGuidelines.caloriesFromFat * 100,
            },
            evaluation: {
              proteinStatus:
                percentProteinCal >= 52
                  ? "good"
                  : percentProteinCal >= 45
                  ? "acceptable"
                  : "low",
              fatStatus:
                percentFatCal >= 46
                  ? "good"
                  : percentFatCal >= 40
                  ? "acceptable"
                  : "low",
              proteinToFatRatio: protein / fat,
            },
          };
        },
      },
    },
  });

  return result.toUIMessageStreamResponse();
}
