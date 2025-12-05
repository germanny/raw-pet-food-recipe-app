import { Button } from "@/components/ui/button";
import { useRecipeStore } from "@/store/recipeStore";

export function ClearRecipeButton() {
  const clearRecipe = useRecipeStore((state) => state.clearRecipe);
  const hasIngredients = useRecipeStore(
    (state) => state.ingredients.length > 0
  );

  if (!hasIngredients) return null;

  return (
    <Button variant="outline" onClick={clearRecipe}>
      Clear Recipe
    </Button>
  );
}
