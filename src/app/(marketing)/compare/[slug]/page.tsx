import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Check, X, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { JsonLd } from '@/components/schema/json-ld'

interface FAQ {
  question: string
  answer: string
}

interface Competitor {
  name: string
  slug: string
  description: string
  features: { name: string; us: boolean | string; them: boolean | string }[]
  summary: string
  overview: string[]
  strengths: string[]
  weaknesses: string[]
  whoShouldChoose: { them: string; us: string }
  pricingComparison: string
  faq: FAQ[]
  lastVerified: string
}

const COMPETITORS: Record<string, Competitor> = {
  'vs-zety': {
    name: 'Zety',
    slug: 'vs-zety',
    description:
      'See how MyResumeCompany compares to Zety for AI resume building, ATS optimization, and pricing.',
    features: [
      { name: 'AI bullet point writer', us: true, them: true },
      { name: 'AI full resume generator', us: true, them: false },
      { name: 'ATS scanner with score', us: '0-100 score', them: 'Basic check' },
      { name: 'ATS optimizer (rewrite bullets)', us: true, them: false },
      { name: 'Cover letter generator', us: true, them: true },
      { name: 'Number of templates', us: '15', them: '20+' },
      { name: 'Free tier', us: '100 credits', them: 'Limited preview' },
      { name: 'PDF export on free plan', us: true, them: false },
      { name: 'Pro price', us: '$12/mo', them: '$24.95/mo' },
      { name: 'Public shareable link', us: true, them: false },
      { name: 'Drag-and-drop editor', us: true, them: true },
    ],
    summary:
      "MyResumeCompany offers a more affordable Pro plan at $12/month vs Zety's $24.95/month, with unique features like an AI full resume generator, ATS optimizer that rewrites your bullets, and free PDF exports. Zety has a larger template library and strong brand recognition, but charges significantly more for a comparable feature set.",
    overview: [
      "Zety is one of the most recognized names in the online resume builder space. Founded in 2016, Zety has built a reputation for its polished user interface, wide template selection, and built-in writing tips that guide users through the resume creation process step by step. With over 20 templates spanning professional, modern, and creative styles, Zety appeals to a broad audience of job seekers, from recent graduates to experienced professionals switching careers.",
      "Zety's core product revolves around a form-based editor that walks users through each section of a resume. The platform offers pre-written phrases for common job titles, which can be helpful for people who struggle with resume writing. Zety also provides a cover letter builder and some basic resume checking features. Their builder is available in multiple languages, making it popular with international job seekers.",
      "However, Zety has drawn criticism for its pricing model. While the builder appears free to use, downloading your finished resume as a PDF requires a paid subscription at $24.95 per month. Many users report feeling surprised by this paywall after investing time building their resume. Zety also lacks advanced ATS optimization features like job-description-specific bullet rewriting, which is becoming increasingly important as more employers rely on applicant tracking systems to filter candidates."
    ],
    strengths: [
      "Large template library with 20+ designs covering a wide range of industries and styles, giving users plenty of visual options to choose from.",
      "Well-structured step-by-step editor with pre-written phrases for hundreds of job titles, which is genuinely helpful for first-time resume writers who need guidance on what to include.",
      "Strong multilingual support with the builder available in several languages, making it accessible to non-English-speaking job seekers.",
      "Established brand with years of content marketing, including a popular career advice blog that provides useful resume writing tips and job search strategies."
    ],
    weaknesses: [
      "Pricing is significantly higher at $24.95/month compared to MyResumeCompany's $12/month Pro plan. Over a year, that adds up to nearly $300 vs $99 with our annual plan.",
      "No AI full resume generator — Zety helps you fill in sections, but it cannot generate a complete, tailored resume from a job title and your experience in one step.",
      "No ATS optimizer that rewrites your bullet points to match a specific job description. Zety offers basic checking, but not the intelligent rewriting that helps your resume rank higher in applicant tracking systems.",
      "Free tier is essentially a preview — you cannot download a PDF without paying. MyResumeCompany gives you 100 free credits, enough to generate AI content and export your resume without entering a credit card."
    ],
    whoShouldChoose: {
      them: "Choose Zety if you want a very guided, step-by-step resume building experience with pre-written content suggestions for your specific job title. If you prefer browsing a large template gallery and you value the hand-holding approach of having phrases suggested to you at each step, Zety's editor may appeal to you. Zety is also a reasonable choice if you need multilingual support for non-English resumes.",
      us: "Choose MyResumeCompany if you want advanced AI capabilities at a lower price. Our AI full resume generator creates an entire resume tailored to your target role, our ATS scanner gives you a specific 0-100 score, and our ATS optimizer rewrites your bullet points to match the exact job description you are applying to. At $12/month (or $99/year), you get more AI power for less than half of what Zety charges. Our free tier also lets you actually export a PDF, so you can try before you buy."
    },
    pricingComparison:
      "Zety's Pro plan is priced at $24.95 per month with no annual discount publicly available — that works out to roughly $300 per year if you stay subscribed. By comparison, MyResumeCompany Pro is $12 per month or $99 per year, saving you over $200 annually. On Zety's free tier, you can build a resume but cannot download it as a PDF, which many users find frustrating after spending time on their resume. MyResumeCompany's free tier includes 100 credits — enough to use AI features and export at least one complete resume as a PDF without paying anything. Zety does not offer credit packs or pay-as-you-go options; it is subscription-only. MyResumeCompany offers both subscriptions and credit packs starting at $4.99 for 100 credits, giving you flexibility to pay only when you need to. For active job seekers who need multiple resumes and cover letters, the cost difference is substantial.",
    faq: [
      {
        question: 'Is Zety worth the price at $24.95/month?',
        answer: 'Zety is a solid resume builder with good templates and writing guidance, but at $24.95/month it is one of the most expensive options on the market. If you primarily need AI-powered resume writing, ATS optimization, and PDF exports, MyResumeCompany offers all of those features at $12/month — less than half the cost. Zety may be worth it if you specifically value their pre-written phrase library and multilingual support.'
      },
      {
        question: 'Can I switch from Zety to MyResumeCompany?',
        answer: 'Yes. While there is no direct import from Zety, you can use our AI full resume generator to recreate your resume quickly. Simply provide your job title, experience, and skills, and our AI will generate a complete resume in under a minute. You can also manually copy your content into our editor, which supports all the same section types as Zety.'
      },
      {
        question: 'Does Zety have an ATS scanner like MyResumeCompany?',
        answer: 'Zety offers a basic resume check that flags general issues, but it does not provide a specific ATS compatibility score or rewrite your content to match a job description. MyResumeCompany\'s ATS scanner gives you a detailed 0-100 score with a breakdown of what is working and what needs improvement, plus an optimizer that rewrites your bullet points to include relevant keywords from the job posting.'
      },
      {
        question: 'Is Zety free to use?',
        answer: 'Zety lets you build a resume for free using their editor, but downloading your resume as a PDF requires a paid subscription. This is a common point of frustration for users who invest time creating their resume only to find they need to pay to download it. MyResumeCompany gives every new user 100 free credits — enough to use AI features and export your resume as a PDF without paying.'
      }
    ],
    lastVerified: '2026-03-10',
  },
  'vs-resume-io': {
    name: 'Resume.io',
    slug: 'vs-resume-io',
    description:
      'Compare MyResumeCompany and Resume.io — pricing, AI features, ATS optimization, and template quality.',
    features: [
      { name: 'AI bullet point writer', us: true, them: true },
      { name: 'AI full resume generator', us: true, them: false },
      { name: 'ATS scanner with score', us: '0-100 score', them: false },
      { name: 'ATS optimizer (rewrite bullets)', us: true, them: false },
      { name: 'Cover letter generator', us: true, them: true },
      { name: 'Number of templates', us: '15', them: '30+' },
      { name: 'Free tier', us: '100 credits', them: '1 resume' },
      { name: 'PDF export on free plan', us: true, them: false },
      { name: 'Pro price', us: '$12/mo', them: '$15/mo' },
      { name: 'Public shareable link', us: true, them: false },
      { name: 'Drag-and-drop editor', us: true, them: true },
    ],
    summary:
      "MyResumeCompany stands out with its ATS scanner and optimizer — features Resume.io doesn't offer. Our AI can generate entire resumes from scratch and rewrite bullets to match specific job descriptions. Resume.io has more templates and a clean interface, but fewer AI capabilities and no ATS-specific tools.",
    overview: [
      "Resume.io is a popular resume builder known for its clean, intuitive interface and large collection of professionally designed templates. With over 30 templates organized by category, Resume.io has built a strong following among job seekers who value simplicity and visual polish. The platform launched in 2018 and has grown steadily, particularly among younger professionals and international users, as it supports multiple languages and regional resume formats.",
      "The Resume.io editing experience is straightforward: you pick a template, fill in your details through a form-based interface, and the preview updates in real time. The platform also includes AI-powered writing suggestions that help users craft bullet points for common job titles. Resume.io offers a cover letter builder as well, and the overall design aesthetic tends to be modern and clean. Their template library is one of the largest among dedicated resume builders.",
      "Where Resume.io falls short is in advanced AI and ATS optimization features. The platform does not include an ATS scanner that scores your resume against a job description, nor does it offer an optimizer that rewrites your content to improve ATS compatibility. As applicant tracking systems become more sophisticated and more employers rely on them to screen candidates, the absence of these features is a notable gap. Resume.io's pricing at $15/month is competitive but still higher than MyResumeCompany's $12/month Pro plan, and the free tier is limited to building one resume without PDF export."
    ],
    strengths: [
      "One of the cleanest, most intuitive user interfaces in the resume builder category. The editor is uncluttered and easy to navigate, even for people who are not tech-savvy.",
      "Large template library with 30+ designs that are well-organized by industry and style. Templates are visually polished and modern-looking.",
      "Good international support with multiple languages and awareness of regional resume conventions (such as CV formats common in Europe).",
      "Reliable cover letter builder that pairs well with their resume templates, offering consistent styling across both documents."
    ],
    weaknesses: [
      "No ATS scanner or ATS optimizer — Resume.io does not give you a score for how well your resume will perform in applicant tracking systems, and it cannot rewrite your bullets to match a job description.",
      "No AI full resume generator. While Resume.io offers AI writing suggestions for individual bullet points, it cannot generate a complete resume from scratch based on your target role and experience.",
      "Free tier is very limited — you can build one resume but cannot export it as a PDF. MyResumeCompany gives you 100 free credits to actually use AI features and download your finished resume.",
      "No public shareable links. With MyResumeCompany, you can share your resume via a unique URL, which is useful for networking, portfolio sites, or sending to recruiters without attaching a file."
    ],
    whoShouldChoose: {
      them: "Choose Resume.io if your top priority is browsing a large library of beautifully designed templates and you want a very simple, no-frills editing experience. If you already know what to write on your resume and just need a clean tool to format it, Resume.io's straightforward editor and wide template selection may be all you need. Resume.io is also a good option if you need to create resumes in multiple languages or follow European CV conventions.",
      us: "Choose MyResumeCompany if you want AI that goes beyond basic writing suggestions. Our AI full resume generator creates a complete, tailored resume from your experience and target role. Our ATS scanner gives you a specific score with actionable feedback, and our ATS optimizer rewrites your bullet points to match the job you are applying to — a feature no other builder in this price range offers. At $12/month vs $15/month, you get more features for less money, plus a free tier that actually lets you export a PDF."
    },
    pricingComparison:
      "Resume.io charges $15 per month for their Pro plan, which includes unlimited resumes, PDF exports, and access to all templates. MyResumeCompany Pro is $12 per month or $99 per year — saving you $36 annually on monthly billing or $81 on annual billing compared to Resume.io's monthly rate. Resume.io's free tier allows you to build one resume but does not include PDF export, meaning you cannot actually use your resume without paying. MyResumeCompany's free tier includes 100 credits, which is enough to generate AI bullet points, run an ATS scan, and export a PDF — giving you a genuine trial of the full product. For users who need resumes occasionally rather than monthly, MyResumeCompany also offers credit packs starting at $4.99 for 100 credits, while Resume.io only offers subscription-based pricing with no pay-as-you-go option.",
    faq: [
      {
        question: 'How does Resume.io compare to MyResumeCompany for ATS compatibility?',
        answer: 'Resume.io templates are generally ATS-compatible in terms of formatting, but the platform does not include any tools to check or improve your ATS score. MyResumeCompany includes a dedicated ATS scanner that gives your resume a 0-100 compatibility score, identifies missing keywords, and highlights areas for improvement. Our ATS optimizer then rewrites your bullet points to incorporate relevant keywords from the specific job description you are targeting.'
      },
      {
        question: 'Is Resume.io worth $15/month?',
        answer: 'Resume.io offers a solid, clean resume builder with a good template library and cover letter support. At $15/month, it is reasonably priced compared to some competitors. However, MyResumeCompany offers more AI features — including a full resume generator and ATS optimizer — for $12/month, which is $3 less. If AI-powered resume writing and ATS optimization matter to you, MyResumeCompany provides better value.'
      },
      {
        question: 'Can I transfer my Resume.io resume to MyResumeCompany?',
        answer: 'There is no direct import feature, but transferring is simple. You can use our AI full resume generator to quickly recreate your resume by providing your job title, experience, and skills. Alternatively, you can copy your content section by section into our editor. Most users complete the transfer in under 10 minutes.'
      },
      {
        question: 'Does Resume.io have AI features?',
        answer: 'Resume.io includes AI-powered writing suggestions that help you write bullet points for common job titles. However, it does not offer an AI full resume generator, ATS scanner, ATS optimizer, or AI-powered summary writer with multiple tone options. MyResumeCompany offers all of these AI features, giving you significantly more writing assistance and optimization tools.'
      }
    ],
    lastVerified: '2026-03-10',
  },
  'vs-canva': {
    name: 'Canva',
    slug: 'vs-canva',
    description:
      'MyResumeCompany vs Canva for resume building — why a dedicated resume builder beats a general design tool.',
    features: [
      { name: 'AI bullet point writer', us: true, them: false },
      { name: 'AI full resume generator', us: true, them: false },
      { name: 'ATS scanner with score', us: '0-100 score', them: false },
      { name: 'ATS optimizer (rewrite bullets)', us: true, them: false },
      { name: 'Cover letter generator', us: true, them: false },
      { name: 'ATS-compatible output', us: true, them: 'Often fails' },
      { name: 'Free tier', us: '100 credits', them: 'Free with ads' },
      { name: 'PDF export on free plan', us: true, them: true },
      { name: 'Resume-specific editor', us: true, them: false },
      { name: 'Public shareable link', us: true, them: false },
      { name: 'Drag-and-drop sections', us: true, them: true },
    ],
    summary:
      "Canva is a powerful design tool, but it is not built for resumes. Canva resumes frequently fail ATS parsing because they rely on images, text boxes, and non-standard layouts that applicant tracking systems cannot read. MyResumeCompany is purpose-built for job seekers with AI writing, ATS optimization, and templates that are tested against real ATS systems. Canva is the better choice for visual design projects — MyResumeCompany is the better choice for actually getting hired.",
    overview: [
      "Canva is one of the most popular online design tools in the world, used by millions of people to create everything from social media graphics and presentations to flyers and business cards. Canva also offers a large collection of resume templates, which has made it a go-to choice for job seekers who want visually striking resumes without hiring a graphic designer. The platform is free to use with ads, and Canva Pro ($12.99/month) removes watermarks and adds premium assets.",
      "Canva's appeal for resume building lies in its design flexibility. You can customize colors, fonts, layouts, and graphics with complete freedom using a drag-and-drop canvas. With thousands of resume templates created by both Canva's team and community designers, there is no shortage of visual options. For creative professionals — graphic designers, artists, marketers — a Canva resume can serve as a visual portfolio piece that showcases design sensibility alongside professional experience.",
      "However, this design freedom comes with a critical downside for most job seekers: ATS compatibility. Applicant tracking systems parse resumes by reading the underlying text structure of a document. Canva exports resumes as flat images or PDFs with text embedded in non-standard ways — text boxes, layered elements, and graphical layouts that ATS software cannot reliably parse. Studies and industry experts consistently report that heavily designed resumes from tools like Canva have significantly higher rejection rates when submitted through online application portals. If your resume cannot be parsed by an ATS, a human recruiter may never see it, regardless of how impressive your qualifications are."
    ],
    strengths: [
      "Unmatched design flexibility — Canva gives you complete control over every visual element, making it possible to create truly unique and visually striking resumes that stand out aesthetically.",
      "Massive template library with thousands of community-created and professionally designed resume templates in every visual style imaginable.",
      "Genuinely free tier that lets you create and export resumes as PDFs without paying. While ads are present, the core functionality is accessible at no cost.",
      "Familiar interface that millions of people already know how to use. If you have created a Canva presentation or social media post, you already know how the editor works."
    ],
    weaknesses: [
      "Canva resumes frequently fail ATS parsing. Because Canva is a design tool, not a resume builder, it exports text in non-standard ways that applicant tracking systems cannot reliably read. This is the single biggest issue with using Canva for resumes — your application may be automatically rejected before a human ever sees it.",
      "No resume-specific AI features whatsoever. Canva does not offer an AI bullet point writer, summary generator, full resume generator, or any writing assistance tailored to resume content. You are entirely on your own for writing.",
      "No ATS scanner or optimizer. Canva cannot tell you whether your resume will pass an ATS, and it cannot rewrite your content to improve compatibility with a specific job description.",
      "Not structured for resume content. Canva treats a resume as a visual design project, not a structured document. There are no dedicated fields for job titles, dates, or bullet points — just text boxes on a canvas. This makes it harder to maintain consistent formatting and easy to introduce layout issues."
    ],
    whoShouldChoose: {
      them: "Choose Canva if you are applying to roles where your resume will be reviewed directly by a human and not filtered through an ATS — for example, if you are handing your resume to someone in person, emailing it directly to a hiring manager, or applying to a small company that does not use applicant tracking software. Canva is also a reasonable choice for creative professionals (graphic designers, art directors, UX designers) who want their resume to double as a design portfolio piece and who know their application will be seen by a human reviewer.",
      us: "Choose MyResumeCompany if you are applying to jobs online through company websites, job boards, or application portals — which is how the vast majority of jobs are filled today. Our templates are tested against real ATS systems to ensure your resume gets parsed correctly. Our ATS scanner gives you a specific compatibility score, and our optimizer rewrites your bullets to match the job description. Combined with AI writing tools that help you craft professional content, MyResumeCompany is built for the reality of modern job applications."
    },
    pricingComparison:
      "Canva's free tier is genuinely free — you can create and download resumes as PDFs at no cost, though you will see ads and some premium templates and assets require Canva Pro ($12.99/month). MyResumeCompany's free tier includes 100 credits, which covers AI content generation and PDF export without ads. MyResumeCompany Pro at $12/month is slightly less than Canva Pro at $12.99/month, but the comparison is not entirely apples-to-apples: Canva Pro gives you access to the full Canva design suite (presentations, social media, etc.), while MyResumeCompany Pro is focused entirely on resume building with AI writing, ATS optimization, and professional templates. If you only need Canva for resumes, MyResumeCompany is the better investment because you get resume-specific AI tools and ATS compatibility that Canva simply does not offer. If you already pay for Canva Pro for other design needs, you still benefit from using MyResumeCompany for your actual job applications to ensure ATS compatibility.",
    faq: [
      {
        question: 'Are Canva resumes ATS-compatible?',
        answer: 'In most cases, no. Canva exports resumes using image layers, text boxes, and non-standard PDF structures that applicant tracking systems struggle to parse. While some simpler Canva templates may fare better than heavily designed ones, there is no reliable way to verify ATS compatibility within Canva. MyResumeCompany templates are specifically built and tested for ATS compatibility, and our ATS scanner lets you verify your score before you apply.'
      },
      {
        question: 'Should I use Canva or a dedicated resume builder?',
        answer: 'If you are submitting your resume through online job portals or company application systems (which use ATS software to screen candidates), you should use a dedicated resume builder like MyResumeCompany. Applicant tracking systems need to read your resume\'s text content accurately, and Canva\'s design-first approach often produces files that ATS cannot parse correctly. A dedicated resume builder ensures your content is structured for both human readers and automated systems.'
      },
      {
        question: 'Can I make my Canva resume ATS-friendly?',
        answer: 'It is very difficult. Even if you use a simple Canva template, the underlying PDF structure may still cause parsing issues with ATS software. Some people try to work around this by copying their text into a plain document, but that defeats the purpose of using Canva. A better approach is to use a purpose-built resume tool like MyResumeCompany, where every template is designed to be both visually professional and ATS-compatible from the start.'
      },
      {
        question: 'Is Canva good enough for a simple resume?',
        answer: 'Canva can produce a visually acceptable simple resume, but you miss out on AI writing assistance, ATS scanning, and ATS optimization — tools that can meaningfully improve your chances of getting interviews. If you are just formatting text you have already written and will hand the resume to someone directly, Canva works. If you are applying online and want AI help writing strong content, MyResumeCompany is the better tool for the job.'
      }
    ],
    lastVerified: '2026-03-10',
  },
}

const COMPETITOR_SLUGS = Object.keys(COMPETITORS)

export async function generateStaticParams() {
  return COMPETITOR_SLUGS.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const comp = COMPETITORS[slug]
  if (!comp) return {}
  return {
    title: `MyResumeCompany vs ${comp.name} (2026) — Features, Pricing & Honest Comparison`,
    description: comp.description,
    alternates: { canonical: `/compare/${slug}` },
  }
}

export default async function ComparePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const comp = COMPETITORS[slug]
  if (!comp) notFound()

  const siteUrl =
    process.env.NEXT_PUBLIC_APP_URL || 'https://myresumecompany.canmero.com'

  const otherComparisons = COMPETITOR_SLUGS.filter((s) => s !== slug).map(
    (s) => COMPETITORS[s]
  )

  return (
    <>
      {/* BreadcrumbList schema — 3 levels */}
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: siteUrl,
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Compare',
              item: `${siteUrl}/compare`,
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: `vs ${comp.name}`,
              item: `${siteUrl}/compare/${slug}`,
            },
          ],
        }}
      />

      {/* FAQPage schema */}
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: comp.faq.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: item.answer,
            },
          })),
        }}
      />

      <div className="mx-auto max-w-4xl px-4 py-16 sm:py-24">
        {/* Breadcrumb nav */}
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-muted-foreground">
          <ol className="flex items-center gap-1.5">
            <li>
              <Link href="/" className="hover:text-foreground transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <span>Compare</span>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-foreground font-medium">vs {comp.name}</li>
          </ol>
        </nav>

        {/* Page heading */}
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          MyResumeCompany vs {comp.name}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">{comp.description}</p>

        {/* Quick summary */}
        <div className="mt-8 rounded-xl border-l-4 border-primary bg-primary/5 p-6">
          <h2 className="text-lg font-semibold">Quick summary</h2>
          <p className="mt-2 text-muted-foreground leading-relaxed">
            {comp.summary}
          </p>
        </div>

        {/* Feature comparison table */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold">
            Feature-by-feature comparison
          </h2>
          <p className="mt-2 text-muted-foreground">
            A side-by-side look at what each platform offers.
          </p>
          <div className="mt-6 overflow-hidden rounded-xl border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-5 py-3 text-left font-medium">Feature</th>
                  <th className="px-5 py-3 text-center font-medium">
                    MyResumeCompany
                  </th>
                  <th className="px-5 py-3 text-center font-medium">
                    {comp.name}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {comp.features.map((f) => (
                  <tr key={f.name}>
                    <td className="px-5 py-3">{f.name}</td>
                    <td className="px-5 py-3 text-center">
                      <FeatureValue value={f.us} positive />
                    </td>
                    <td className="px-5 py-3 text-center">
                      <FeatureValue value={f.them} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* About competitor */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold">About {comp.name}</h2>
          <div className="mt-4 space-y-4 text-muted-foreground leading-relaxed">
            {comp.overview.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </div>

        {/* Where competitor wins */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold">
            Where {comp.name} wins
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            To be fair, here is what {comp.name} does well.
          </p>
          <ul className="mt-4 space-y-3">
            {comp.strengths.map((strength, i) => (
              <li key={i} className="flex gap-3">
                <Check className="mt-1 h-4 w-4 shrink-0 text-blue-500" />
                <span className="text-muted-foreground leading-relaxed">
                  {strength}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Where MyResumeCompany wins */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold">
            Where MyResumeCompany wins
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Here is where our platform has a clear advantage over {comp.name}.
          </p>
          <ul className="mt-4 space-y-3">
            {comp.weaknesses.map((weakness, i) => (
              <li key={i} className="flex gap-3">
                <Check className="mt-1 h-4 w-4 shrink-0 text-green-500" />
                <span className="text-muted-foreground leading-relaxed">
                  {weakness}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <p className="text-sm text-muted-foreground">
              Want to see our{' '}
              <Link
                href="/resume-templates"
                className="text-primary underline underline-offset-4 hover:text-primary/80"
              >
                ATS-tested templates
              </Link>{' '}
              or learn more about{' '}
              <Link
                href="/blog/what-is-ats-and-how-to-beat-it"
                className="text-primary underline underline-offset-4 hover:text-primary/80"
              >
                how ATS works and how to beat it
              </Link>
              ?
            </p>
          </div>
        </div>

        {/* Pricing breakdown */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold">Pricing breakdown</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Pricing as of March 2026. Check each platform for the latest rates.
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            {comp.pricingComparison}
          </p>
          <div className="mt-4">
            <Link
              href="/pricing"
              className="text-sm text-primary underline underline-offset-4 hover:text-primary/80"
            >
              View MyResumeCompany pricing details
            </Link>
          </div>
        </div>

        {/* Who should choose which */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold">
            Who should choose which?
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div className="rounded-xl border p-6">
              <h3 className="font-semibold">
                Choose {comp.name} if&hellip;
              </h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                {comp.whoShouldChoose.them}
              </p>
            </div>
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-6">
              <h3 className="font-semibold">
                Choose MyResumeCompany if&hellip;
              </h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                {comp.whoShouldChoose.us}
              </p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold">
            Frequently asked questions
          </h2>
          <div className="mt-6 space-y-6">
            {comp.faq.map((item, i) => (
              <div key={i} className="rounded-xl border p-6">
                <h3 className="font-semibold">{item.question}</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* The bottom line */}
        <div className="mt-16 rounded-xl border bg-muted/40 p-8">
          <h2 className="text-xl font-bold">The bottom line</h2>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            {comp.summary}
          </p>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold">
            Ready to try MyResumeCompany?
          </h2>
          <p className="mt-2 text-muted-foreground">
            Sign up free and get 100 credits. No credit card required.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/signup">
              <Button size="lg" className="gap-2 px-8">
                Get started free <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="px-8">
                View pricing
              </Button>
            </Link>
          </div>
        </div>

        {/* Related comparisons */}
        <div className="mt-16">
          <h2 className="text-lg font-semibold">Related comparisons</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {otherComparisons.map((other) => (
              <Link
                key={other.slug}
                href={`/compare/${other.slug}`}
                className="group rounded-xl border p-5 transition-colors hover:border-primary/40 hover:bg-muted/30"
              >
                <span className="font-medium group-hover:text-primary transition-colors">
                  MyResumeCompany vs {other.name}
                </span>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                  {other.description}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Last updated */}
        <p className="mt-12 text-center text-xs text-muted-foreground">
          Last updated: {comp.lastVerified}. Competitor pricing and features
          are verified periodically and may change. Visit each platform for the
          most current information.
        </p>
      </div>
    </>
  )
}

function FeatureValue({
  value,
  positive,
}: {
  value: boolean | string
  positive?: boolean
}) {
  if (typeof value === 'string') {
    return (
      <span className={positive ? 'font-medium text-green-600' : ''}>
        {value}
      </span>
    )
  }
  return value ? (
    <Check className="mx-auto h-4 w-4 text-green-500" />
  ) : (
    <X className="mx-auto h-4 w-4 text-muted-foreground/40" />
  )
}
