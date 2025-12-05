"use client";

import { useState } from "react";
import { SearchBar } from "@/components/SearchBar";
import { SearchResults } from "@/components/SearchResults";
import { IngredientList } from "@/components/IngredientList";
import { NutritionSummary } from "@/components/NutritionSummary";
import { USDAFoodItem } from "@/types/usda";
import { ChatInterface } from "@/components/ChatInterface";

export default function Home() {
  const [searchResults, setSearchResults] = useState<USDAFoodItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Pet Nutrition Calculator</h1>
        <p className="text-muted-foreground">
          Build custom raw pet food recipes with USDA nutritional data
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <SearchBar
            onResults={setSearchResults}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
          <SearchResults results={searchResults} isLoading={isLoading} />
        </div>

        <div className="space-y-6">
          <NutritionSummary />
          <IngredientList />
        </div>
      </div>
      <div className="mt-8 border-t pt-8">
        <ChatInterface />
      </div>
    </div>
  );
}
