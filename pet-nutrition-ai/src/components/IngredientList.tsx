"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRecipeStore } from "@/store/recipeStore";
import { ClearRecipeButton } from "./ClearRecipeButton";

export function IngredientList() {
  const ingredients = useRecipeStore((state) => state.ingredients);
  const removeIngredient = useRecipeStore((state) => state.removeIngredient);
  const updateIngredientAmount = useRecipeStore(
    (state) => state.updateIngredientAmount
  );

  if (ingredients.length === 0) {
    return (
      <Card className="p-4">
        <p className="text-muted-foreground text-center">
          No ingredients added yet. Search and add ingredients to build your
          recipe.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Recipe Ingredients</h3>
        <ClearRecipeButton />
      </div>
      <div className="space-y-3">
        {ingredients.map((ingredient) => (
          <div
            key={ingredient.id}
            className="flex items-center gap-3 border-b pb-3 last:border-0"
          >
            <div className="flex-1">
              <p className="font-medium">{ingredient.description}</p>
            </div>
            <Input
              type="number"
              value={ingredient.amount}
              onChange={(e) =>
                updateIngredientAmount(ingredient.id, Number(e.target.value))
              }
              className="w-24"
              min="1"
            />
            <span className="text-sm text-muted-foreground">g</span>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => removeIngredient(ingredient.id)}
            >
              Remove
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
}
