# SEO Action Plan — TheResumeCompany.com

**Updated:** 2026-03-16 (Post-Implementation Re-Audit)
**Current Score:** 70/100 (was 41/100)
**Target:** 90/100

---

## P0 — Critical (Fix Now) — Target: +5 points

### 1. Fix LogoIntro LCP blocker
- **Impact:** +5 points (Performance 52 → 72)
- **File:** `src/components/marketing/logo-intro.tsx`, `src/components/marketing/landing-animations.tsx`
- **Problem:** LogoIntro blocks all content for ~800ms on every first visit + every bot visit. GSAP then applies opacity:0 and re-animates hero. Total LCP delay: 4-6s.
- **Fix:** Either remove LogoIntro entirely, or make it CSS-only (no JS dependency). Stop GSAP from setting hero content to opacity:0 — use CSS animations for entrance instead. Make LogoIntro import gsap lazily (currently static import adds 30KB).

---

## P1 — High (Fix This Week) — Target: +9 points

### 2. Fix footer `/templates` → `/resume-templates` link
- **File:** `src/components/marketing/footer.tsx:7`
- **Problem:** Links to auth-gated page; crawlers redirected to login

### 3. Add explicit canonical URLs to all pages
- **Files:** `pricing/page.tsx`, `about/page.tsx`, `privacy/page.tsx`, `terms/page.tsx`, `contact/page.tsx`, `compare/[slug]/page.tsx`, `blog/page.tsx`
- **Fix:** Add `alternates: { canonical: '/path' }` to each page's metadata export

### 4. Fix Organization schema
- **File:** `src/app/layout.tsx`
- **Fixes:** Change SVG logo to raster image, populate `sameAs` array with social profiles, add `@id: '#organization'`

### 5. Fix Article schema — add `image` property
- **File:** `src/app/(marketing)/blog/[slug]/page.tsx`
- **Problem:** Articles ineligible for Google rich results without `image`
- **Fix:** Add `image: siteUrl + '/opengraph-image'` to Article JSON-LD

### 6. Fix SearchAction target URL
- **File:** `src/app/layout.tsx:114`
- **Fix:** Change `/templates?q=` to `/resume-templates?q=`

### 7. Fix WebApplication offerCount
- **File:** `src/app/(marketing)/page.tsx`
- **Fix:** Change `offerCount: 4` to `offerCount: 3`

### 8. Add BreadcrumbList to 5 missing pages
- **Pages:** About, Contact, Privacy, Terms, Blog index
- **Fix:** Add `<JsonLd>` with BreadcrumbList to each

### 9. Add header nav links
- **File:** `src/components/marketing/header.tsx`
- **Fix:** Add Templates (/resume-templates), Blog (/blog), Contact (/contact)

### 10. Diversify sitemap lastModified dates
- **File:** `src/app/sitemap.ts`
- **Fix:** Use real dates — blog articles from their publication date, legal pages from creation

### 11. Add OAI-SearchBot to robots.ts
- **File:** `src/app/robots.ts`
- **Fix:** Add explicit allow rule for OAI-SearchBot (ChatGPT Search)

### 12. Delete dead `landing-page.tsx`
- **File:** `src/components/marketing/landing-page.tsx`
- **Reason:** 840 lines duplicating server-rendered page, confusing, potential accidental import

---

## P2 — Medium (Fix This Month) — Target: +6 points

### 13. Add founder/team info to About page
- **Impact:** Biggest E-E-A-T improvement possible
- **Add:** Founder name, photo, LinkedIn, genuine origin story, team info

### 14. Add author bylines to blog articles
- **Add:** Author name + bio link on each article, `author` field in Article JSON-LD

### 15. Expand comparison pages to 800+ words each
- **Currently:** ~200 words each (critically thin)
- **Add:** Prose analysis, "who should choose" sections, pricing context, FAQ

### 16. Add testimonials/social proof to homepage
- **Add:** 3-5 user quotes with names and roles, or metrics (users, resumes created)

### 17. Add product screenshots to marketing pages
- **Problem:** Entire marketing site has zero visual proof the product exists
- **Add:** Editor screenshot, template previews, ATS scanner UI

### 18. Expand blog articles to 1,500+ words each
- **Currently:** 1,100-1,400 words (all below target)
- **Add:** ~200-400 more words per article with deeper examples

### 19. Add contact form + real address
- **Currently:** Email-only, "United States" (no city/state)
- **Add:** Form component, specific address

### 20. Add FAQPage schema to Templates and About page FAQs
- **Currently:** Only Pricing has FAQPage schema
- **Add:** JSON-LD FAQPage where FAQ content exists

---

## P3 — Low (Backlog)

### 21. Enforce CSP (remove Report-Only)
### 22. Add visible breadcrumb UI to all interior pages
### 23. Convert About page headings to question format
### 24. Add "last updated" dates to blog articles
### 25. Stagger blog publication dates (currently all 2026-03-16)
### 26. Create `llms-full.txt` with expanded content
### 27. Add license declaration to `llms.txt`
### 28. Add IndexNow key file to `public/`
### 29. Add ContactPage JSON-LD to contact page
### 30. Add CollectionPage JSON-LD to blog index
### 31. Create YouTube/LinkedIn/Twitter presence (strongest AI citation signals)
### 32. Expand blog to 15-20 articles
### 33. Add RSS feed for blog
### 34. Add Google-Extended block in robots.ts
### 35. Cite sources for "75% ATS rejection" statistic

---

## Progress Tracker

| Phase | Items | Expected Score After |
|-------|-------|---------------------|
| P0 (Critical) | 1 item | ~75/100 |
| P1 (High) | 11 items | ~80/100 |
| P2 (Medium) | 8 items | ~88/100 |
| P3 (Low) | 15 items | ~93/100 |
