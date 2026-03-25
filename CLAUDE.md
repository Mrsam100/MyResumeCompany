# TheResumeCompany — AI Resume Builder

## Project Vision
We are building an AI-powered resume builder SaaS to disrupt the resume builder industry. The goal is to create the best AI resume builder on the market — perfect templates, perfect AI writing, perfect user experience.

## Key Decisions
- **Target:** B2C job seekers (students, professionals, career changers)
- **Monetization:** Credits-only (no subscriptions)
  - Free signup = 100 credits
  - Credit packs: ₹199/200, ₹449/500, ₹899/1,200
  - Credits never expire
- **AI Features:** Bullet writer, summary writer, full resume generator, ATS scorer/optimizer, cover letter generator
- **Timeline:** ~95 days (3 months) to production launch
- **Starting from:** Zero. No code, no design, no brand assets.

---

## Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Framework | Next.js 16 (App Router) + TypeScript | SSR for SEO, React ecosystem, API routes built-in |
| Styling | Tailwind CSS v4 + shadcn/ui v4 | Ship fast, consistent design system (base-ui, NOT radix — no `asChild`) |
| State | Zustand | Lightweight, no boilerplate, great for editor state |
| Resume Editor | Custom React editor + dnd-kit | Full control over layout, drag-and-drop sections |
| PDF Export | @react-pdf/renderer | Pixel-perfect PDFs from React components |
| AI Engine | Gemini API (Google Generative AI SDK) | Fast, high-quality writing for professional content |
| Auth | NextAuth.js v5 (Auth.js) | Google/GitHub/email login, session management |
| Database | PostgreSQL via Supabase | Auth, realtime, storage, DB in one platform |
| ORM | Drizzle ORM | Type-safe, zero-codegen, SQL-like, lightweight |
| Validation | Zod v4 | Runtime type validation, form validation, API validation |
| Payments | Razorpay (Orders + Webhooks) | INR credit pack purchases, client-side modal checkout |
| File Storage | Supabase Storage | Generated PDFs, user uploads |
| Hosting | Vercel | Zero-config Next.js, edge functions, analytics |
| Email | Resend | Transactional emails (welcome, receipts, etc.) |
| Error Tracking | Sentry | Production error monitoring |
| Analytics | PostHog | Product analytics, feature flags, session replay |

---

## Project Structure

```
src/
├── app/
│   ├── (marketing)/      # Landing, pricing, about, blog
│   │   ├── page.tsx       # Landing page
│   │   ├── pricing/
│   │   ├── about/
│   │   ├── privacy/
│   │   └── terms/
│   ├── (auth)/            # Auth pages
│   │   ├── login/
│   │   ├── signup/
│   │   └── forgot-password/
│   ├── (app)/             # Authenticated app
│   │   ├── dashboard/
│   │   ├── editor/[id]/
│   │   ├── templates/
│   │   ├── credits/
│   │   └── settings/
│   ├── api/               # API routes
│   │   ├── auth/
│   │   ├── resumes/
│   │   ├── ai/
│   │   │   ├── bullet-points/
│   │   │   ├── summary/
│   │   │   ├── full-resume/
│   │   │   ├── ats-scan/
│   │   │   ├── ats-optimize/
│   │   │   └── cover-letter/
│   │   ├── export/
│   │   ├── credits/
│   │   └── webhooks/
│   ├── r/[slug]/          # Public resume page
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                # shadcn/ui primitives
│   ├── layout/            # Header, Sidebar, Footer
│   ├── resume/            # Resume display components
│   ├── editor/            # Editor-specific components
│   ├── ai/                # AI feature components
│   │   ├── bullet-generator.tsx
│   │   ├── summary-generator.tsx
│   │   ├── resume-wizard.tsx
│   │   ├── ats-scanner.tsx
│   │   └── cover-letter-generator.tsx
│   ├── templates/         # Template gallery components
│   └── marketing/         # Landing page components
├── lib/
│   ├── ai/                # Gemini API client, prompts, utils
│   │   ├── client.ts      # Lazy-init Google Generative AI SDK with generateAIResponse()
│   │   ├── prompts.ts     # System prompts + prompt builders + sanitize()
│   │   ├── credit-check.ts # checkAuth() + deductCreditsForAI() + refundCredits()
│   │   ├── rate-limiter.ts # In-memory per-user rate limiter (20/hr free, 100/hr Pro)
│   │   └── parse-json.ts  # Multi-strategy JSON extraction from AI responses
│   ├── pdf/               # PDF generation logic
│   ├── razorpay/          # Razorpay client, signature verification, rate-limit
│   ├── supabase/          # Supabase client config
│   ├── db/                # Drizzle DB client, schema, utility functions
│   ├── validations/       # Zod schemas
│   └── utils.ts           # General helpers (cn, formatDate, etc.)
├── templates/             # Resume template React components
│   ├── classic-professional/
│   ├── modern-minimal/
│   └── ... (one folder per template)
├── types/                 # TypeScript type definitions
│   ├── resume.ts
│   ├── template.ts
│   └── index.ts
├── hooks/                 # Custom React hooks
│   ├── use-autosave.ts
│   ├── use-pdf-export.ts
│   ├── use-keyboard-shortcuts.ts
│   ├── use-current-user.ts
│   └── use-require-auth.ts
├── stores/                # Zustand stores
│   ├── resume-store.ts
│   └── editor-store.ts
└── constants/             # App-wide constants
    ├── credit-costs.ts
    ├── template-categories.ts
    └── template-names.ts
```

---

## Credit System

| Action | Credit Cost |
|--------|------------|
| Signup bonus | +100 |
| AI bullet points | -10 |
| AI summary | -10 |
| AI full resume | -40 |
| ATS scan | -15 |
| ATS optimize | -15 |
| Cover letter | -20 |
| PDF export | -30 |

**Credit packs (INR, one-time purchase, never expire):** Starter ₹199/200, Popular ₹449/500, Pro ₹899/1200

**Credit flow:** `checkAuth()` (auth + rate limit) → validate input with Zod → `deductCreditsForAI()` → call AI → on failure: `refundCredits()` with type `REFUND` and retry logic (3 attempts, 500ms delay).

**No subscriptions/tiers.** Every user pays credits per action. `deductCredits()` checks balance and throws `Insufficient credits` if not enough.

---

## Database Schema (Drizzle ORM)

Schema defined in `src/lib/db/schema.ts` as TypeScript-native Drizzle tables. No codegen step required.

**Tables:** users, accounts, sessions, verification_tokens, resumes, templates, credit_transactions, subscriptions

**Enums:** subscription_tier (FREE, PRO), subscription_status (ACTIVE, CANCELED, PAST_DUE, TRIALING), credit_transaction_type (SIGNUP_BONUS, PURCHASE, AI_BULLET_POINTS, AI_SUMMARY, AI_FULL_RESUME, AI_ATS_SCAN, AI_ATS_OPTIMIZE, AI_COVER_LETTER, PDF_EXPORT, SUBSCRIPTION_MONTHLY, REFUND, ADMIN_ADJUSTMENT), template_category (PROFESSIONAL, MODERN, CREATIVE, TECH, ATS_OPTIMIZED, ACADEMIC, MINIMAL)

**Key design decisions:**
- JSON columns use `jsonb` with TypeScript generics (`.$type<ResumeContent>()`) for type-safe JSON
- All IDs are `nanoid(25)` strings (not UUIDs) for URL-friendliness
- `postgres.js` driver (not `pg`) for better performance and ESM support
- Ownership checks enforced in all resume CRUD functions (`userId` required)
- Credit operations use `SELECT ... FOR UPDATE` row locking for atomicity
- Pagination clamped: `page >= 1`, `limit <= 100`

**DB scripts:**
- `npm run db:generate` — generate migration SQL from schema changes
- `npm run db:migrate` — apply pending migrations
- `npm run db:push` — push schema directly (dev only)
- `npm run db:studio` — open Drizzle Studio GUI
- `npm run db:seed` — seed 15 template records

---

## Resume Data Types

```typescript
interface ResumeContent {
  personalInfo: PersonalInfo
  sections: ResumeSection[]
}

interface PersonalInfo {
  fullName: string
  title: string
  email: string
  phone: string
  location: string
  linkedin?: string
  website?: string
  portfolio?: string
  summary?: string
  photoUrl?: string
}

interface ResumeSection {
  id: string
  type: SectionType
  title: string
  visible: boolean
  entries: SectionEntry[]
}

type SectionType =
  | 'experience' | 'education' | 'skills' | 'projects'
  | 'certifications' | 'awards' | 'languages' | 'volunteer'
  | 'publications' | 'interests' | 'references' | 'custom'

interface SectionEntry {
  id: string
  fields: Record<string, string>
  bulletPoints: string[]
  startDate?: string
  endDate?: string
  current?: boolean
}
```

---

## AI Architecture (Phases 10-11)

### Infrastructure (`src/lib/ai/`)
- **`client.ts`** — Lazy-initialized Google Generative AI SDK. Model: `gemini-2.0-flash`. Exports `generateAIResponse()` with system prompt, timeout, and max tokens. Throws if `GEMINI_API_KEY` not set.
- **`prompts.ts`** — System prompt (STAR format, action verbs, no fabrication) + 6 prompt builders. Input sanitization via `sanitize()` (short fields: strips control chars + newlines + HTML tags, max 500 chars) and `sanitizeLong()` (long-form content: preserves newlines, strips control chars + HTML tags). All user data wrapped in `<user_data>` XML tags with system prompt instruction to treat as data only.
- **`credit-check.ts`** — `checkAuth()` (auth + rate limit, returns userId + tier), `deductCreditsForAI()` (deducts or returns 402), `refundCredits()` (uses `REFUND` transaction type, 3 retries with 500ms delay, CRITICAL log on final failure).
- **`rate-limiter.ts`** — Redis-backed per-user rate limiter. 40/hr for all users. Returns 429 with `Retry-After` header.
- **`parse-json.ts`** — Multi-strategy JSON extraction: (1) markdown fences, (2) non-greedy regex, (3) greedy fallback. Validates shape matches expected type (object vs array).

### AI Route Pattern (all 6 routes follow this)
```
1. checkAuth() — authenticate + rate limit
2. req.json() + Zod validation — BEFORE charging credits
3. deductCreditsForAI() — atomic deduction
4. generateAIResponse() — Gemini API with Promise.race timeout (30s)
5. extractJSON() — multi-strategy parsing
6. Zod validation on AI response
7. On failure: refundCredits() + console.error with raw AI text
8. Timeout detection: err instanceof Error && err.name === 'AbortError' → 504
```

### AI Features

| Feature | Route | Credits | UI Component |
|---------|-------|---------|-------------|
| Bullet Points | POST /api/ai/bullet-points | 10 | `bullet-generator.tsx` — per-entry modal, opt-in selection |
| Summary | POST /api/ai/summary | 10 | `summary-generator.tsx` — 3 variants (Confident/Balanced/Technical) |
| Full Resume | POST /api/ai/full-resume | 40 | `resume-wizard.tsx` — 5-step wizard (role → experience → education → skills → generate) |
| ATS Scan | POST /api/ai/ats-scan | 15 | `ats-scanner.tsx` — score circle + breakdown + missing keywords |
| ATS Optimize | POST /api/ai/ats-optimize | 15 | `ats-scanner.tsx` — rewrite bullets, apply per-entry |
| Cover Letter | POST /api/ai/cover-letter | 20 | `cover-letter-generator.tsx` — tone/length selection, editable output |

### AI UI Patterns
- Dialogs block close during generation (`if (!generating) setOpen(val)`)
- Handle 402 (insufficient credits) WITHOUT closing dialog — preserves user input
- Handle 429 (rate limit) with clear message
- Regenerate buttons show credit cost: "Regenerate (10 credits)"
- Cover letter output is editable via `<Textarea>` after generation
- Bullet generator uses opt-in selection (empty by default, user picks)
- Resume wizard cleans up orphaned resumes on AI failure (DELETE call)
- ATS scanner uses `useResumeStore.getState()` for fresh data when applying optimizations

---

## Template Collection (15 Templates)

**Professional (3):**
1. Classic Professional — Single column, serif, navy accent. Law/finance/consulting.
2. Executive — Two-column sidebar, charcoal + gold. C-suite/VP/Director.
3. Corporate — Single column, minimal color, max ATS. Banking/enterprise.

**Modern (3):**
4. Modern Minimal — Single column, whitespace, accent bar. Startups/marketing.
5. Metro — Tile blocks, icon contacts, bold headers. PMs/analysts.
6. Sleek — Dark sidebar + white content. Visually distinct.

**Creative (3):**
7. Creative Bold — Colored header, unique dividers. Creative agencies/media.
8. Designer — Portfolio-style, icons, asymmetric. Designers/art directors.
9. Starter — Clean, simple, no-fuss. Students/entry-level.

**Tech (2):**
10. Developer — Monospace accents, GitHub-style, tech tags. Engineers/DevOps.
11. Data — Clean tables, metrics-forward, skill bars. Data scientists/analysts.

**ATS-Optimized (2):**
12. ATS Simple — Zero graphics, pure text. Fortune 500 applications.
13. ATS Professional — Minimal styling, still pleasant. ATS + style balance.

**Academic (1):**
14. Academic CV — Multi-page, publications, research, grants. Professors/PhDs.

**Extra:**
15. Clean Slate — Minimal single-column with clean dividers.

All templates use pure inline styles (no Tailwind) for dual web + PDF rendering compatibility. Factory function `createSingleColumnTemplate()` generates 10 of 15 templates. 5 standalone templates (classic-professional, modern-minimal, executive, developer, sleek, creative-bold) have unique layouts.

---

## PDF Export

- **Font:** Inter (400/600/700 weights) registered from Google Fonts CDN
- **Route:** POST /api/export/pdf — generates PDF FIRST, then deducts credits (no charge on render failure)
- **Hook:** `usePdfExport()` — auto-saves before export, 30s timeout via AbortController, abort on save failure
- **Public page:** `/r/[slug]` — validates slug format (`^[a-zA-Z0-9_-]{1,50}$`), uses `cache()` for deduped DB query
- **Date formatting:** Uses `||` (not `??`) to handle empty string dates correctly

---

## Completed Phases

- **Phase 1** ✅ — Project scaffolding, folder structure, deps
- **Phase 2** ✅ — Drizzle ORM schema, DB utils, seed script
- **Phase 3** ✅ — NextAuth v5, Google/GitHub/email auth, protected routes
- **Phase 4** ✅ — App shell, sidebar, dashboard, resume CRUD API
- **Phase 5** ✅ — Zustand store (25+ actions), undo/redo, auto-save, keyboard shortcuts
- **Phase 6** ✅ — All editor UI components, section editors, dnd-kit, preview panel
- **Phase 7** ✅ — Template engine, registry, renderer, color system
- **Phase 8** ✅ — All 15 templates built and registered
- **Phase 9** ✅ — PDF export with @react-pdf/renderer, public resume page
- **Phase 10** ✅ — AI infrastructure, bullet writer, summary writer
- **Phase 11** ✅ — Full resume generator, ATS scanner/optimizer, cover letter generator
- **Phase 12** ✅ — Razorpay integration, checkout flows, webhooks, credits page, pricing page
- **Phase 13** ✅ — Landing page (GSAP animations), marketing header/footer, about/privacy/terms
- **Phase 14** ✅ — Vitest (40 tests), error boundaries, 404 page, security headers, SEO, robots/sitemap
- **Phase 15** ✅ — Vercel config, env validation, health endpoint, pre-launch checklist, favicon

---

## Razorpay Architecture (Phase 12)

### Infrastructure (`src/lib/razorpay/`)
- **`client.ts`** — Lazy-init Razorpay SDK via Proxy pattern.
- **`verify.ts`** — HMAC SHA256 signature verification (timing-safe) for payments and webhooks.
- **`rate-limit.ts`** — Redis-backed rate limiter for payment routes (10 req/min per user).

### Payment Flow (Client-Side Modal — Credits Only)
```
1. POST /api/razorpay/order — Creates Razorpay Order (returns orderId)
2. Client opens Razorpay modal with orderId (useRazorpay hook)
3. POST /api/razorpay/verify — Verifies signature, credits user (idempotent via payment_id)
4. Webhook (payment.captured) — Backup: credits user if client verify failed
```

### Webhook Handler (`POST /api/webhooks/razorpay`)
- **Idempotency:** `payment_events` table with composite key (event_type + entity_id + timestamp)
- **Backup crediting:** If client-side verify timed out, webhook credits user (checks verify event first to prevent double-crediting)
- **Error classification:** Transient errors → 500 (Razorpay retries), permanent errors → 200 (stops retries)
- **Events handled:** `payment.captured`

### Security
- CSRF: Origin header validation on all payment routes
- Rate limiting: Redis-backed 10 req/min per user
- Auth: All routes require authenticated session
- Timing-safe HMAC: `crypto.timingSafeEqual()` for all signature verification
- Idempotency: Verify endpoint deduplicates via `verify_{payment_id}` in `payment_events` table
- Double-click prevention: Client guards with `if (purchasing) return`

### Client-Side Hook (`src/hooks/use-razorpay.ts`)
- Dynamically loads `checkout.razorpay.com/v1/checkout.js`
- Returns Promise-based `openCheckout()` function
- Resolves on successful payment, rejects on modal dismiss
- Uses `NEXT_PUBLIC_RAZORPAY_KEY_ID` env var

### UI Pages
- **Credits page** (`/credits`): Balance card, 3 credit packs with Razorpay modal, credit costs reference, transaction history
- **Pricing page** (`/pricing`): Features list, 3 credit packs, credit cost table, FAQ
- **Settings page**: Profile, password, danger zone (no billing section)

---

## Marketing Site (Phase 13)

- **Header** (`src/components/marketing/header.tsx`): Sticky nav, auth-aware CTAs (Login/Signup or Dashboard)
- **Footer** (`src/components/marketing/footer.tsx`): 4-column layout, product/company links
- **Landing page** (`src/app/(marketing)/page.tsx`): Server component for auth → client component with GSAP ScrollTrigger animations
- **GSAP animations** (`src/components/marketing/landing-page.tsx`): ScrollTrigger on every section, 3D card flips, elastic bounces, clip-path reveals, before/after strikethrough, parallax backgrounds
- **Pages**: About, Privacy Policy, Terms of Service with SEO metadata

---

## Testing & Security (Phase 14)

- **Vitest** (`vitest.config.ts`): jsdom environment, path aliases, 40 unit tests
- **Test files**: `parse-json.test.ts` (8), `validations.test.ts` (18), `credit-costs.test.ts` (14)
- **Error boundaries**: Global `error.tsx`, app-scoped `(app)/error.tsx`, `not-found.tsx` (404)
- **Security headers** (`next.config.ts`): X-Frame-Options DENY, HSTS, nosniff, Referrer-Policy, Permissions-Policy
- **SEO**: OpenGraph + Twitter Card metadata, `robots.ts`, `sitemap.ts` (8 routes), favicon
- **Health check**: `GET /api/health` → `{ status, timestamp, version }`

---

## Deployment (Phase 15)

- **Vercel config** (`vercel.json`): Function timeouts (AI: 45s, PDF: 30s, webhooks: 15s), region iad1
- **Env validation** (`src/lib/env.ts`): Validates required vars at startup via instrumentation hook, throws in production, warns in dev
- **Pre-launch script** (`npm run prelaunch`): Checks all env vars, blocks deployment if required vars missing
- **Favicon**: SVG favicon at `/public/favicon.svg`

## Remaining Phases

- **Phase 16+** — Post-launch growth features (see Future Roadmap)

---

## 15-Phase Roadmap

### PHASE 1 — Project Scaffolding & Dev Environment (Days 1-2)
- Initialize Next.js 16 + TypeScript strict mode
- Configure Tailwind CSS v4 + shadcn/ui v4
- Set up full folder structure (see Project Structure above)
- Configure ESLint + Prettier
- Set up .env.example with all required keys
- Initialize Git repository
- Install core deps: zustand, zod, dnd-kit, lucide-react, date-fns, nanoid, sonner

**Verify:** `npm run dev` starts clean, all folders exist, TS compiles strict

---

### PHASE 2 — Database Schema & Data Layer (Days 3-5)
- Install Drizzle ORM + postgres.js driver
- Define complete Drizzle schema in TypeScript (`src/lib/db/schema.ts`)
- Run initial migration with `drizzle-kit push`
- Create Drizzle client (`src/lib/db.ts`)
- Create DB utility functions: users.ts, resumes.ts, credits.ts, templates.ts
- Define TypeScript types (`src/types/resume.ts`)
- Define Zod validation schemas (`src/lib/validations/resume.ts`)
- Seed database with 15 template records (`src/lib/db/seed.ts`)

**Verify:** `npm run db:studio` shows all tables, seed script runs, Zod validates correctly

---

### PHASE 3 — Authentication System (Days 6-9)
- NextAuth.js v5 + DrizzleAdapter
- Google OAuth, GitHub OAuth, email/password (bcrypt)
- Session callbacks: include userId, credits (only queries DB on initial sign-in)
- Protected route middleware (protect /dashboard/*, /editor/*, etc.)
- Signup API: hash password, create user, award 100 credits, log transaction (atomic with unique constraint catch)
- Login page UI: social buttons + email/password form, open redirect protection
- Signup page UI: name, email, password, confirm, strength indicator
- Forgot password page UI
- Auth hooks: useCurrentUser(), useRequireAuth()

**Verify:** All 3 auth methods work, new users get 100 credits, protected routes redirect

---

### PHASE 4 — App Shell & Dashboard Layout (Days 10-14)
- App layout: sidebar + main content
- Sidebar: nav links (Dashboard, Resumes, Templates, AI Tools, Credits, Settings), credit badge, upgrade CTA
- Top bar: breadcrumbs, credit balance, "New Resume" button, user avatar dropdown
- Dashboard page: welcome message, stats row, recent resumes grid, empty state, "Create with AI" → ResumeWizard
- Resume card component: thumbnail, title, last edited, template badge, 3-dot menu
- Settings page: profile, password, danger zone (delete account)
- Resume CRUD API routes: GET/POST /api/resumes, GET/PUT/DELETE /api/resumes/[id], POST /api/resumes/[id]/duplicate, POST /api/resumes/[id]/save
- Default resume content factory

**Verify:** Dashboard loads, sidebar works, CRUD API works, mobile responsive

---

### PHASE 5 — Resume Editor: Data & State Management (Days 15-19)
- Zustand resume store: all state + actions for personalInfo, sections, entries, bullets, template
- Undo/redo system (50-step history stack, Ctrl+Z / Ctrl+Shift+Z)
- Auto-save hook: debounced 2s, retry on failure (separate timer from debounce), save on unload via sendBeacon
- Editor page route: fetch resume, load into store, two-panel layout
- Keyboard shortcuts: Ctrl+S save, Ctrl+Z undo, Ctrl+Shift+Z redo
- Save status indicator: "Saving...", "Saved", "Error"

**Verify:** Editor loads resume, auto-saves, undo/redo works, unsaved changes warning

---

### PHASE 6 — Resume Editor: UI Components (Days 20-27)
- Resizable split pane: editor (left) + live preview (right)
- Personal info form: all fields connected to store
- Professional summary editor with character count + AI generate button
- Section manager: add/remove/reorder sections via dnd-kit, inline title editing, scroll-to-section
- Experience editor: job details + bullet points + drag-and-drop + AI bullet generator
- Education editor: school, degree, field, dates, GPA
- Skills editor: skill groups + tag input
- Languages editor: dedicated with proficiency dropdown
- Generic editors: projects, certifications, awards, volunteer, publications, interests, references, custom
- Preview panel: renders selected template, zoom controls
- Template switcher dropdown
- Completeness indicator with expandable checklist
- Delete confirmation dialogs, empty section states, date month/year pickers
- Tooltip hints on all icon buttons

**Verify:** All section types work, preview updates real-time, drag-and-drop works, mobile tabs

---

### PHASE 7 — Template Engine Architecture (Days 28-32)
- TemplateConfig interface: layout, colors, fonts, spacing
- Template registry: slug → { component, config }, fallback to classic-professional
- Base template components: Header, Summary, Experience, Education, Skills, Projects, Generic, Divider
- Template wrapper/renderer component
- Color customization system: per-resume overrides, predefined schemes, custom hex
- A4 page sizing

**Verify:** Registry returns templates, renderer works, switching preserves content, colors apply

---

### PHASE 8 — Template Collection: 15 Templates (Days 33-42)
- Build all 15 templates (see Template Collection above)
- Each template: React component + config + 2 color scheme variants
- Register all in template registry
- Handle all section types, missing sections, empty entries gracefully
- Each template visually distinct and polished
- All use pure inline styles (no Tailwind) for PDF compatibility

**Verify:** All 15 render correctly, handle minimal/maximal content, color switching works

---

### PHASE 9 — PDF Export Engine (Days 43-48)
- @react-pdf/renderer integration
- PDF primitives: text styles, spacing, margins (Flexbox-only)
- PDF template: shared `PDFResume` component with `createStyles()`, `PDFHeader`, `PDFSection`, `PDFEntry`
- Font registration: Inter 400/600/700 from Google CDN
- PDF generation API: POST /api/export/pdf (auth → validate with Zod → fetch resume → generate PDF → deduct credits)
- Download hook with auto-save, 30s timeout, abort on save failure
- Multi-page support: `wrap={false}` on entries
- Shareable public link: /r/[slug] with OG meta tags, slug validation

**Verify:** All 15 templates export correctly, PDF matches preview, credits deducted after success

---

### PHASE 10 — AI Infrastructure & Core AI Features (Days 49-56)
- Gemini SDK lazy-init with generateAIResponse() wrapper
- AI prompt system with input sanitization (`sanitize()` + `sanitizeLong()`) and `<user_data>` XML injection defense
- AI credit middleware: checkAuth (auth + rate limit) → validate → deduct → call AI → refund on failure
- Rate limiter: 20/hr free, 100/hr Pro (in-memory)
- Multi-strategy JSON extraction (`parse-json.ts`)
- 30s timeout on all AI calls via `AbortSignal.timeout()`
- **AI Bullet Point Writer:** POST /api/ai/bullet-points, 10 credits, opt-in selection UI
- **AI Professional Summary Writer:** POST /api/ai/summary, 10 credits, 3 variants UI

**Verify:** AI produces quality output, credits deducted after validation, failures refund with REFUND type

---

### PHASE 11 — Advanced AI Features (Days 57-65)
- **AI Full Resume Generator:** 5-step wizard → POST /api/ai/full-resume → 40 credits, orphan cleanup on failure
- **ATS Scanner:** POST /api/ai/ats-scan → score (0-100) + breakdown + missing keywords, 15 credits
- **ATS Optimizer:** POST /api/ai/ats-optimize → rewrite bullets to match JD, apply per-entry, 15 credits
- **Cover Letter Generator:** POST /api/ai/cover-letter → tone/length selection, editable output, copy to clipboard, 20 credits
- All wired into editor toolbar (ATS Scanner, Cover Letter) and dashboard (Resume Wizard)
- AI tools visible on all screen sizes including mobile

**Verify:** Full generator creates coherent resumes, ATS scores are meaningful, cover letters are personalized and editable

---

### PHASE 12 — Credit System & Razorpay Payments (Days 66-73)
- Credits page UI: balance, plan card, usage breakdown, transaction history, buy credits, upgrade CTA
- Credit confirmation modal before every paid action
- "Not enough credits" flow → redirect to purchase
- Credit balance in header (animated, warning when < 20)
- Razorpay Orders for credit packs (POST /api/razorpay/order)
- Client-side Razorpay modal checkout (useRazorpay hook)
- Payment verification endpoint (POST /api/razorpay/verify)
- Razorpay webhook: payment.captured (backup crediting)
- Pricing page with Free vs Pro comparison
- Upgrade prompts at strategic touchpoints

**Verify:** Credit pack purchase flow works, webhooks process correctly, idempotency prevents double-crediting

---

### PHASE 13 — Landing Page & Marketing Site (Days 74-80)
- Landing page: hero, social proof, features (3 columns), template carousel, how-it-works, AI showcase, pricing, testimonials, FAQ, final CTA
- Footer: logo, link columns, social icons, copyright
- About, Privacy Policy, Terms of Service pages
- SEO: meta tags, OG tags, Twitter Cards, structured data, robots.txt, sitemap.xml
- Email system (Resend): welcome, password reset, purchase receipt, subscription confirmation/cancellation

**Verify:** Landing loads < 2s, responsive, CTAs work, SEO tags present, emails send

---

### PHASE 14 — Testing, Security & Performance (Days 81-88)
- **Testing:** Vitest + React Testing Library + Playwright
  - Unit: credit math, validations, utils, prompts
  - Component: editor forms, template rendering, modals
  - API: resume CRUD, auth, credits, AI routes (mocked)
  - E2E: signup → create → edit → AI → export full flow
- **Security:**
  - Input sanitization (DOMPurify), Zod on all API inputs
  - Rate limiting: auth 5/min, AI 20/hr free, general 100/min
  - Ownership verification on all resume operations
  - CSP headers, no API keys on client
- **Performance:**
  - next/image WebP, code splitting, lazy load templates, next/font
  - DB indexes (defined), API caching, streaming
  - Skeleton screens, loading spinners, toast notifications, optimistic updates
- **Error handling:** error boundaries, error.tsx per route, 404 page, Sentry
- **Accessibility:** keyboard nav, ARIA labels, focus management, color contrast (WCAG AA)
- **Analytics:** PostHog (page views, feature usage, funnels), Sentry (errors + performance)

**Verify:** All tests pass, Lighthouse > 90, no XSS, rate limiting works, analytics fires

---

### PHASE 15 — Deployment & Launch (Days 89-95)
- **Infrastructure:** Vercel deploy, custom domain + SSL, production Supabase, Razorpay live mode, Resend domain verification
- **Pre-launch checklist:** test every flow on production (all 3 auth methods, all 15 templates, all AI features, payments, exports, emails, mobile)
- **Performance benchmarks:** landing < 2s, editor < 3s, PDF < 5s, AI stream < 1s
- **Monitoring:** uptime monitoring, Sentry alerting, /api/health endpoint
- **Soft launch (Days 89-91):** 10-20 trusted users, monitor errors, fix critical bugs, gather testimonials
- **Public launch (Days 92-95):** update testimonials, social media, Product Hunt, Reddit, monitor scaling

---

## Future Roadmap (Post-Launch)

**Phase 16 — Growth:** LinkedIn import, resume parsing, DOCX/TXT export, versioning, multi-language
**Phase 17 — Advanced AI:** Interview prep, skill gap analysis, AI review, industry benchmarking
**Phase 18 — Platform:** Cover letter templates, portfolio builder, job tracker, Chrome extension, mobile app
**Phase 19 — Enterprise:** Team accounts, admin dashboard, API, white-label, affiliate program

---

## Testing Strategy

| Type | Tool | Scope |
|------|------|-------|
| Unit | Vitest | Credit math, validations, utils, prompts |
| Component | React Testing Library | Editor forms, templates, modals |
| API | Vitest + Supertest | All routes, auth, credits |
| E2E | Playwright | Full user journeys |
| Visual | Manual | All 15 templates × sample data |
| Payment | Razorpay Test Mode | Purchase + subscription flows |
| AI | Manual Review | Prompt quality, output relevance |
| Performance | Lighthouse | Score > 90 all pages |
| Security | Manual + OWASP | XSS, CSRF, injection, auth |
| Accessibility | axe-core | WCAG 2.1 AA |

---

## Conventions
- Use TypeScript strict mode everywhere
- Validate all API inputs with Zod (note: `z.record()` requires 2 args in Zod v4)
- Use Drizzle ORM for all DB operations
- Use server components by default, client components only when needed
- Use `cn()` utility for conditional Tailwind classes
- Use sonner for toast notifications
- Use lucide-react for icons
- Use nanoid for generating IDs
- Atomic credit operations (DB transactions with `SELECT ... FOR UPDATE` row locking)
- Auto-save with 2s debounce in editor (separate retry timer from debounce timer)
- All resume templates are pure functions: (ResumeContent, TemplateConfig) → JSX with inline styles
- AI routes: validate BEFORE charging credits, refund on failure with `REFUND` type
- AI prompts: `sanitize()` for short fields (collapses newlines), `sanitizeLong()` for long-form content (preserves newlines)
- Dialogs block close during async generation
- Handle 402 (insufficient credits) without closing dialog
- Handle 429 (rate limit) in all AI UI components
- AbortError detection uses `err instanceof Error` (not `DOMException`) for Node.js compatibility
- Don't export types from Next.js route files — use `src/types/` instead
