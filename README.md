<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/aebe7c11-5ffd-49ff-8dd0-2c8926036faa

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Copy `.env.example` to `.env.local` and set your environment values.
   - `NEXT_PUBLIC_API_BASE_URL` should point to your backend host including the API prefix, for example `http://localhost:3001/api`
   - optionally set `GEMINI_API_KEY` if your app uses AI features
3. Run the app:
   `npm run dev`

## Frontend entrypoint

The active Next.js app lives in `src/app/`. The client renders from `src/App.tsx` via `src/app/page.tsx`.

## Backend connection

The frontend sends API requests through `src/lib/axios.ts` using `NEXT_PUBLIC_API_BASE_URL`.
The currently expected backend routes are:
- `POST /auth/login`
- `GET /auth/me`
- `GET /patients`
- `GET /appointments`
- `POST /appointments`
- `PATCH /appointments/:id`
- `GET /availability`
- `POST /availability`
- `DELETE /availability/:id`
- `GET /medical-records`
- `POST /medical-records`
- `GET /prescriptions`
- `POST /prescriptions`
- `GET /clinical-feed`
- `GET /biometrics`
- `PUT /biometrics`
- `POST /ai/clinical-summary`

If your backend uses different route names, I can map the frontend API client to those exact endpoints next.
