"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRecipeStore } from "@/store/recipeStore";
import { calculateEnhancedTotals } from "@/lib/nutrition-calculator";

export function NutritionSummary() {
  const ingredients = useRecipeStore((state) => state.ingredients);
  const enhancedTotals = calculateEnhancedTotals(ingredients);

  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4">Nutritional Analysis</h3>

      {/* Total Weight */}
      {enhancedTotals.totalWeight > 0 && (
        <div className="mb-4 pb-4 border-b">
          <p className="text-sm text-muted-foreground">Total Recipe Weight</p>
          <p className="text-2xl font-bold">{enhancedTotals.totalWeight}g</p>
        </div>
      )}

      {/* Nutrition Totals */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Protein</p>
          <p className="text-2xl font-bold">{enhancedTotals.protein}g</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Fat</p>
          <p className="text-2xl font-bold">{enhancedTotals.fat}g</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Carbs</p>
          <p className="text-2xl font-bold">{enhancedTotals.carbs}g</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Calories</p>
          <p className="text-2xl font-bold">{enhancedTotals.calories}</p>
        </div>
      </div>
    </Card>
  );
}
