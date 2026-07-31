# EXPLANATION.md — VitalSync Sprint 15

## Overview

Sprint 15 delivered three phases of the Track B assignment: a secured backend
CRUD API, a fully-wired frontend client, and a Stripe Checkout monetisation
layer. All work sits in a single Next.js 15 + NestJS monorepo backed by a
PostgreSQL database (hosted on Neon) managed via TypeORM.

---

## Phase 1 — Secure Backend CRUD

### Endpoints completed

| Resource | Method | Route | Auth |
|---|---|---|---|
| Appointments | GET / POST / PATCH / DELETE | `/api/appointments` | JWT required |
| Availability slots | GET / POST / DELETE | `/api/availability` | Doctor only |
| Medical records | GET / POST | `/api/medical-records` | JWT required |
| Prescriptions | GET / POST | `/api/prescriptions` | JWT required |
| Patients directory | GET | `/api/patients` | Doctor only |
| Biometrics | GET | `/api/biometrics` | Patient only |
| Clinical feed | GET | `/api/clinical-feed` | Doctor only |
| Payments | GET / POST | `/api/payments` | JWT required |

### Ownership & RBAC validation

Every protected route passes through `JwtAuthGuard`, which decodes the Bearer
token and attaches the authenticated user to `req.user`. Role enforcement is
applied at two levels:

- **Controller-level guards** (`@Roles('doctor')` / `@Roles('patient')`)
  reject requests from the wrong role with a 403 before the service layer is
  reached.
- **Service-level ownership checks** — e.g., a patient's appointment query
  is always filtered by `WHERE patient_id = req.user.id`, so a patient can
  never read another patient's records even if they guess a valid ID.

Doctors see only their own patients (filtered by `doctor_id`). Patients see
only data where they are the subject.

### Bug fixes shipped in Phase 1

| Bug | Fix |
|---|---|
| Doctor dashboard displayed a hardcoded name | Dashboard now reads the name from the JWT-decoded `currentUser` state |
| "New Patient Entry" re-opened an existing profile | Replaced the redirect with a blank `NewPatientForm` component wired to `POST /api/patients` |
| Dashboard date was a static string ("Tuesday, October 24, 2024") | Replaced with `new Date().toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' })` — always reflects the real current date |
| Login and registration had no password visibility toggle | Added a show/hide eye-icon button to both the sign-in and register inputs |

---

## Phase 2 — Client Integration & State Management

### How the frontend connects to the REST endpoints

All HTTP calls are centralised in `src/lib/api.ts` using an Axios instance
(`src/lib/axios.ts`) that automatically attaches the stored JWT as a Bearer
token on every request. There are no direct `fetch` calls scattered in
components.

`App.tsx` runs a single `loadAllData()` function inside a `useEffect` that
fires whenever `currentUser` changes. Crucially, the data-fetch is **role-split**:

- **Doctor path** — fetches appointments, availability slots, clinical feed,
  medical records, prescriptions, patient directory, and payments in one
  `Promise.all`.
- **Patient path** — fetches appointments, medical records, prescriptions,
  biometrics, and payments in a separate `Promise.all`.

This prevents patients from ever calling doctor-only endpoints (eliminating
the 403 errors that occurred with the previous monolithic fetch).

### Optimistic UI on delete / mutation

When a doctor deletes an availability slot or cancels an appointment, the item
is removed from local React state immediately (before the API call resolves):

```tsx
setAvailabilitySlots((prev) => prev.filter((s) => s.id !== id));
```

The API call runs in the background. If it fails, the component logs the
error and could be extended to restore the previous state. This gives instant
feedback without a loading spinner or full page reload.

---

## Phase 3 — Monetisation Architecture

### Stripe Checkout integration

VitalSync uses Stripe's **hosted Checkout** flow (no custom card UI, no
webhook receiver in this sprint). The flow is:

```
User clicks "Pay Now"
  → Frontend calls POST /api/payments/create-checkout-session
  → NestJS PaymentsService calls stripe.checkout.sessions.create(...)
  → Returns { checkoutUrl: "https://checkout.stripe.com/pay/cs_test_..." }
  → Frontend does window.location.href = checkoutUrl
  → Stripe hosted page collects card details
  → On success: Stripe redirects to /?payment=success&session_id=...&payment_id=...
  → App.tsx reads URL params, calls POST /api/payments/confirm/:id
  → PaymentSuccessModal is shown to the user
  → On cancel: Stripe redirects to /?payment=cancelled (params cleaned up)
```

### Two payment contexts

**Doctor dues** (`DoctorBilling` component):
- A table of outstanding clinic/membership charges pulled from `GET /api/payments?type=due`.
- Each row has a "Pay Now" button that calls `createCheckoutSession` with the
  specific amount and `referenceId` of that due.

**Patient fees** (`PatientBilling` component):
- A "Pay Custom Fee" form where the patient enters an amount and description
  (consultation fee, prescription order, or general).
- On submit, calls `createCheckoutSession` and immediately redirects to Stripe.

### Payments table schema

```sql
CREATE TABLE payments (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(id),
  type        VARCHAR(50) NOT NULL,          -- 'due' | 'consultation' | 'prescription' | 'general'
  amount      NUMERIC(10,2) NOT NULL,
  description TEXT,
  due_date    DATE,
  status      VARCHAR(20) DEFAULT 'pending', -- 'pending' | 'paid'
  stripe_session_id VARCHAR(255),
  created_at  TIMESTAMP DEFAULT NOW()
);
```

The `Payment` TypeORM entity mirrors this schema and is registered in
`data-source.ts`.

### Auth flash fix (bonus quality improvement)

A UI glitch caused the login screen to render for one frame on every page
load — even for authenticated users — because `currentUser` initialises as
`null` before `localStorage` is read. Fixed by introducing a **3-state auth
model** (`'loading' | 'authenticated' | 'unauthenticated'`) in `App.tsx`.
During the `'loading'` phase a branded `AppLoadingSpinner` renders instead of
the login screen, so `<AuthCard>` is never shown to an already-logged-in user.

---

## Security notes (pre-push audit)

- `.env` and `.env.local` are covered by `.gitignore` (`*.env*` pattern) and
  have **never been committed** to git history.
- Frontend code contains zero `sk_` Stripe secret key references — only the
  public `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is referenced client-side.
- `JWT_SECRET` fallback strings removed — the server now throws at startup if
  `JWT_SECRET` is not set in the environment, preventing accidental weak-secret
  deployments.

---

## What's Next — Sprint 16

- **UI Polish**: Transition animations between tabs, skeleton loading states
  for data-heavy sections, and a mobile-responsive patient dashboard.
- **AI Integration**: Leverage the existing `AiService` scaffolding to surface
  AI-generated clinical summaries and appointment recommendations using the
  Gemini API.
- **Webhook support**: Handle `checkout.session.completed` Stripe webhooks to
  confirm payments server-side without relying on client-side redirect params.
