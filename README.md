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

The chat API requires a Gemini API key and Upstash Redis credentials. Copy the variable names from `.env.example` into `.env.local`, then fill in the secret values. Never commit `.env.local` or expose API keys with a `NEXT_PUBLIC_` prefix.

- `GEMINI_API_KEY`: secret key from Google AI Studio.
- `GEMINI_MODEL`: model name; defaults to `gemini-2.5-flash`.
- `SITE_ORIGIN`: exact production origin, such as `https://example.com`; local development uses `http://localhost:3000`.
- `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`: Upstash credentials. The API also accepts `KV_REST_API_URL` and `KV_REST_API_TOKEN`.
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET`: optional Cloudflare Turnstile keys. If the secret is set, the widget site key must also be set.

Create and connect an Upstash Redis database before using the chat. Add the same required variables to the Vercel project settings and redeploy after changing them. The Vercel deployment region is configured as Frankfurt (`fra1`).
