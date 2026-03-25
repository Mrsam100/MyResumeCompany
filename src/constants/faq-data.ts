export interface FAQItem {
  question: string
  answer: string
}

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: "Won't AI-written resumes sound fake?",
    answer: "The AI suggests — you edit. Every bullet is based on your actual experience, it just makes it sound better. Think writing partner, not ghostwriter. You stay in control of every word.",
  },
  {
    question: 'Is MyResumeCompany really free?',
    answer: "Yes. You get 100 free credits on signup — enough for a full AI-generated resume, ATS scan, and PDF export. Most people finish their resume without ever paying. Credit packs start at ₹299 if you need more.",
  },
  {
    question: 'What makes these templates ATS-compatible?',
    answer: "Every template generates clean, parseable text — no images for headers, no tables that confuse parsers, no fancy graphics that ATS can't read. We test all 50+ templates against real applicant tracking systems used by Fortune 500 companies.",
  },
  {
    question: 'What does the ATS scanner actually check?',
    answer: "It compares your resume against a specific job description. You get a 0-100 score based on keyword coverage, skills alignment, experience relevance, and format compatibility. It shows exactly which keywords you're missing and which ones you've matched.",
  },
  {
    question: "What about my data privacy?",
    answer: "Your resume data is yours. We don't sell it. We don't use it to train AI models. You can delete your account and every byte of data from Settings at any time. We use encryption in transit and at rest.",
  },
  {
    question: 'Do I need to pay for a subscription?',
    answer: "No. Free users pay credits per action. Pro users (₹799/month or ₹6,499/year) get unlimited AI usage and 500 bonus credits per month. Both plans have access to all 50+ templates and the full editor.",
  },
  {
    question: 'Can I export my resume as a Word document?',
    answer: "Yes. Export as PDF for visual perfection or DOCX for job boards that require Word format. Both formats are ATS-tested and preserve your formatting perfectly.",
  },
  {
    question: 'How is this different from Zety or Resume.io?',
    answer: "We offer a real ATS scanner that scores your resume 0-100 against specific job descriptions — not just generic tips. Our AI optimizer rewrites your bullets to match the job. And we're transparent about pricing: no hidden fees, no trial traps.",
  },
]

export function getFAQSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}
