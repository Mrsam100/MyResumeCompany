# TheResumeCompany — AI Resume Builder

## Project Vision
We are building an AI-powered resume builder SaaS to disrupt the resume builder industry. The goal is to create the best AI resume builder on the market — perfect templates, perfect AI writing, perfect user experience.

## Key Decisions
- **Target:** B2C job seekers (students, professionals, career changers)
- **Monetization:** Credits + Subscription hybrid
  - Free signup = 100 credits
  - Pro plan = $12/mo (unlimited AI + 500 credits/month) or $99/year
  - Credit packs: $4.99/100, $9.99/300, $19.99/800
- **AI Features:** Bullet writer, summary writer, full resume generator, ATS scorer, cover letter generator
- **Timeline:** ~95 days (3 months) to production launch
- **Starting from:** Zero. No code, no design, no brand assets.

---

## Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Framework | Next.js 15 (App Router) + TypeScript | SSR for SEO, React ecosystem, API routes built-in |
| Styling | Tailwind CSS v4 + shadcn/ui | Ship fast, consistent design system |
| State | Zustand | Lightweight, no boilerplate, great for editor state |
| Resume Editor | Custom React editor + dnd-kit | Full control over layout, drag-and-drop sections |
| PDF Export | @react-pdf/renderer | Pixel-perfect PDFs from React components |
| AI Engine | Claude API (Anthropic SDK) | Best writing quality for professional content |
| Auth | NextAuth.js v5 (Auth.js) | Google/GitHub/email login, session management |
| Database | PostgreSQL via Supabase | Auth, realtime, storage, DB in one platform |
| ORM | Prisma | Type-safe queries, migrations, great DX |
| Validation | Zod | Runtime type validation, form validation, API validation |
| Payments | Stripe (Checkout + Webhooks) | Subscriptions + one-time credit pack purchases |
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
│   │   ├── export/
│   │   ├── credits/
│   │   └── webhooks/
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                # shadcn/ui primitives
│   ├── layout/            # Header, Sidebar, Footer
│   ├── resume/            # Resume display components
│   ├── editor/            # Editor-specific components
│   ├── templates/         # Template gallery components
│   └── marketing/         # Landing page components
├── lib/
│   ├── ai/                # Claude API client, prompts, utils
│   ├── pdf/               # PDF generation logic
│   ├── stripe/            # Stripe client, helpers
│   ├── supabase/          # Supabase client config
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
│   ├── use-resume.ts
│   ├── use-autosave.ts
│   └── use-credits.ts
├── stores/                # Zustand stores
│   ├── resume-store.ts
│   └── editor-store.ts
└── constants/             # App-wide constants
    ├── credit-costs.ts
    └── template-categories.ts
```

---

## Credit System

| Action | Credit Cost | Pro Subscriber |
|--------|------------|----------------|
| Signup bonus | +100 | +500 |
| AI bullet points | -10 | Unlimited |
| AI summary | -10 | Unlimited |
| AI full resume | -40 | Unlimited |
| ATS scan | -15 | Unlimited |
| ATS optimize | -15 | Unlimited |
| Cover letter | -20 | Unlimited |
| PDF export | -30 | Unlimited |
| Monthly Pro refill | — | +500/month |

---

## Database Schema

```prisma
enum SubscriptionTier { FREE  PRO }
enum SubscriptionStatus { ACTIVE  CANCELED  PAST_DUE  TRIALING }
enum CreditTransactionType {
  SIGNUP_BONUS  PURCHASE  AI_BULLET_POINTS  AI_SUMMARY
  AI_FULL_RESUME  AI_ATS_SCAN  AI_COVER_LETTER  PDF_EXPORT
  SUBSCRIPTION_MONTHLY  REFUND  ADMIN_ADJUSTMENT
}
enum TemplateCategory {
  PROFESSIONAL  MODERN  CREATIVE  TECH  ATS_OPTIMIZED  ACADEMIC  MINIMAL
}

model User {
  id                 String             @id @default(cuid())
  email              String             @unique
  emailVerified      DateTime?
  name               String?
  image              String?
  hashedPassword     String?
  credits            Int                @default(100)
  subscriptionTier   SubscriptionTier   @default(FREE)
  accounts           Account[]
  sessions           Session[]
  resumes            Resume[]
  creditTransactions CreditTransaction[]
  subscription       Subscription?
  createdAt          DateTime           @default(now())
  updatedAt          DateTime           @updatedAt
  @@index([email])
}

model Resume {
  id              String   @id @default(cuid())
  userId          String
  title           String   @default("Untitled Resume")
  slug            String   @unique @default(cuid())
  templateId      String   @default("classic-professional")
  content         Json
  isPublic        Boolean  @default(false)
  lastEditedAt    DateTime @default(now())
  thumbnailUrl    String?
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  creditTransactions CreditTransaction[]
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  @@index([userId])
  @@index([slug])
  @@index([userId, lastEditedAt(sort: Desc)])
}

model Template {
  id          String           @id @default(cuid())
  name        String           @unique
  slug        String           @unique
  description String?
  category    TemplateCategory
  thumbnail   String?
  isPremium   Boolean          @default(false)
  isActive    Boolean          @default(true)
  config      Json
  sortOrder   Int              @default(0)
  createdAt   DateTime         @default(now())
  updatedAt   DateTime         @updatedAt
  @@index([category])
  @@index([isActive, sortOrder])
}

model CreditTransaction {
  id          String                 @id @default(cuid())
  userId      String
  amount      Int
  type        CreditTransactionType
  description String?
  resumeId    String?
  user        User                   @relation(fields: [userId], references: [id], onDelete: Cascade)
  resume      Resume?                @relation(fields: [resumeId], references: [id], onDelete: SetNull)
  createdAt   DateTime               @default(now())
  @@index([userId, createdAt(sort: Desc)])
  @@index([userId, type])
}

model Subscription {
  id                   String             @id @default(cuid())
  userId               String             @unique
  stripeCustomerId     String             @unique
  stripeSubscriptionId String?            @unique
  stripePriceId        String?
  status               SubscriptionStatus @default(ACTIVE)
  currentPeriodStart   DateTime?
  currentPeriodEnd     DateTime?
  user                 User               @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt            DateTime           @default(now())
  updatedAt            DateTime           @updatedAt
}
```

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

---

## 15-Phase Roadmap

### PHASE 1 — Project Scaffolding & Dev Environment (Days 1-2)
- Initialize Next.js 15 + TypeScript strict mode
- Configure Tailwind CSS v4 + shadcn/ui
- Set up full folder structure (see Project Structure above)
- Configure ESLint + Prettier
- Set up .env.example with all required keys
- Initialize Git repository
- Install core deps: zustand, zod, dnd-kit, lucide-react, date-fns, nanoid, sonner

**Verify:** `npm run dev` starts clean, all folders exist, TS compiles strict

---

### PHASE 2 — Database Schema & Data Layer (Days 3-5)
- Install Prisma + connect Supabase PostgreSQL
- Define complete Prisma schema (all models, enums, indexes — see above)
- Run initial migration
- Create Prisma client singleton (`src/lib/db.ts`)
- Create DB utility functions: users.ts, resumes.ts, credits.ts, templates.ts
- Define TypeScript types (`src/types/resume.ts`)
- Define Zod validation schemas (`src/lib/validations/resume.ts`)
- Seed database with 14 template records (`prisma/seed.ts`)

**Verify:** `npx prisma studio` shows all tables, seed script runs, Zod validates correctly

---

### PHASE 3 — Authentication System (Days 6-9)
- NextAuth.js v5 + PrismaAdapter
- Google OAuth, GitHub OAuth, email/password (bcrypt)
- Session callbacks: include userId, credits, subscriptionTier
- Protected route middleware (protect /dashboard/*, /editor/*, etc.)
- Signup API: hash password, create user, award 100 credits, log transaction
- Login page UI: social buttons + email/password form
- Signup page UI: name, email, password, confirm, strength indicator
- Forgot password page UI
- Auth hooks: useCurrentUser(), useRequireAuth()

**Verify:** All 3 auth methods work, new users get 100 credits, protected routes redirect

---

### PHASE 4 — App Shell & Dashboard Layout (Days 10-14)
- App layout: sidebar + main content
- Sidebar: nav links (Dashboard, Resumes, Templates, AI Tools, Credits, Settings), credit badge, upgrade CTA
- Top bar: breadcrumbs, credit balance, "New Resume" button, user avatar dropdown
- Dashboard page: welcome message, stats row, recent resumes grid, empty state
- Resume card component: thumbnail, title, last edited, template badge, 3-dot menu
- Settings page: profile, password, subscription, danger zone (delete account)
- Resume CRUD API routes: GET/POST /api/resumes, GET/PUT/DELETE /api/resumes/[id], POST /api/resumes/[id]/duplicate
- Default resume content factory

**Verify:** Dashboard loads, sidebar works, CRUD API works, mobile responsive

---

### PHASE 5 — Resume Editor: Data & State Management (Days 15-19)
- Zustand resume store: all state + actions for personalInfo, sections, entries, bullets, template
- Undo/redo system (50-step history stack, Ctrl+Z / Ctrl+Shift+Z)
- Auto-save hook: debounced 2s, retry on failure, save on unload
- Editor page route: fetch resume, load into store, two-panel layout
- Keyboard shortcuts: Ctrl+S save, Ctrl+Z undo, Ctrl+Shift+Z redo
- Save status indicator: "Saving...", "Saved", "Error"

**Verify:** Editor loads resume, auto-saves, undo/redo works, unsaved changes warning

---

### PHASE 6 — Resume Editor: UI Components (Days 20-27)
- Resizable split pane: editor (left) + live preview (right)
- Personal info form: all fields connected to store
- Professional summary editor with character count
- Section manager: add/remove/reorder sections via dnd-kit
- Experience editor: job details + bullet points + drag-and-drop
- Education editor: school, degree, field, dates, GPA
- Skills editor: skill groups + tag input + proficiency levels
- Projects editor: name, description, tech tags, URLs
- Generic editors: certifications, awards, languages, volunteer, publications, custom
- Preview panel: renders selected template, zoom controls, page indicator
- Template switcher modal
- Full drag-and-drop: sections, entries, bullets

**Verify:** All section types work, preview updates real-time, drag-and-drop works, mobile tabs

---

### PHASE 7 — Template Engine Architecture (Days 28-32)
- TemplateConfig interface: layout, colors, fonts, spacing
- Template registry: slug → { component, pdfComponent, config }
- Base template components: Header, Summary, Experience, Education, Skills, Projects, Generic, Divider
- Template wrapper/renderer component
- Color customization system: per-resume overrides, predefined schemes, custom hex
- A4/Letter page sizing with page break detection

**Verify:** Registry returns templates, renderer works, switching preserves content, colors apply

---

### PHASE 8 — Template Collection: 15 Templates (Days 33-42)
- Build all 15 templates (see Template Collection above)
- Each template: React component + config + 2 color scheme variants
- Register all in template registry
- Handle all section types, missing sections, empty entries gracefully
- Each template visually distinct and polished

**Verify:** All 15 render correctly, handle minimal/maximal content, color switching works

---

### PHASE 9 — PDF Export Engine (Days 43-48)
- @react-pdf/renderer integration
- PDF primitives: text styles, spacing, margins (Flexbox-only)
- PDF template components: one per web template (template-name.pdf.tsx)
- Font registration + subsetting
- PDF generation API: POST /api/export/pdf (auth + credit check + generate + return binary)
- PDF preview in browser
- Download flow: credit confirmation → loading → download
- Multi-page support: auto page breaks, optional page numbers
- Shareable public link: /r/[slug] with OG meta tags

**Verify:** All 15 templates export correctly, PDF matches preview, credits deducted, < 500KB

---

### PHASE 10 — AI Infrastructure & Core AI Features (Days 49-56)
- Anthropic SDK integration + streaming helper
- AI prompt system: system prompt, bullet-points, summary, full-resume, ats-optimize, cover-letter
- AI credit middleware: check Pro status → check balance → deduct atomically → log transaction
- Rate limiter: 20/hr free, 100/hr Pro
- **AI Bullet Point Writer:**
  - POST /api/ai/bullet-points
  - Input: jobTitle, company, responsibilities, industry
  - Output: 4-6 STAR-format bullets, streaming
  - UI: "Generate with AI" button per experience entry → modal → pick bullets → insert
  - Cost: 10 credits
- **AI Professional Summary Writer:**
  - POST /api/ai/summary
  - Input: targetRole, yearsExperience, keySkills, industry
  - Output: 3 variants (Confident, Balanced, Technical)
  - UI: modal with career details → 3 options → pick or edit
  - Cost: 10 credits

**Verify:** AI produces quality output, streaming works, credits deducted, failures don't charge

---

### PHASE 11 — Advanced AI Features (Days 57-65)
- **AI Full Resume Generator:**
  - 5-step onboarding wizard (role, work history, education, skills, goals)
  - POST /api/ai/full-resume → complete ResumeContent JSON
  - Loading screen with progress steps
  - Cost: 40 credits
- **ATS Scanner & Optimizer:**
  - POST /api/ai/ats-scan: resume + job description → score (0-100) + keyword match + skills alignment + suggestions
  - POST /api/ai/ats-optimize: rewrite bullets to match JD, diff view, accept/reject per change
  - Cost: 15 credits each
- **Cover Letter Generator:**
  - POST /api/ai/cover-letter: resume + company + JD + tone + length
  - Output: personalized 3-paragraph cover letter
  - Copy, download PDF, regenerate, inline edit
  - Cost: 20 credits

**Verify:** Full generator creates coherent resumes, ATS scores are meaningful, cover letters are personalized

---

### PHASE 12 — Credit System & Stripe Payments (Days 66-73)
- Credits page UI: balance, plan card, usage breakdown, transaction history, buy credits, upgrade CTA
- Credit confirmation modal before every paid action
- "Not enough credits" flow → redirect to purchase
- Credit balance in header (animated, warning when < 20)
- Stripe products: 3 credit packs + Pro monthly + Pro yearly
- Stripe Checkout for credits (POST /api/stripe/checkout/credits)
- Stripe Checkout for subscription (POST /api/stripe/checkout/subscription)
- Stripe Customer Portal (POST /api/stripe/portal)
- Stripe webhooks: checkout.session.completed, invoice.paid, subscription.updated, subscription.deleted, payment_failed
- Pricing page with Free vs Pro comparison
- Upgrade prompts at strategic touchpoints

**Verify:** Purchase flow works, subscription works, webhooks process correctly, cancellation downgrades

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
- **Infrastructure:** Vercel deploy, custom domain + SSL, production Supabase, Stripe live mode, Resend domain verification
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
| Payment | Stripe Test Mode | Purchase + subscription flows |
| AI | Manual Review | Prompt quality, output relevance |
| Performance | Lighthouse | Score > 90 all pages |
| Security | Manual + OWASP | XSS, CSRF, injection, auth |
| Accessibility | axe-core | WCAG 2.1 AA |

---

## Conventions
- Use TypeScript strict mode everywhere
- Validate all API inputs with Zod
- Use Prisma for all DB operations (never raw SQL)
- Use server components by default, client components only when needed
- Use `cn()` utility for conditional Tailwind classes
- Use sonner for toast notifications
- Use lucide-react for icons
- Use nanoid for generating IDs
- Atomic credit operations (DB transactions for deduct + log)
- Auto-save with 2s debounce in editor
- All resume templates are pure functions: (ResumeContent, TemplateConfig) → JSX
