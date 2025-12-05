"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRecipeStore } from "@/store/recipeStore";

export function NutritionSummary() {
  const totals = useRecipeStore((state) => state.totals);

  // Derived state - calculates total weight from all ingredients
  const totalWeight = useRecipeStore((state) =>
    state.ingredients.reduce((sum, i) => sum + i.amount, 0)
  );

  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4">Nutritional Totals</h3>

      {/* Total Weight Badge at top */}
      {totalWeight > 0 && (
        <div className="mb-4 pb-4 border-b">
          <p className="text-sm text-muted-foreground">Total Recipe Weight</p>
          <p className="text-3xl font-bold">{totalWeight}g</p>
        </div>
      )}

      {/* Nutrition Totals */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Protein</p>
          <p className="text-2xl font-bold">{totals.protein}g</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Fat</p>
          <p className="text-2xl font-bold">{totals.fat}g</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Carbs</p>
          <p className="text-2xl font-bold">{totals.carbs}g</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Calories</p>
          <p className="text-2xl font-bold">{totals.calories}</p>
        </div>
      </div>
    </Card>
  );
}
