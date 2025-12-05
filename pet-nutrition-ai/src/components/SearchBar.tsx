"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { searchUSDAFoods } from "@/app/actions/usda";
import { USDAFoodItem } from "@/types/usda";

interface SearchBarProps {
  onResults: (results: USDAFoodItem[]) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export function SearchBar({
  onResults,
  isLoading,
  setIsLoading,
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await searchUSDAFoods({ query: query.trim() });
      onResults(response.foods);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
      onResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSearch} className="space-y-2">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Search ingredients (e.g., grass-fed beef)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={isLoading}
          className="flex-1"
        />
        <Button type="submit" disabled={isLoading || !query.trim()}>
          {isLoading ? "Searching..." : "Search"}
        </Button>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </form>
  );
}
