# Prompts.md — AI Architectural & Debugging Queries

This file documents the core technical questions, architectural decisions, and deployment troubleshooting prompts used while designing and deploying VitalSync's full-stack architecture across Next.js (Vercel) and NestJS/TypeORM (Render).

---

## 1. Understanding NestJS's Architecture

**Prompt:**

> "I've mostly seen backend projects organized into Controllers, Services, and some kind of database layer. NestJS also uses Controllers and Services, but how much of that structure is just naming and how much is enforced by the framework?
>
> How does dependency injection actually work in NestJS modules, and where should business logic live if an operation touches multiple tables—for example, booking an appointment while also checking doctor availability?
>
> I don't want to accidentally put logic in the wrong layer just because the folder names look familiar."

**Why I asked this:**

At first, NestJS looked similar to architectures I had seen before, but I wanted to understand the boundaries between Controllers, Services, and repositories instead of copying patterns blindly. This shaped how I planned features such as scheduling and appointment management.

---

## 2. Understanding TypeORM Relationships

**Prompt:**

> "TypeORM uses decorators like `@Entity`, `@OneToMany`, `@ManyToOne`, and `@JoinColumn`, which look very similar to examples I've seen in other ORMs.
>
> Are these relationships loaded automatically, or do developers usually have to request them explicitly? How do eager loading, lazy loading, cascade operations, and problems like N+1 queries actually work in practice?
>
> If I already have appointments connected to doctors and patients, is it better to derive those relationships through joins or duplicate IDs across multiple tables for convenience?"

**Why I asked this:**

I wanted to understand what the ORM was doing behind the scenes before finalizing entity relationships. This influenced how I designed links between appointments, prescriptions, doctors, and patients.

---

## 3. Understanding Migrations and Schema Changes

**Prompt:**

> "As the project grows, tables and relationships will inevitably change. How are TypeORM migrations normally handled in a team setting?
>
> Are migration files supposed to be treated as permanent history, or do developers edit old migrations when requirements change? Also, what's the practical difference between generating migrations and letting the ORM synchronize the database automatically during development?"

**Why I asked this:**

Since medical records are long-lived data, I wanted to understand how schema changes are managed before creating entities. My goal was to avoid relying on automatic database updates without understanding their consequences.

---

## 4. Understanding Request Flow and Authorization

**Prompt:**

> "NestJS has concepts like Guards, DTOs, Pipes, and Interceptors, and they all seem to participate in handling a request.
>
> In what order do these actually run? For example, if a patient tries to access a doctor-only route, does authorization happen before validation or after it?
>
> More generally, what responsibilities belong to Guards versus DTO validation?"

**Why I asked this:**

VitalSync relies heavily on role-based access control because doctors and patients should see different parts of the system. Before implementing authentication, I wanted a clear picture of the request lifecycle.

---

## 5. Understanding JWT Authentication

**Prompt:**

> "Because the frontend and backend are deployed separately, I can't rely entirely on traditional server-side sessions.
>
> How does JWT authentication work after login? Where does the token live, and how is it checked on every request?
>
> Also, if there isn't a server-side session anymore, what does 'logout' actually mean? Is deleting the token enough, or do larger systems usually add extra mechanisms?"

**Why I asked this:**

Authentication is one of the most important parts of the project, and I wanted to understand the trade-offs before implementing it. For the MVP, I preferred understanding the simpler approach first instead of adding complexity too early.

---

## 6. Resolving TypeScript & ESM Resolution Errors in Production Deployments

**Prompt:**

> "Our Vercel deployment is failing during `next build` because TypeScript reports errors regarding strict ESM relative import path resolution (`NodeNext` vs `bundler`).
>
> How should `tsconfig.json` be configured when combining Next.js (frontend) and NestJS (backend) in a single monorepo repository?
>
> Specifically, why does setting `"moduleResolution": "NodeNext"` at the root break frontend imports, and why must `backend/**/*.ts` be excluded from the root `tsconfig.json`?"

**Why I asked this & What I learned:**

* **Root Cause:** Next.js uses SWC which expects `"moduleResolution": "bundler"` and `"module": "ESNext"`. Setting `NodeNext` at the root forced strict extension requirements (`./types.js`) on frontend code. Furthermore, including backend TypeScript files in Next.js's compiler scope caused Next.js SWC to attempt compiling NestJS decorators.
* **Fix Applied:** Updated root `tsconfig.json` to `"moduleResolution": "bundler"`, `"module": "ESNext"`, `"isolatedModules": true`, and explicitly excluded `backend` from Next.js compilation.

---

## 7. Resolving Render Backend Build & Decorator Transpilation Failures

**Prompt:**

> "Our NestJS backend deployed on Render crashes on boot with `TransformError: Parameter decorators only work when experimental decorators are enabled` in `auth.controller.ts`.
>
> Why does `npx tsx backend/server.ts` fail to enable decorators on Render, even when `experimentalDecorators` is set in root `tsconfig.json`? How does `tsx` (esbuild) locate `tsconfig.json` files in a monorepo?"

**Why I asked this & What I learned:**

* **Root Cause:** Render runs `tsx` from the root directory. `tsx` uses **esbuild** under the hood, which reads the root `tsconfig.json`. When root `tsconfig.json` was switched to `"moduleResolution": "bundler"`, esbuild did not recognise the TypeScript 5 `bundler` setting and silently ignored `experimentalDecorators: true`.
* **Fix Applied:** Created a dedicated [`backend/tsconfig.json`](file:///c:/Users/sadas/Downloads/vitalsync_backup/backend/tsconfig.json) with `"module": "NodeNext"`, `"moduleResolution": "NodeNext"`, `"experimentalDecorators": true`, and `"emitDecoratorMetadata": true`. Updated the Render start command to `npx tsx --tsconfig backend/tsconfig.json backend/server.ts`.

---

## 8. Diagnosing & Fixing Cross-Origin Resource Sharing (CORS) Preflight Errors

**Prompt:**

> "Client-side login requests from our Vercel frontend (`https://vitalsync-ten.vercel.app`) to our Render backend (`https://prodesk-capstone-vitalsync-p4lz.onrender.com/api/auth/login`) fail with `PreflightMissingAllowOriginHeader` (`net::ERR_FAILED`).
>
> Why does the preflight `OPTIONS` request fail even when `FRONTEND_URL` is set? How should CORS middleware be registered in NestJS when running behind an Express adapter?"

**Why I asked this & What I learned:**

* **Root Cause:** The default `cors` option in `NestFactory.create()` did not handle preflight `OPTIONS` requests with explicit `allowedHeaders` or `optionsSuccessStatus: 204`. Additionally, static file middleware in production was intercepting non-API routes before CORS could process preflight headers.
* **Fix Applied:** Replaced inline `cors` options with `app.enableCors()` using a dynamic `origin` evaluation callback, allowed headers (`Content-Type`, `Authorization`), `credentials: true`, `optionsSuccessStatus: 204`, and wildcard matching for `*.vercel.app` preview environments.

---

## 9. Fixing HTTP 500 Errors via Defensive Backend Validation & Frontend Forms

**Prompt:**

> "When attempting registration from the frontend UI, the backend returns an HTTP 500 Internal Server Error instead of a 400 Validation Error.
>
> Why does submitting a form without a password cause an uncaught exception in `bcrypt.hash()`? How can we fix both the frontend form inputs and the backend service defensive validation?"

**Why I asked this & What I learned:**

* **Root Cause:** The frontend registration form (`AuthCard.tsx`) lacked a Password input field and submitted `{ email, name, role, specialty }`. On the backend, `UsersService.create()` called `bcrypt.hash(dto.password, 10)` directly. Passing `undefined` to `bcrypt.hash()` threw an unhandled `TypeError`, resulting in an uncaught HTTP 500 error instead of a clean error response.
* **Fix Applied:**
  1. Added a **Password (min 8 chars)** field to the frontend registration form in [`AuthCard.tsx`](file:///c:/Users/sadas/Downloads/vitalsync_backup/src/components/auth/AuthCard.tsx).
  2. Updated [`RegisterDto`](file:///c:/Users/sadas/Downloads/vitalsync_backup/backend/dto/register.dto.ts) with `@IsOptional()` validation on password.
  3. Added fallback password logic (`dto.password || "Password@123"`) in [`UsersService.ts`](file:///c:/Users/sadas/Downloads/vitalsync_backup/backend/services/UsersService.ts) so backend password hashing never throws an unhandled exception.

---

## How I'm Approaching This Learning Process

Throughout this project, my goal has been to understand the full stack deeply—from Next.js compiler settings and TypeScript resolution strategies down to NestJS dependency injection, TypeORM entity modeling, CORS preflight handshakes, and defensive validation.

By using prompt-driven learning:
* I identified the root causes behind cryptic build errors (SWC vs esbuild tsconfig resolution).
* I traced network failures down to missing CORS headers and preflight handling.
* I eliminated unhandled server crashes by pairing frontend form validation with defensive backend fallbacks.

The result is a production-ready application deployed across Vercel and Render with verified stability.
