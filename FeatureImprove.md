Feature Improvements (Existing Features That Need Polish)
1. Template Color/Font Customization (HIGH IMPACT)
The configs support custom colors and fonts but there's no UI to change them. Every competitor (Zety, Resume.io, Canva) has a color picker + font selector in the editor sidebar. This is the #1 missing UX feature.

2. Photo Upload (BROKEN)
The personal info form has a photo URL field but no actual file upload component. Users can't drag-drop a photo. This matters for non-US markets where photos on resumes are standard.

3. Cover Letter Save & Templates
You have a generator but:

Cover letters can only be downloaded as .txt or copied — can't be saved to the resume
No cover letter template library to browse (competitors have 20+)
4. DOCX Export
PDF-only export locks out users who need Word format (many job boards require .docx). This is a common reason users leave for competitors.

5. Resume Format Selector
No way to switch between chronological, functional, or hybrid formats. The wizard hardcodes chronological. Career changers and gap-year users need functional format.

New Features to Add (Ranked by Impact)
Tier 1 — Ship Before Marketing Push
Feature	Why	Revenue Impact
Color/Font Picker in Editor	#1 UX gap. Every competitor has it. Takes 2-3 days.	Reduces churn
Email Onboarding Drip (7-day sequence)	Welcome email exists but no follow-up. Day 2: templates, Day 3: AI tools, Day 5: ATS scanner, Day 7: upgrade.	+15-25% activation
Referral Program ("Invite friend → 50 credits each")	Zero viral mechanics right now. Public resume links exist but no incentive to share.	Free growth channel
"Credits Running Low" Email	When user hits <20 credits, email them. Easy Resend trigger.	Upsell to credit packs
Newsletter Signup on landing + blog	Zero email list building. You have Resend but no marketing emails.	Long-term nurture
Tier 2 — Growth Features (Month 1-2 Post-Launch)
Feature	Why	Revenue Impact
DOCX Export	Many job boards require Word. ~30 credits. Add as export option alongside PDF.	New monetizable feature
Resume Examples Gallery (/examples)	"Resume for Software Engineer", "Resume for Nurse" — public pages with real anonymized examples. Programmatic SEO goldmine.	Organic traffic
Job Description Auto-Fill from URL	Paste Indeed/LinkedIn job URL → extract title, company, requirements automatically. Saves users 2 minutes per resume.	Retention + wow factor
Interview Prep Module	AI generates likely interview questions based on resume + job description. 25 credits.	New revenue stream
Resume Versioning	"v1 for Google, v2 for Amazon" — save multiple versions with tags. Currently users must duplicate the entire resume.	Pro upsell
Tier 3 — Competitive Moat (Month 3-6)
Feature	Why	Revenue Impact
LinkedIn Profile Optimizer	Paste LinkedIn URL → AI rewrites headline, summary, experience to match resume. 30 credits. No competitor does this well.	Unique differentiator
Salary Insights	"Based on your resume, your market value is $X-$Y." Use public salary data APIs.	Pro upsell
Job Board Integration	After export, show "Apply to 5 matching jobs on Indeed/LinkedIn." Affiliate revenue potential.	Affiliate income
Portfolio Builder	One-page portfolio site from resume data. Already on your roadmap.	Pro-only feature
Mobile App (React Native)	Job seekers check resumes on phones constantly.	Retention
Content & SEO Gaps (Biggest Growth Lever)
You have 5 blog posts. You need 40+ to rank for job seeker keywords. The comparison pages are excellent — keep those.

Immediate content priorities:

10 "Resume for [Job Title]" articles (Software Engineer, Product Manager, Nurse, Accountant, etc.)
10 resume writing guides (bullet points, skills section, gaps, career change, etc.)
"Free ATS Score Checker" as a standalone landing page (drives massive organic traffic)
Public resume examples gallery with real anonymized data
Programmatic SEO opportunity:

/resume-templates/{category}/{job-title} — e.g., /resume-templates/tech/software-engineer
Could generate 100+ pages from template × job title combinations
Each page has a unique H1, sample content, and CTA to sign up
Monetization Gaps
Gap	Fix
Pro templates have no paywall enforcement	Add check at render/export time — free users see "Upgrade to use this template"
No "Resume Review by Expert" tier	Partner with career coaches. $49 one-time. You take 30%.
Credit packs don't convert to Pro	After 2nd pack purchase, show "You've spent $X on packs. Pro is $12/mo unlimited."
No annual plan nudge	On monthly billing anniversary, email "Save 31% with annual"
No team/enterprise plan	Companies pay $50-200/mo for team resume builders. Add /enterprise page.
My Top 5 Recommendations as CTO
Ship color/font picker — 2-3 day effort, eliminates #1 UX complaint
Build email onboarding drip — 7 emails over 7 days. Biggest activation lever for zero engineering cost (just Resend templates)
Launch referral program — "Invite a friend, both get 50 credits." Add share button after PDF export
Write 20 more blog posts — Target "resume for [job title]" keywords. Each post = potential 500-2000 monthly organic visitors
Add DOCX export — Unlocks a segment of users who currently bounce because they need Word format