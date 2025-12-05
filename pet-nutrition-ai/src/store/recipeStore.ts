import { create } from "zustand";
import { persist } from "zustand/middleware";
import { RecipeIngredient, RecipeTotals } from "@/types/recipe";
import { calculateRecipeTotals } from "@/lib/nutrition-calculator";

interface RecipeState {
  ingredients: RecipeIngredient[];
  totals: RecipeTotals;

  // Actions
  addIngredient: (ingredient: Omit<RecipeIngredient, "id">) => void;
  removeIngredient: (id: string) => void;
  updateIngredientAmount: (id: string, amount: number) => void;
  clearRecipe: () => void;
}

/**
 * Recipe store using Zustand
 * Persists to localStorage so recipes survive refresh
 */
export const useRecipeStore = create<RecipeState>()(
  persist(
    (set) => ({
      ingredients: [],
      totals: { protein: 0, fat: 0, carbs: 0, calories: 0 },

      addIngredient: (ingredient) =>
        set((state) => {
          const newIngredient: RecipeIngredient = {
            ...ingredient,
            id: crypto.randomUUID(),
          };
          const newIngredients = [...state.ingredients, newIngredient];
          return {
            ingredients: newIngredients,
            totals: calculateRecipeTotals(newIngredients),
          };
        }),

      removeIngredient: (id) =>
        set((state) => {
          const newIngredients = state.ingredients.filter((i) => i.id !== id);
          return {
            ingredients: newIngredients,
            totals: calculateRecipeTotals(newIngredients),
          };
        }),

      updateIngredientAmount: (id, amount) =>
        set((state) => {
          const newIngredients = state.ingredients.map((i) =>
            i.id === id ? { ...i, amount } : i
          );
          return {
            ingredients: newIngredients,
            totals: calculateRecipeTotals(newIngredients),
          };
        }),

      clearRecipe: () =>
        set({
          ingredients: [],
          totals: { protein: 0, fat: 0, carbs: 0, calories: 0 },
        }),
    }),
    {
      name: "pet-nutrition-recipe", // localStorage key
    }
  )
);
