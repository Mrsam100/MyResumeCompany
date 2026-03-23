import { Star } from 'lucide-react'

const TESTIMONIALS = [
  {
    name: 'Sarah Chen',
    role: 'Software Engineer',
    company: 'Hired at Stripe',
    quote: 'I applied to 30 companies with my old resume and heard back from 2. After rebuilding with MyResumeCompany, I got 8 callbacks in one week. The ATS scanner showed me exactly what I was missing.',
    stars: 5,
  },
  {
    name: 'Marcus Johnson',
    role: 'Marketing Manager',
    company: 'Hired at HubSpot',
    quote: 'The AI bullet writer is incredible. I gave it my job title and it generated bullets better than what I spent 3 hours writing. The before/after difference was night and day.',
    stars: 5,
  },
  {
    name: 'Priya Patel',
    role: 'Recent Graduate',
    company: 'Hired at Deloitte',
    quote: 'As a new grad with no experience writing resumes, the wizard asked me 5 questions and built my entire resume. I just picked a template and exported. Got my first job offer within a month.',
    stars: 5,
  },
  {
    name: 'David Kim',
    role: 'Product Manager',
    company: 'Hired at Google',
    quote: 'The ATS optimizer rewrote my bullets to match the exact job description. My score went from 54 to 91. Got the interview call two days later. This tool literally paid for itself.',
    stars: 5,
  },
  {
    name: 'Emily Rodriguez',
    role: 'Registered Nurse',
    company: 'Hired at Mayo Clinic',
    quote: 'Healthcare resumes are tricky — you need the right certifications and keywords. The ATS scanner caught 6 missing keywords I never would have thought of. Landed my dream hospital job.',
    stars: 5,
  },
  {
    name: 'James Wright',
    role: 'Career Changer',
    company: 'Hired at Salesforce',
    quote: 'Switching from teaching to tech sales felt impossible. The functional resume format + AI bullets highlighted my transferable skills perfectly. Went from zero callbacks to 5 interviews.',
    stars: 5,
  },
  {
    name: 'Aisha Thompson',
    role: 'UX Designer',
    company: 'Hired at Figma',
    quote: 'I love the Creative Bold template — it stands out without being unprofessional. The color customization let me match my personal brand. Recruiters actually complimented my resume.',
    stars: 5,
  },
  {
    name: 'Michael Santos',
    role: 'Data Analyst',
    company: 'Hired at Netflix',
    quote: 'Spent 2 weeks writing my resume the old way. Then tried the AI wizard — it built a better version in 10 minutes. The cover letter generator saved me another hour per application.',
    stars: 5,
  },
  {
    name: 'Rachel Foster',
    role: 'Finance Associate',
    company: 'Hired at Goldman Sachs',
    quote: 'The Corporate template is exactly what finance recruiters expect — clean, traditional, no distractions. Combined with the ATS scanner, I was confident every application would get through.',
    stars: 5,
  },
  {
    name: 'Tom Nakamura',
    role: 'DevOps Engineer',
    company: 'Hired at AWS',
    quote: 'The Developer template with monospace accents is perfect for tech roles. AI generated bullets with actual metrics from my experience. Went from "managed servers" to quantified impact.',
    stars: 5,
  },
  {
    name: 'Lisa Park',
    role: 'Account Executive',
    company: 'Hired at Shopify',
    quote: 'I needed to tailor my resume for 15 different companies. The version history feature saved each one, and the ATS optimizer customized bullets for every job description. Game changer.',
    stars: 5,
  },
  {
    name: 'Chris Okafor',
    role: 'Recent MBA Graduate',
    company: 'Hired at McKinsey',
    quote: 'Consulting resumes have a specific format that most builders get wrong. The Consulting template nailed it — clean single column, action-driven bullets, exactly what top firms want to see.',
    stars: 5,
  },
]

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
      ))}
    </div>
  )
}

function TestimonialCard({ t }: { t: typeof TESTIMONIALS[number] }) {
  return (
    <div className="w-[320px] shrink-0 flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <Stars count={t.stars} />
      <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-slate-600">
        &ldquo;{t.quote}&rdquo;
      </blockquote>
      <div className="mt-5 border-t border-slate-100 pt-4">
        <p className="text-sm font-semibold text-slate-900">{t.name}</p>
        <p className="text-xs text-slate-500">{t.role} &middot; {t.company}</p>
      </div>
    </div>
  )
}

export function Testimonials() {
  // Split into two rows for visual density
  const row1 = TESTIMONIALS.slice(0, 6)
  const row2 = TESTIMONIALS.slice(6, 12)

  return (
    <div className="space-y-4 overflow-hidden">
      {/* Row 1 — scrolls left */}
      <div className="relative">
        <div className="flex gap-4 animate-marquee-left">
          {row1.map((t) => <TestimonialCard key={t.name} t={t} />)}
          {/* Duplicate for seamless loop */}
          {row1.map((t) => <TestimonialCard key={`${t.name}-dup`} t={t} />)}
        </div>
      </div>

      {/* Row 2 — scrolls right */}
      <div className="relative">
        <div className="flex gap-4 animate-marquee-right">
          {row2.map((t) => <TestimonialCard key={t.name} t={t} />)}
          {/* Duplicate for seamless loop */}
          {row2.map((t) => <TestimonialCard key={`${t.name}-dup`} t={t} />)}
        </div>
      </div>

      <style>{`
        @keyframes marquee-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-marquee-left {
          animation: marquee-left 40s linear infinite;
        }
        .animate-marquee-right {
          animation: marquee-right 40s linear infinite;
        }
        .animate-marquee-left:hover,
        .animate-marquee-right:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  )
}
