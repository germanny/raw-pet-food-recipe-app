"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useRecipeStore } from "@/store/recipeStore";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export function ChatInterface() {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Get current recipe from store for display purposes
  const ingredients = useRecipeStore((state) => state.ingredients);
  const totals = useRecipeStore((state) => state.totals);

  // Create transport with prepareSendMessagesRequest to inject current recipe data
  // Don't use useMemo with dependencies because we want to access the store directly
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        prepareSendMessagesRequest: (options) => {
          // Get the CURRENT values from the store at request time
          const currentIngredients = useRecipeStore.getState().ingredients;
          const currentTotals = useRecipeStore.getState().totals;

          // Return the complete request with currentRecipe data
          return {
            ...options,
            body: {
              ...options.body,
              id: options.id,
              messages: options.messages,
              trigger: options.trigger,
              messageId: options.messageId,
              currentRecipe: {
                ingredients: currentIngredients,
                totals: currentTotals,
              },
            },
          };
        },
      }),
    [] // Empty deps - we want the same transport instance, but it will read fresh data from store
  );

  const { messages, sendMessage, status, error } = useChat({
    transport,
    onError: (error) => {
      console.error("Chat error:", error);
    },
    onFinish: (options) => {
      console.log("Message finished:", {
        finishReason: options.finishReason,
        isError: options.isError,
        isAbort: options.isAbort,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    sendMessage({ text: input });
    setInput("");
  };

  // Auto-scroll when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Card className="p-4 h-[500px] flex flex-col">
      {error && (
        <div className="text-sm text-red-500 mb-2">Error: {error.message}</div>
      )}
      <h3 className="font-semibold mb-4">AI Nutrition Assistant</h3>

      {messages.length === 0 && (
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <p className="mb-2">Ask me about your recipe!</p>
            <p className="text-sm">
              Try: "Is this balanced for my cat?" or "How can I add more
              protein?"
            </p>
          </div>
        </div>
      )}

      <ScrollArea className="flex-1 mb-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`p-3 rounded-lg ${
                message.role === "user"
                  ? "bg-blue-100 ml-8"
                  : "bg-gray-100 mr-8"
              }`}
            >
              <p className="text-sm font-medium mb-1">
                {message.role === "user" ? "You" : "Recipe Assistant"}
              </p>
              <div className="text-sm whitespace-pre-wrap">
                {message.parts.map((part, i) => {
                  if (part.type === "text") {
                    return (
                      <p key={i} className="mb-2">
                        {part.text}
                      </p>
                    );
                  }
                  if (part.type === "step-start") {
                    return (
                      <div
                        key={i}
                        className="text-xs text-blue-700 my-2 p-2 bg-blue-50 rounded border border-blue-200 flex items-center gap-2"
                      >
                        <div className="animate-spin">⟳</div>
                        <span>Processing step...</span>
                      </div>
                    );
                  }
                  if (part.type.startsWith("tool-")) {
                    const toolPart = part as any;
                    return (
                      <div
                        key={i}
                        className="text-xs text-purple-700 my-2 p-2 bg-purple-50 rounded border border-purple-200"
                      >
                        🔧 Tool executing
                        {toolPart.state === "output-available" && " ✓"}
                      </div>
                    );
                  }
                  // Log all part types to help debug
                  console.log("Message part:", part.type, part);
                  return null;
                })}
              </div>
            </div>
          ))}
          {status === "streaming" && (
            <div className="flex items-center gap-2 text-sm text-blue-600 p-3 bg-blue-50 rounded-lg mr-8 border border-blue-200">
              <div className="animate-pulse">●</div>
              <span>AI is working...</span>
            </div>
          )}
          {status === "submitted" && (
            <div className="flex items-center gap-2 text-sm text-gray-600 p-3 bg-gray-50 rounded-lg mr-8">
              <div className="animate-spin">⟳</div>
              <span>Sending message...</span>
            </div>
          )}
        </div>
      </ScrollArea>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your recipe..."
          disabled={status === "streaming"}
          className="flex-1"
        />
        <Button
          type="submit"
          disabled={status === "streaming" || !input.trim()}
        >
          Send
        </Button>
      </form>
    </Card>
  );
}
