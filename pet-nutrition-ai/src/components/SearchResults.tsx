"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { USDAFoodItem } from "@/types/usda";
import { useRecipeStore } from "@/store/recipeStore";
import { NUTRIENT_IDS } from "@/lib/nutrient-mappings";

interface SearchResultsProps {
  results: USDAFoodItem[];
  isLoading: boolean;
}

export function SearchResults({ results, isLoading }: SearchResultsProps) {
  const addIngredient = useRecipeStore((state) => state.addIngredient);

  const handleAddIngredient = (food: USDAFoodItem) => {
    const nutrients = food.foodNutrients.map((n) => ({
      nutrientId: n.nutrientId,
      nutrientName: n.nutrientName,
      amount: n.value,
      unit: n.unitName,
    }));

    addIngredient({
      fdcId: food.fdcId,
      description: food.description,
      amount: 100, // Default to 100g
      nutrients,
    });
  };

  const getNutrientValue = (food: USDAFoodItem, nutrientId: number) => {
    const nutrient = food.foodNutrients.find(
      (n) => n.nutrientId === nutrientId
    );
    return nutrient ? `${nutrient.value}${nutrient.unitName}` : "N/A";
  };

  if (isLoading) {
    return <Card className="p-4">Searching...</Card>;
  }

  if (results.length === 0) {
    return null;
  }

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4">Search Results</h3>
      <ScrollArea className="h-[400px]">
        <div className="space-y-4">
          {results.map((food) => (
            <div key={food.fdcId} className="border-b pb-4 last:border-0">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <h4 className="font-medium">{food.description}</h4>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    <Badge variant="secondary">
                      Protein: {getNutrientValue(food, NUTRIENT_IDS.PROTEIN)}
                    </Badge>
                    <Badge variant="secondary">
                      Fat: {getNutrientValue(food, NUTRIENT_IDS.TOTAL_FAT)}
                    </Badge>
                    <Badge variant="secondary">
                      Carbs: {getNutrientValue(food, NUTRIENT_IDS.CARBS)}
                    </Badge>
                  </div>
                </div>
                <Button onClick={() => handleAddIngredient(food)} size="sm">
                  Add
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}
