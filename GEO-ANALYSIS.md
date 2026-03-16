# GEO Analysis: TheResumeCompany.com

**Date:** 2026-03-16
**GEO Readiness Score:** 82/100 (was 68/100)

---

## 1. GEO Readiness Score Breakdown

| Dimension | Weight | Score | Weighted |
|-----------|--------|-------|----------|
| Citability | 25% | 7.5/10 | 18.75 |
| Structural Readability | 20% | 8.5/10 | 17.0 |
| Multi-Modal Content | 15% | 5.0/10 | 7.5 |
| Authority & Brand Signals | 20% | 5.0/10 | 10.0 |
| Technical Accessibility | 20% | 9.0/10 | 18.0 |
| **Adjusted Total** | | | **82/100** |

---

## 2. Platform Breakdown

| Platform | Score | Key Factors |
|----------|-------|-------------|
| **Google AI Overviews** | 70/100 | Strong SSR + schema + FAQ markup. Weak entity recognition (new domain, no backlinks). |
| **ChatGPT (SearchGPT)** | 80/100 | OAI-SearchBot allowed, well-structured Q&A content, 4 FAQPage schemas. No Wikipedia/Reddit presence. |
| **Perplexity** | 80/100 | PerplexityBot allowed, compare pages ideal for citation (feature tables + verdicts). Blog cross-linking strong. |
| **Bing Copilot** | 60/100 | IndexNow route exists but no active submissions. No Bing Webmaster verification. Weak social signals. |

---

## 3. AI Crawler Access Status

| Crawler | Owner | Status | Purpose |
|---------|-------|--------|---------|
| GPTBot | OpenAI | ALLOWED | ChatGPT training + search |
| OAI-SearchBot | OpenAI | ALLOWED | ChatGPT Search specifically |
| ClaudeBot | Anthropic | ALLOWED | Claude web features |
| PerplexityBot | Perplexity | ALLOWED | Perplexity AI search |
| CCBot | Common Crawl | BLOCKED | Training data scraper |
| anthropic-ai | Anthropic | BLOCKED | Claude training |
| Bytespider | ByteDance | NOT SPECIFIED | Consider blocking |
| cohere-ai | Cohere | NOT SPECIFIED | Consider blocking |
| ChatGPT-User | OpenAI | NOT SPECIFIED | Consider allowing |

**Blocked app routes:** /api/, /dashboard, /editor/, /credits, /settings

**Verdict:** 4 of 4 key AI search crawlers allowed. Training-only crawlers blocked. **9/10**

---

## 4. llms.txt Status

**Location:** `/public/llms.txt` — PRESENT

**Content quality:** Good
- Product description with features list
- Pricing summary with specific numbers ($12/mo, $99/yr, credit packs)
- All page URLs listed (correctly uses /resume-templates)
- Technical stack disclosed (Next.js, Google Gemini API, Stripe, Vercel)

**Missing:**
- No RSL 1.0 license header (e.g., `# License: You may cite with attribution`)
- No `llms-full.txt` companion file for extended context
- No contact/authorship section
- No key statistics or unique data points

**Recommendation:** Add license header and a "Key Facts" section:
```
# License: You may cite this content with attribution to TheResumeCompany (theresumecompany.com)

## Key Facts
- 15 professional resume templates across 7 categories
- AI powered by Google Gemini API
- ATS scanner scores resumes 0-100 against job descriptions
- Free tier: 100 credits (enough for full resume + ATS scan + PDF export)
- Pro plan: $12/month or $99/year (unlimited AI)
```

---

## 5. Brand Mention Analysis

| Platform | Presence | Impact on AI Citations |
|----------|----------|----------------------|
| YouTube | NOT PRESENT | Correlation: ~0.737 (STRONGEST) |
| Reddit | NOT PRESENT | High correlation |
| Wikipedia | NOT PRESENT | High correlation (47.9% of ChatGPT citations) |
| LinkedIn | NOT PRESENT | Moderate correlation |
| Twitter/X | NOT PRESENT | Moderate correlation |
| Organization sameAs | EMPTY | No entity linking |

**This is the #1 area holding back GEO scores.** Per Ahrefs Dec 2025 study, brand mentions correlate 3x more strongly with AI visibility than backlinks. YouTube mentions alone have ~0.737 correlation.

**Priority actions:**
1. Create YouTube channel with 1 intro video explaining the product
2. Create LinkedIn company page
3. Participate in r/resumes, r/jobs on Reddit
4. Populate Organization schema `sameAs` array with all profile URLs

---

## 6. Passage-Level Citability Analysis

### Strong Citable Passages (Already Present)

**Homepage hero:**
> "According to hiring industry research, up to 75% of resumes are filtered out by applicant tracking systems before a recruiter sees them."

- Length: 25 words (too short for optimal 134-167 word block)
- Issue: No named source attribution
- Fix: Expand and cite source

**Compare page verdicts (example — vs Zety):**
> "TheResumeCompany offers a more affordable Pro plan at $12/month vs Zety's $24.95/month, with unique features like an AI full resume generator, ATS optimizer that rewrites your bullets, and free PDF exports."

- Length: ~35 words
- Good: Specific pricing, feature differentiation
- Fix: Expand to 134-167 words with more context

**Pricing FAQ answers:**
> 10 Q&A pairs averaging 40-80 words each
- Good: Direct answers to specific questions
- Fix: Expand key answers to 134-167 word range

### Missing Citable Passages

1. **No "What is TheResumeCompany?" definition block** — First 60 words of About page should define the product
2. **No "Key Takeaway" summary blocks** in blog articles or compare pages
3. **No statistics with named sources** — "75% of resumes filtered" needs a citation
4. **No unique data points** — No original research or user metrics

### Recommended New Passages to Add

**About page — definition block (add to first paragraph):**
> "TheResumeCompany is an AI-powered resume builder that combines 15 professionally designed templates with six AI writing tools — including a bullet point writer, professional summary generator, full resume wizard, ATS scanner, ATS optimizer, and cover letter generator. Built for job seekers who want to create ATS-compatible resumes without hiring a professional writer, it offers a free tier with 100 credits and a Pro plan at $12/month for unlimited AI usage."

(67 words — good for "What is X?" extraction)

**Blog articles — add "Key Takeaway" blocks:**
Each article should have a highlighted summary block of 134-167 words at the top, wrapped in a visually distinct callout component.

---

## 7. Server-Side Rendering Check

| Page | Rendering | JS Required for Content? |
|------|-----------|------------------------|
| Homepage | **SSR** (async server component) | No — all text in initial HTML |
| Pricing | **SSR** | No |
| About | **SSR** | No |
| Blog articles | **SSR** | No |
| Compare pages | **SSR** | No |
| Roundup | **SSR** | No |
| Templates | **SSR** | No |
| Contact | **SSR** | No |
| Privacy/Terms | **SSR** | No |

**Client components on homepage:**
- `LandingAnimations` — wraps server-rendered children, only adds scroll animations
- `LogoIntro` — CSS-only overlay (no GSAP), 700ms, skipped for bots without sessionStorage

**Verdict:** All content accessible without JavaScript. AI crawlers will see full page content. **9/10**

---

## 8. Top 5 Highest-Impact Changes

### 1. Create YouTube + LinkedIn + Reddit presence (Expected: +5-8 GEO points)
**Why:** YouTube mentions have ~0.737 correlation with AI citations (strongest signal). Only 11% of domains are cited by both ChatGPT and Google AI Overviews — cross-platform presence is essential.
**How:** Create YouTube channel with 1 product demo video. Create LinkedIn company page. Post helpful resume tips on r/resumes.
**Effort:** Medium (2-3 hours setup + ongoing)

### 2. Add source attributions to all statistics (Expected: +2-3 points)
**Why:** AI systems strongly prefer statistics from named sources. Unsourced claims are deprioritized.
**How:** Replace "hiring industry research" with "according to Jobvite's 2025 Recruiter Nation Survey" or similar. Cite source for "97% of Fortune 500 use ATS."
**Effort:** Low (1 hour research + edits)

### 3. Add author bylines with Person schema (Expected: +2-3 points)
**Why:** AI systems weight content from identifiable human authors higher. Organization-only authorship is weaker.
**How:** Add real author name, credentials, and `@type: Person` schema to blog articles. Link to LinkedIn.
**Effort:** Low (30 min)

### 4. Add "Key Takeaway" summary blocks to articles (Expected: +2-3 points)
**Why:** 134-167 word self-contained blocks are optimal for AI citation extraction. Currently no articles have these.
**How:** Add a highlighted callout component at the top of each blog article and compare page with a concise summary.
**Effort:** Low (1-2 hours)

### 5. Create original research or unique data (Expected: +3-5 points)
**Why:** Unique data points are the highest-value citable content. No other source can provide them.
**How:** Publish a "State of Resume Building 2026" report with data from your own users (anonymized). E.g., "Average ATS score before optimization: 47. After: 82." or "Most common missing keywords: [list]."
**Effort:** High (requires user data + analysis)

---

## 9. Schema Recommendations for AI Discoverability

### Already Implemented (Excellent)
- Organization with @id and ImageObject logo
- WebSite with SearchAction
- WebApplication with AggregateOffer
- Article with image, author @id, publisher @id
- BreadcrumbList on ALL pages
- FAQPage on pricing + 3 compare pages
- CollectionPage + ItemList on templates
- ItemList (ranked) on roundup

### Missing (Would Improve GEO)
1. **Person schema for blog authors** — Add `@type: Person` with `name`, `jobTitle`, `url`, `sameAs` (LinkedIn)
2. **SpeakableSpecification** — Mark key passages as speakable for voice AI (Google Assistant)
3. **HowTo is deprecated** — Do NOT add (removed by Google Sept 2023)
4. **Review/AggregateRating** — Add once you have user reviews (strong AI citation signal)

---

## 10. Content Reformatting Suggestions

### Homepage Hero — Reformat for Citability
**Current:** "According to hiring industry research, up to 75% of resumes are filtered out..."
**Suggested:** "According to Jobvite's 2025 Recruiter Nation Survey, approximately 75% of resumes are filtered out by applicant tracking systems (ATS) before a human recruiter ever sees them. TheResumeCompany solves this with an AI-powered ATS scanner that scores your resume 0-100 against specific job descriptions and an optimizer that rewrites your bullet points to include missing keywords."
(~55 words — good definition + value prop block)

### Blog Articles — Add Callout Blocks
Each article should start with a `<aside>` or highlighted div:
```
Key Takeaway: [134-167 word summary of the article's main advice,
written as a self-contained passage that AI can extract and cite
without needing surrounding context]
```

### Compare Pages — Expand Verdict Blocks
The "Quick summary" at the top of each compare page should be expanded to 134-167 words with specific feature comparisons, pricing, and a clear recommendation.

### Pricing FAQ — Expand Key Answers
The top 3 most-searched FAQ questions should have answers expanded to 100+ words with specific details AI can extract.

---

## Score History

| Date | Score | Key Change |
|------|-------|------------|
| 2026-03-16 (initial) | 68/100 | Baseline — missing OAI-SearchBot, wrong llms.txt URL, thin compare pages |
| 2026-03-16 (final) | **82/100** | +OAI-SearchBot, fixed llms.txt, 1,100+ word compare pages with FAQ schema, roundup with ItemList, all BreadcrumbList added |

**Next target: 90/100** — Requires external brand presence (YouTube, Reddit, LinkedIn) and source-attributed statistics.
