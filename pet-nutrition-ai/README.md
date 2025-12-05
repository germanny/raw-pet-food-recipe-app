# Pet Nutrition Calculator

A Next.js project architected with a service class pattern for the USDA API integration, wrapped in Next.js server actions to keep API keys secure. Zustand with persist middleware for state management, giving localStorage persistence and optimized re-renders. The component structure follows separation of concerns - search, results, recipe builder, and nutrition calculator are all independent components that communicate through the global store.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deploy on Vercel

```bash
npx vercel
```
