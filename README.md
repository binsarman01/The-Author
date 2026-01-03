# The Author — Next.js + TypeScript PWA scaffold

This repository contains a Vercel-ready Next.js + TypeScript progressive web app scaffold for "The Author". It includes a serverless API proxy for connecting to a Gemini-compatible endpoint using the GEMINI_API_KEY environment variable (do NOT commit secrets).

Files included:
- package.json
- next.config.js
- tsconfig.json
- public/manifest.json
- public/favicon.ico (placeholder)
- pages/_app.tsx
- pages/index.tsx
- pages/chat.tsx
- pages/image-tools.tsx
- pages/writer.tsx
- pages/api/gemini.ts
- components/Chat.tsx, ImageTools.tsx, Writer.tsx
- lib/storage.ts
- styles/globals.css

Local development
1. Install dependencies:
   npm install
2. Run the dev server:
   npm run dev
3. Open http://localhost:3000

Vercel deployment
1. Import this repository into Vercel (https://vercel.com/new)
2. In your Vercel project settings, add an environment variable named GEMINI_API_KEY and set it to your provider API key.
   - Optionally set GEMINI_TEXT_ENDPOINT and GEMINI_IMAGE_ENDPOINT to point to your provider's endpoints if defaults are not correct.
3. Deploy. The app uses Next.js API routes, which run as serverless functions on Vercel.

PWA
- The project includes a manifest at public/manifest.json and a placeholder favicon. You can install the app to your device from supported browsers.
- A simple service worker is not included by default to keep the scaffold minimal — you can add one (e.g. via next-pwa) or a custom service worker file and register it in pages/_app.tsx.

API Proxy (pages/api/gemini.ts)
- The API route expects POST requests with JSON body: { type: 'text'|'image', payload: { ... } }
- It will forward the payload to a Gemini-compatible endpoint and attach the Authorization: Bearer <GEMINI_API_KEY> header.
- If GEMINI_API_KEY is missing the route returns a helpful error. Do NOT commit your API keys.

Notes & limitations
- The Gemini endpoints used in the default code are placeholders (https://api.gemini.example/...). Replace them with the real endpoints for your provider or set GEMINI_TEXT_ENDPOINT and GEMINI_IMAGE_ENDPOINT in Vercel.
- Large documents (>100k words): this scaffold contains UI stubs for book generation and chunking. Generating very large outputs from an LLM will likely require chunking, streaming and local caching. Chunking strategies, cost estimation and resumable uploads are left to implement based on your needs.
- Costs: be mindful of request volume and token limits with your Gemini provider. Monitor usage in your provider console and set rate limits and batching as required.

Extending the project
- Add next-pwa or a custom service worker implementation for offline support and caching
- Add authentication if you want per-user storage of history
- Improve the Gemini proxy to support streaming responses and multipart uploads for images

This commit: "Web app: Next.js + TypeScript PWA scaffold for The Author (Gemini proxy)".

Happy building!
