# Sprint 15 — Checklist, Explanation Guide Prompt & Security Audit

## 1. Sprint 15 Completion Checklist

**Phase 1 — CRUD (P0):**
- [ ] Appointments: Create, Read, Update (reschedule), Delete (cancel) all wired to real DB calls
- [ ] Patient records: Create, Read confirmed working end-to-end
- [ ] Prescriptions: Create + list working
- [ ] Ownership/RBAC enforced (patient sees only their own data, doctor sees only their own patients)

**Bug fixes:**
- [ ] Doctor dashboard name now pulls from logged-in user, not hardcoded
- [ ] "New Patient Entry" opens a blank create form (not a redirect to an existing profile)
- [ ] Password show/hide eye icon added to login + registration
- [ ] Dashboard date now reflects the real current date, not a static placeholder

**Phase 2 — Client Integration (P1):**
- [ ] Frontend hooked into all CRUD endpoints
- [ ] Optimistic UI on delete (no reload/wait needed)

**Phase 3 — Monetization (P2):**
- [ ] Stripe Checkout integrated for doctor dues/clinic charges
- [ ] Stripe Checkout integrated for patient consultation fees / prescription orders / general fee
- [ ] Success/cancel redirect routes working
- [ ] `payments` table added to schema.sql, full schema regenerated

**Before submission:**
- [ ] Prompts.md updated with all prompts used
- [ ] Redeployed to Render/Vercel with latest code
- [ ] Demo video recorded (CRUD lifecycle + Stripe checkout walkthrough)

---

## 2. Prompt to get the explanation guide written

```
Write an explanation guide (as EXPLANATION.md) documenting what was built in
Sprint 15, structured around the three Track B phases from the assignment:

Phase 1 — Secure Backend CRUD: describe the endpoints completed, the
ownership/RBAC validation logic (how a doctor vs patient's access is
restricted), and the three bug fixes (dashboard name, New Patient Entry
redirect, dashboard date, password toggle).

Phase 2 — Client Integration & State Management: describe how the frontend
connects to the REST endpoints and how optimistic UI updates work on
delete/mutation actions.

Phase 3 — Monetization Architecture: describe the Stripe Checkout
integration for both doctor dues payments and patient consultation/
prescription payments, the payments table schema, and the Checkout Session
flow (session creation → redirect → success page).

Keep it clear and concise — written for a reviewer/grader to understand the
architecture quickly, not a full technical deep-dive. Include a short
"What's Next" section mentioning UI polish and AI integration are planned
for Sprint 16.
```

---

## 3. Secure GitHub push — checklist + prompt

**Do these yourself, manually, before anything else:**

1. Confirm `.env`, `.env.local` are in `.gitignore` — run `git status` and make sure no `.env*` file shows as tracked or staged.
2. Run `git log --all --full-history -- "*.env*"` to check no `.env` file was **ever** committed in your history, even if you later added it to `.gitignore` (gitignore doesn't retroactively remove already-committed files).
3. If any secret *was* ever committed (even in an old commit), the fix isn't just deleting the file now — it's still in git history and pushed the moment you push. In that case: **rotate the key immediately** (regenerate the Stripe secret key, JWT secret, DB password from Neon) rather than trying to scrub history, since that's the reliable fix.
4. Double-check you're only using the **Stripe Publishable Key** in frontend code — grep your frontend folder for `sk_` (secret keys start with `sk_`, publishable keys start with `pk_`) to make sure a secret key never made it into client-side code.

**Prompt to have Antigravity audit this for you:**

```
Before I push to GitHub, audit my repo for any leaked secrets or credentials.
Specifically:
1. Search all files (including git history if possible) for Stripe secret
   keys (sk_test_ or sk_live_ prefix), JWT secrets, database connection
   strings, and any hardcoded passwords.
2. Confirm .env and .env.local are properly listed in .gitignore and are
   not tracked by git.
3. Confirm the frontend code only ever references the Stripe Publishable
   Key (pk_ prefix) and never the Secret Key.
4. Check my NestJS Guards/JWT strategy for any hardcoded secret fallback
   values (a common mistake is `process.env.JWT_SECRET || "somedefault"` —
   flag any of these).
5. List anything found, and tell me exactly which file/line to fix before
   I commit.
```

Run that audit prompt **before** your next `git add .` — not after. If it flags anything already committed in an older commit, rotate the key rather than trying to rewrite history under deadline pressure; that's the safer call this close to submission.