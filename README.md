# Food Delivery Dashboard

A responsive food-delivery dashboard built with Next.js App Router and React. It includes a product catalog, category filtering, search, favorites, a cart counter, and a mobile-style bottom navigation.

## Requirements

- Node.js 20.9 or later
- npm

## Getting started

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint |

For a production run:

```bash
npm run build
npm start
```

## Project structure

```text
app/
  globals.css       Global styles and design tokens
  layout.js         Root layout and page metadata
  page.js           Dashboard state and page composition
components/         Reusable UI components
data/
  products.js       Product, category, and navigation data
lib/                Shared helpers
public/images/      Product and interface images
```

The home page composes the header, search and filter controls, category scroller, product grid, and bottom navigation. Product data is currently local in `data/products.js`; cart and favorites are client-side UI state and are not persisted to a backend.

## Environment variables


No environment variables are required for local development. Put local secrets in `.env.local`; do not commit secret values. Use `.env.example` to document required variable names without including credentials.
