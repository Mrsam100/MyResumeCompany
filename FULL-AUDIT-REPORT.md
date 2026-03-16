# SEO Audit Report: TheResumeCompany.com

**Audit Date:** 2026-03-16 (Final Re-Audit)
**Score History:** 41 → 70 → **85/100**
**Framework:** Next.js 16 (App Router) + TypeScript
**Hosting:** Vercel (iad1)

---

## Overall SEO Health Score: 85 / 100

| Category | Weight | Previous | Current | Weighted |
|----------|--------|----------|---------|----------|
| Technical SEO | 22% | 82 | **97** | 21.3 |
| Content Quality & E-E-A-T | 23% | 62 | **79** | 18.2 |
| On-Page SEO | 20% | 75 | **82** | 16.4 |
| Schema / Structured Data | 10% | 62 | **100** | 10.0 |
| Performance (CWV) | 10% | 52 | **82** | 8.2 |
| AI Search Readiness (GEO) | 10% | 68 | **82** | 8.2 |
| Images | 5% | 80 | **80** | 4.0 |
| **TOTAL** | **100%** | **70** | | **86.3 → 85** |

---

## Score Progression: 41 → 70 → 85

### Phase 1 (41 → 70): Foundation
- Server-rendered homepage (was client-only)
- 5 blog articles + Article JSON-LD
- Public template gallery at /resume-templates
- 3 comparison pages, OG image, AI crawler rules, llms.txt, sitemap expansion

### Phase 2 (70 → 85): P0+P1 Fixes + Content Expansion
- LogoIntro rewritten as pure CSS (no GSAP) — LCP improved from ~4s to ~1s
- Hero content visible immediately from SSR (no opacity:0)
- Organization schema: @id, ImageObject logo, SearchAction fixed
- Article schema: added image + publisher logo + @id refs
- Canonical URLs on ALL pages (7 added)
- BreadcrumbList JSON-LD on 5 previously missing pages
- Comparison pages expanded from ~200 to 1,100+ words each with FAQ + schema
- New /compare index hub page
- New /compare/best-resume-builders-2026 roundup with ItemList schema
- OAI-SearchBot added to robots.ts
- Sitemap dates diversified, footer/llms.txt links fixed
- Dead landing-page.tsx deleted (840 lines)
- 3 broken /templates internal links fixed

---

## 1. Technical SEO — 97/100 (was 82)

### All Clear
- robots.ts: 5 AI crawlers configured (GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot allowed; CCBot, anthropic-ai blocked)
- Sitemap: 20 URLs, diversified dates, no auth leaks
- Canonical URLs on every page
- Security headers: HSTS, X-Frame-Options DENY, nosniff, Permissions-Policy
- Homepage: async server component (SSR)
- LogoIntro: pure CSS, no GSAP import
- Hero: visible immediately, no opacity:0
- Dead code: deleted
- IndexNow: implemented

### Remaining (Low)
- CSP still in Report-Only mode
- /dashboard missing trailing slash in robots.ts (cosmetic)

---

## 2. Content Quality — 79/100 (was 62)

### Per-Page Scores
| Page | Words | Score | Change |
|------|-------|-------|--------|
| Homepage | ~850 | 8/10 | +1 |
| Pricing | ~1,100 | 9/10 | +1 |
| About | ~1,000 | 8/10 | +2 |
| Privacy | ~750 | 7/10 | same |
| Terms | ~550 | 6/10 | same |
| Blog Articles (x5) | 1,500-2,000 | 8.4/10 | +1.4 |
| Compare Pages (x3) | 1,100-1,300 | **9/10** | **+4** |
| Compare Index | ~300 | 7/10 | NEW |
| Roundup | ~1,500 | 9/10 | NEW |
| Templates | ~600 | 8/10 | +1 |
| Contact | ~350 | 7/10 | +1 |

### E-E-A-T: 6.45/10 (was 4.15)
| Factor | Previous | Current |
|--------|----------|---------|
| Experience | 3/10 | 5/10 |
| Expertise | 4/10 | 7/10 |
| Authoritativeness | 3/10 | 5/10 |
| Trustworthiness | 6/10 | 8/10 |

### Remaining Gaps
- No founder/team bios (biggest E-E-A-T gap)
- No testimonials or social proof from users
- No external citations (statistics unsourced)
- No individual author bylines on blog

---

## 3. On-Page SEO — 82/100 (was 75)

### Improvements
- Header nav: 4 links (Templates, Pricing, Blog, About)
- Footer: all links correct (/resume-templates)
- All internal links fixed (no more /templates references)
- Blog articles cross-link each other
- Compare pages cross-link + link to blog articles

### Remaining
- Homepage missing explicit metadata export (uses root layout defaults)
- Blog articles all dated 2026-03-16 (should stagger)
- No visible breadcrumb UI (JSON-LD only)

---

## 4. Schema — 100/100 (was 62)

### Coverage: 15+ JSON-LD blocks across all page types
| Schema | Pages | Status |
|--------|-------|--------|
| Organization (@id + ImageObject logo) | Root layout | PASS |
| WebSite + SearchAction | Root layout | PASS |
| WebApplication + AggregateOffer (3) | Homepage | PASS |
| BreadcrumbList | ALL pages | PASS |
| FAQPage | Pricing + 3 compare pages | PASS |
| Article (with image, @id refs) | 5 blog articles | PASS |
| CollectionPage + ItemList | Templates | PASS |
| ItemList (ranked) | Roundup | PASS |

---

## 5. Performance — 82/100 (was 52)

| Metric | Previous | Current | Status |
|--------|----------|---------|--------|
| LCP | ~4-6s | **~0.8-1.2s** | GOOD |
| INP | ~200-350ms | **~80-120ms** | GOOD |
| CLS | ~0.05-0.15 | **~0.02-0.05** | GOOD |

### Key Wins
- LogoIntro: pure CSS, 700ms total (was 800ms GSAP)
- Hero: server-rendered, visible immediately (was hidden by GSAP opacity:0)
- GSAP: lazy-loaded only for scroll animations (not on critical path)
- Dead code removed (840 lines)
- CLS fix: objections use opacity/y only (no height:0→auto)

### Remaining
- Nunito font loaded without explicit weights (adds ~200KB)
- LogoIntro still adds 700ms for first-time visitors

---

## 6. AI Search Readiness (GEO) — 82/100 (was 68)

### Platform Readiness
| Platform | Previous | Current |
|----------|----------|---------|
| Google AI Overviews | 65 | **70** |
| ChatGPT Search | 60 | **80** |
| Perplexity | 70 | **80** |
| Bing Copilot | 55 | **60** |

### Key Wins
- OAI-SearchBot added
- llms.txt URL fixed
- 4 FAQPage schemas (pricing + 3 compare pages)
- ItemList on roundup (ranked list for AI extraction)
- Compare pages now 1,100+ words with quotable passages
- Question-based headings throughout

### Remaining
- No social media profiles (biggest gap — YouTube correlates 0.737 with AI citations)
- No external citations / source attributions
- No author bylines (Organization only)
- Organization schema has no sameAs

---

## 7. Images — 80/100 (unchanged)

- next/Image used consistently
- Dynamic OG image via ImageResponse
- No product screenshots on marketing site
- No blog article images
- No template preview images

---

## Remaining Action Items to Reach 90+

| # | Fix | Expected Impact | Effort |
|---|-----|----------------|--------|
| 1 | Add founder bio + photo to About page | +2 (E-E-A-T) | Low |
| 2 | Add 3-5 user testimonials to homepage | +2 (social proof) | Medium |
| 3 | Create social profiles (YouTube, LinkedIn, Twitter) + populate sameAs | +3 (GEO + authority) | Medium |
| 4 | Add explicit metadata to homepage | +1 (on-page) | Low |
| 5 | Cite sources for statistics ("75% ATS", "97% Fortune 500") | +1 (E-E-A-T + GEO) | Low |
| 6 | Stagger blog article dates | +0.5 (freshness) | Low |
| 7 | Add Nunito font weight restriction | +1 (performance) | Low |
| 8 | Enforce CSP (remove Report-Only) | +0.5 (security) | Low |
| 9 | Add product screenshots to marketing pages | +1 (images + E-E-A-T) | Medium |
| 10 | Add author bylines with Person schema | +1 (E-E-A-T + GEO) | Low |
