import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { JsonLd } from '@/components/schema/json-ld'
import { NewsletterSignup } from '@/components/marketing/newsletter-signup'

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://myresumecompany.canmero.com'

interface Article {
  title: string
  description: string
  category: string
  date: string
  content: React.ReactElement
}

const ARTICLES: Record<string, Article> = {
  'how-to-write-resume-bullet-points': {
    title: 'How to Write Resume Bullet Points That Get Interviews',
    description:
      'Learn the STAR method for writing achievement-focused bullet points with metrics. Stop writing "responsible for" and start writing results.',
    category: 'Resume Writing',
    date: '2026-02-24',
    content: (
      <>
        <p>
          The average recruiter spends 6 to 7 seconds scanning your resume. In that brief window,
          your bullet points are doing all the heavy lifting. Weak bullets that start with
          &quot;responsible for&quot; or &quot;assisted with&quot; blend into the hundreds of other
          resumes in the pile. Strong bullets that lead with action verbs and quantified results
          demand attention.
        </p>
        <p>
          This guide breaks down exactly how to write resume bullet points that make recruiters stop
          scrolling and start scheduling interviews.
        </p>

        <h2>Why Most Resume Bullet Points Fail</h2>
        <p>
          The biggest mistake job seekers make is describing their responsibilities instead of their
          accomplishments. Your job description already lists what you were supposed to do. Your
          resume should show what you actually achieved.
        </p>
        <p>Compare these two bullets:</p>
        <ul>
          <li>
            <strong>Weak:</strong> Responsible for managing social media accounts and creating
            content.
          </li>
          <li>
            <strong>Strong:</strong> Grew Instagram following from 2,000 to 15,000 in 6 months by
            launching a user-generated content campaign, increasing engagement rate by 340%.
          </li>
        </ul>
        <p>
          The second bullet tells a story: what you did, how you did it, and what happened as a
          result. That is the formula you need.
        </p>

        <h2>The STAR Method for Bullet Points</h2>
        <p>
          STAR stands for Situation, Task, Action, Result. While you do not need all four elements in
          every bullet, the framework ensures you are always tying your work to an outcome.
        </p>
        <p>A simplified version for bullet points follows this pattern:</p>
        <p>
          <strong>Action Verb + What You Did + How/Why + Measurable Result</strong>
        </p>
        <p>Examples across different roles:</p>
        <ul>
          <li>
            <strong>Sales:</strong> Exceeded quarterly quota by 127% ($1.2M in closed deals) by
            building a consultative outreach framework for enterprise accounts.
          </li>
          <li>
            <strong>Engineering:</strong> Reduced API response time by 65% by redesigning the caching
            layer, supporting 10,000 additional concurrent users.
          </li>
          <li>
            <strong>Marketing:</strong> Launched email nurture sequence that generated $280K in
            pipeline within 90 days, achieving a 4.2% conversion rate from MQL to SQL.
          </li>
          <li>
            <strong>Operations:</strong> Streamlined vendor onboarding process from 14 days to 3
            days, reducing procurement costs by 22% annually.
          </li>
        </ul>

        <h2>Power Verbs That Recruiters Notice</h2>
        <p>
          The first word of each bullet sets the tone. Avoid passive language like
          &quot;helped,&quot; &quot;worked on,&quot; or &quot;was part of.&quot; Instead, choose verbs
          that convey leadership and impact:
        </p>
        <ul>
          <li>
            <strong>For leadership:</strong> Spearheaded, Directed, Orchestrated, Championed
          </li>
          <li>
            <strong>For creation:</strong> Designed, Developed, Architected, Launched
          </li>
          <li>
            <strong>For improvement:</strong> Optimized, Streamlined, Revamped, Accelerated
          </li>
          <li>
            <strong>For revenue:</strong> Generated, Captured, Negotiated, Secured
          </li>
          <li>
            <strong>For analysis:</strong> Identified, Diagnosed, Evaluated, Forecasted
          </li>
        </ul>

        <h2>How to Add Metrics When You Think You Have None</h2>
        <p>
          &quot;But I do not have numbers&quot; is the most common objection, and it is almost never
          true. Here are ways to find metrics in any role:
        </p>
        <ul>
          <li>
            <strong>Team size:</strong> &quot;Managed a cross-functional team of 8&quot;
          </li>
          <li>
            <strong>Frequency:</strong> &quot;Processed 200+ customer requests weekly&quot;
          </li>
          <li>
            <strong>Time savings:</strong> &quot;Reduced report generation from 4 hours to 20
            minutes&quot;
          </li>
          <li>
            <strong>Scope:</strong> &quot;Oversaw $3.5M annual budget across 4 departments&quot;
          </li>
          <li>
            <strong>Percentages:</strong> &quot;Improved customer satisfaction scores by 18%&quot;
          </li>
        </ul>
        <p>
          If exact numbers are unavailable, use reasonable estimates. &quot;Approximately 30%&quot;
          is better than no number at all. Just be prepared to discuss your methodology in an
          interview.
        </p>

        <h2>How Many Bullet Points Per Job?</h2>
        <p>Follow this general rule:</p>
        <ul>
          <li>
            <strong>Current/most recent role:</strong> 4 to 6 bullets
          </li>
          <li>
            <strong>Previous roles:</strong> 3 to 4 bullets
          </li>
          <li>
            <strong>Older roles (5+ years):</strong> 2 to 3 bullets or a brief summary
          </li>
        </ul>
        <p>
          Quality beats quantity every time. Five exceptional bullets outperform ten mediocre ones.
          Each bullet should earn its place on the page.
        </p>

        <h2>Tailoring Bullets for ATS and Keywords</h2>
        <p>
          Applicant tracking systems scan your resume for keywords from the job description. After
          writing your achievement-focused bullets, cross-reference them with the posting. If the job
          mentions &quot;project management&quot; and you used &quot;coordinated projects,&quot;
          consider adjusting to include the exact phrase.
        </p>
        <p>
          Our{' '}
          <Link href="/blog/what-is-ats-and-how-to-beat-it" className="text-primary hover:underline">
            ATS guide
          </Link>{' '}
          covers this in detail, or you can use our built-in{' '}
          <Link href="/signup" className="text-primary hover:underline">
            ATS scanner
          </Link>{' '}
          to check your resume against any job description automatically.
        </p>

        <h2>Let AI Draft, Then Make It Yours</h2>
        <p>
          Writing bullet points from scratch is time-consuming. AI tools can generate a strong first
          draft in seconds, but the best results come from editing that draft with your specific
          details and voice. Our{' '}
          <Link href="/blog/ai-resume-builder-guide" className="text-primary hover:underline">
            AI resume builder guide
          </Link>{' '}
          explains how to use AI as a writing partner without sounding generic.
        </p>
        <p>
          MyResumeCompany&apos;s AI bullet point writer generates role-specific, metrics-driven
          bullets that you can customize before adding them to your resume. You choose which
          suggestions to keep, which to edit, and which to discard.
        </p>
      </>
    ),
  },

  'what-is-ats-and-how-to-beat-it': {
    title: 'What Is an ATS? How Applicant Tracking Systems Filter Your Resume',
    description:
      'Understand how ATS software works, why most resumes get rejected, and what you can do to get past the automated filters.',
    category: 'Job Search',
    date: '2026-03-03',
    content: (
      <>
        <p>
          Over 97% of Fortune 500 companies use an Applicant Tracking System (ATS) to manage their
          hiring process. If you have ever applied to a job online and heard nothing back, there is a
          good chance your resume was filtered out by software before a human ever saw it.
        </p>
        <p>
          Understanding how ATS software works is not optional in 2026. It is a fundamental job
          search skill. This guide explains the mechanics behind these systems and gives you
          actionable steps to get your resume through.
        </p>

        <h2>What Is an ATS?</h2>
        <p>
          An Applicant Tracking System is software that companies use to collect, sort, scan, and
          rank job applications. Popular systems include Workday, Greenhouse, Lever, iCIMS, and
          Taleo. When you submit your resume through a company&apos;s career portal, the ATS parses
          your document into structured data fields: name, contact info, work experience, education,
          and skills.
        </p>
        <p>
          Recruiters then search and filter this parsed data using keywords, years of experience,
          education level, location, and other criteria. If your resume does not parse correctly or
          lacks the right keywords, it never appears in the recruiter&apos;s search results.
        </p>

        <h2>How ATS Parsing Works</h2>
        <p>
          When you upload your resume, the ATS attempts to extract structured information from an
          unstructured document. This process is called parsing, and it is far from perfect. Common
          parsing failures include:
        </p>
        <ul>
          <li>
            <strong>Tables and columns:</strong> Many ATS parsers read left-to-right across columns,
            jumbling your content. A two-column layout can result in your job titles mixing with
            unrelated skill names.
          </li>
          <li>
            <strong>Headers and footers:</strong> Content in document headers or footers may be
            completely ignored.
          </li>
          <li>
            <strong>Images and graphics:</strong> Logos, headshots, icons, and graphical skill bars
            are invisible to ATS software.
          </li>
          <li>
            <strong>Unusual section headings:</strong> Creative headers like &quot;Where I&apos;ve
            Made an Impact&quot; instead of &quot;Work Experience&quot; can confuse the parser.
          </li>
          <li>
            <strong>Non-standard fonts:</strong> Uncommon fonts may cause character recognition
            errors.
          </li>
        </ul>

        <h2>The Keyword Matching System</h2>
        <p>
          After parsing, the ATS compares your resume content against the job description. This is
          where keyword matching becomes critical. There are two types of matching:
        </p>
        <ul>
          <li>
            <strong>Hard skills:</strong> Specific tools, technologies, and certifications mentioned
            in the job posting (e.g., &quot;Python,&quot; &quot;Salesforce,&quot; &quot;PMP
            certified&quot;).
          </li>
          <li>
            <strong>Soft skills and context:</strong> Industry terms and phrases that indicate
            relevant experience (e.g., &quot;stakeholder management,&quot; &quot;cross-functional
            collaboration&quot;).
          </li>
        </ul>
        <p>
          Modern ATS platforms use semantic matching, meaning &quot;project management&quot; and
          &quot;managed projects&quot; are often treated as equivalent. However, you should still
          include the exact phrasing from the job description when possible.
        </p>

        <h2>10 Rules for ATS-Friendly Resumes</h2>
        <ol>
          <li>
            <strong>Use a single-column layout.</strong> Avoid tables, text boxes, and multi-column
            designs.
          </li>
          <li>
            <strong>Use standard section headings.</strong> &quot;Work Experience,&quot;
            &quot;Education,&quot; &quot;Skills,&quot; &quot;Certifications.&quot;
          </li>
          <li>
            <strong>Submit as PDF unless told otherwise.</strong> PDF preserves formatting and parses
            well with modern ATS platforms.
          </li>
          <li>
            <strong>Include keywords naturally.</strong> Mirror the job description&apos;s language in
            your bullet points and skills section.
          </li>
          <li>
            <strong>Spell out acronyms once.</strong> Write &quot;Search Engine Optimization
            (SEO)&quot; so the ATS catches both forms.
          </li>
          <li>
            <strong>Use standard fonts.</strong> Arial, Calibri, Garamond, or Inter. Avoid decorative
            fonts.
          </li>
          <li>
            <strong>Skip graphics entirely.</strong> No icons, logos, photos, or skill bar charts.
          </li>
          <li>
            <strong>Put contact info in the body.</strong> Not in a header or footer element.
          </li>
          <li>
            <strong>Use consistent date formats.</strong> &quot;Jan 2024 - Present&quot; or
            &quot;01/2024 - Present&quot; throughout.
          </li>
          <li>
            <strong>Keep file names simple.</strong> &quot;Jane-Smith-Resume.pdf&quot; not
            &quot;final_v3_UPDATED.pdf&quot;.
          </li>
        </ol>

        <h2>How to Find the Right Keywords</h2>
        <p>
          The best source of keywords is the job description itself. Read it carefully and highlight:
        </p>
        <ul>
          <li>Required skills and qualifications</li>
          <li>Tools and technologies mentioned</li>
          <li>Industry-specific terms and phrases</li>
          <li>Repeated words or phrases (repetition signals importance)</li>
        </ul>
        <p>
          Then check that each keyword appears at least once in your resume, ideally in context
          within a bullet point rather than stuffed into a skills list.
        </p>

        <h2>Testing Your Resume Against an ATS</h2>
        <p>
          The best way to know if your resume will pass is to test it. MyResumeCompany includes a
          built-in{' '}
          <Link href="/signup" className="text-primary hover:underline">
            ATS scanner
          </Link>{' '}
          that analyzes your resume against a specific job description. It returns a compatibility
          score, identifies missing keywords, and highlights formatting issues that could cause
          parsing failures.
        </p>
        <p>
          You can also use our{' '}
          <Link href="/signup" className="text-primary hover:underline">
            ATS optimizer
          </Link>{' '}
          to automatically rewrite your bullet points to better match the job description while
          preserving your original achievements.
        </p>

        <h2>ATS-Optimized Templates</h2>
        <p>
          Choosing the right{' '}
          <Link href="/blog/best-resume-format-2026" className="text-primary hover:underline">
            resume format
          </Link>{' '}
          matters just as much as the content. Our{' '}
          <Link href="/resume-templates" className="text-primary hover:underline">
            template gallery
          </Link>{' '}
          includes dedicated ATS-optimized designs that are tested against major ATS platforms while
          still looking professional to human readers.
        </p>
      </>
    ),
  },

  'best-resume-format-2026': {
    title: 'The Best Resume Format in 2026: Chronological vs Functional vs Hybrid',
    description:
      'Which resume format should you use? Compare chronological, functional, and hybrid formats with pros, cons, and examples for each.',
    category: 'Resume Writing',
    date: '2026-03-07',
    content: (
      <>
        <p>
          Your resume format determines how recruiters read your career story. Choose the wrong
          format and your strongest qualifications get buried. Choose the right one and your
          experience speaks for itself within seconds.
        </p>
        <p>
          In 2026, three formats dominate: chronological, functional, and hybrid. Each serves a
          different purpose. Here is how to pick the one that works for your situation.
        </p>

        <h2>The Chronological Resume</h2>
        <p>
          The chronological format lists your work experience in reverse order, starting with your
          most recent position. It is the most widely used format and the one recruiters expect to
          see.
        </p>

        <h3>Structure</h3>
        <ol>
          <li>Contact information</li>
          <li>Professional summary</li>
          <li>Work experience (reverse chronological)</li>
          <li>Education</li>
          <li>Skills</li>
          <li>Optional sections (certifications, projects, etc.)</li>
        </ol>

        <h3>Best For</h3>
        <ul>
          <li>Candidates with a clear, progressive career path</li>
          <li>People staying in the same industry</li>
          <li>Anyone with no significant employment gaps</li>
          <li>ATS compatibility (this format parses most reliably)</li>
        </ul>

        <h3>Drawbacks</h3>
        <ul>
          <li>Highlights gaps in employment</li>
          <li>Less effective for career changers whose recent experience is unrelated</li>
          <li>Older experience at the bottom may be your most relevant</li>
        </ul>

        <h2>The Functional Resume</h2>
        <p>
          The functional format organizes your resume around skills and capabilities rather than job
          titles and dates. Work history is included but minimized, usually as a simple list of
          company names and dates at the bottom.
        </p>

        <h3>Structure</h3>
        <ol>
          <li>Contact information</li>
          <li>Professional summary</li>
          <li>Skills-based sections (e.g., &quot;Project Management,&quot; &quot;Data Analysis&quot;)
            with achievements grouped by skill</li>
          <li>Work history (minimal: company, title, dates)</li>
          <li>Education</li>
        </ol>

        <h3>Best For</h3>
        <ul>
          <li>Career changers pivoting to a new industry</li>
          <li>Candidates with significant employment gaps</li>
          <li>People with diverse freelance or contract experience</li>
        </ul>

        <h3>Drawbacks</h3>
        <ul>
          <li>
            Many recruiters dislike this format because it obscures career progression
          </li>
          <li>
            ATS software struggles to connect achievements to specific roles
          </li>
          <li>
            It can raise red flags, suggesting you are hiding something
          </li>
        </ul>
        <p>
          <strong>Our honest recommendation:</strong> Avoid the purely functional format unless you
          have a very specific reason to use it. Most recruiters view it with suspicion, and ATS
          parsers handle it poorly.
        </p>

        <h2>The Hybrid (Combination) Resume</h2>
        <p>
          The hybrid format combines the best of both worlds. It leads with a skills summary or key
          qualifications section, then follows with a full chronological work history. This gives you
          the keyword-rich skills section of a functional resume with the clear career timeline
          recruiters prefer.
        </p>

        <h3>Structure</h3>
        <ol>
          <li>Contact information</li>
          <li>Professional summary</li>
          <li>Key skills or core competencies (grouped by category)</li>
          <li>Work experience (reverse chronological with bullet points)</li>
          <li>Education</li>
          <li>Optional sections</li>
        </ol>

        <h3>Best For</h3>
        <ul>
          <li>Career changers who still have relevant transferable experience</li>
          <li>Senior professionals with broad skill sets</li>
          <li>Anyone who wants to front-load keywords for ATS while maintaining a clear timeline</li>
        </ul>

        <h3>Drawbacks</h3>
        <ul>
          <li>Can feel repetitive if skills section overlaps heavily with bullet points</li>
          <li>Takes more space, which can be an issue for one-page resumes</li>
        </ul>

        <h2>Which Format Should You Use in 2026?</h2>
        <p>For most people, the answer is straightforward:</p>
        <ul>
          <li>
            <strong>Chronological</strong> if you have a stable career history in your target field.
            This is the safe, default choice that works 80% of the time.
          </li>
          <li>
            <strong>Hybrid</strong> if you are changing careers, have 10+ years of experience, or
            want to emphasize skills for a technical role. This is the strongest format for senior
            candidates and career changers.
          </li>
          <li>
            <strong>Functional</strong> only as a last resort for extreme career pivots. Even then,
            consider a hybrid with a strong{' '}
            <Link href="/blog/resume-summary-vs-objective" className="text-primary hover:underline">
              professional summary
            </Link>{' '}
            instead.
          </li>
        </ul>

        <h2>Format and ATS Compatibility</h2>
        <p>
          From an{' '}
          <Link href="/blog/what-is-ats-and-how-to-beat-it" className="text-primary hover:underline">
            ATS perspective
          </Link>
          , chronological resumes parse most reliably because the structure matches what the software
          expects. Hybrid resumes also parse well as long as the work history section uses standard
          formatting. Functional resumes are the most problematic for ATS parsing.
        </p>

        <h2>Picking a Template That Matches Your Format</h2>
        <p>
          Your template should complement your chosen format. Our{' '}
          <Link href="/resume-templates" className="text-primary hover:underline">
            template gallery
          </Link>{' '}
          includes single-column designs optimized for chronological resumes, two-column layouts for
          hybrid formats, and ATS-specific templates for maximum compatibility. Each template handles
          all section types, so you can rearrange sections to match any format.
        </p>
        <p>
          Need help writing the content? Our{' '}
          <Link href="/blog/how-to-write-resume-bullet-points" className="text-primary hover:underline">
            bullet point guide
          </Link>{' '}
          walks you through crafting achievement-focused entries for any format.
        </p>
      </>
    ),
  },

  'ai-resume-builder-guide': {
    title: 'How to Use an AI Resume Builder Without Sounding Like a Robot',
    description:
      'AI can write your resume, but should it? Learn how to use AI as a writing partner while keeping your resume authentic and personal.',
    category: 'AI & Technology',
    date: '2026-03-12',
    content: (
      <>
        <p>
          AI resume builders have exploded in popularity, and for good reason. They can generate
          professional bullet points in seconds, suggest industry-specific keywords, and help you
          articulate achievements you struggle to put into words.
        </p>
        <p>
          But there is a growing problem: recruiters are getting better at spotting AI-generated
          resumes. Generic phrasing, buzzword soup, and suspiciously polished language can work
          against you. The key is using AI as a starting point, not the final product.
        </p>

        <h2>The Problem with Copy-Paste AI Content</h2>
        <p>
          When everyone uses the same AI tool with similar prompts, the output converges. Recruiters
          who review hundreds of resumes weekly start recognizing patterns: the same action verbs,
          the same sentence structures, the same vague claims about &quot;driving results&quot; and
          &quot;leveraging synergies.&quot;
        </p>
        <p>AI-generated content typically has these tells:</p>
        <ul>
          <li>
            <strong>Over-polished language:</strong> Every sentence sounds like it belongs in a
            Harvard Business Review article.
          </li>
          <li>
            <strong>Generic metrics:</strong> Vague percentages like &quot;increased efficiency by
            30%&quot; without specifics.
          </li>
          <li>
            <strong>Missing personality:</strong> No indication of the human behind the resume.
          </li>
          <li>
            <strong>Buzzword density:</strong> Too many industry terms crammed into every line.
          </li>
        </ul>

        <h2>The Right Way to Use AI for Your Resume</h2>
        <p>
          The best approach treats AI as a writing partner, not a ghostwriter. Here is a
          step-by-step workflow:
        </p>

        <h3>Step 1: Start with Your Raw Notes</h3>
        <p>
          Before touching any AI tool, write down your accomplishments in plain language. Do not
          worry about formatting or polish. Just answer these questions for each role:
        </p>
        <ul>
          <li>What problems did I solve?</li>
          <li>What did I build, launch, or improve?</li>
          <li>What numbers can I point to?</li>
          <li>What would my manager say was my biggest contribution?</li>
        </ul>

        <h3>Step 2: Use AI to Structure and Polish</h3>
        <p>
          Feed your raw notes into the AI tool. The AI is excellent at turning messy thoughts into
          structured, professional bullet points. It can suggest stronger action verbs, add missing
          context, and format your achievements consistently.
        </p>
        <p>
          At MyResumeCompany, our AI bullet point writer generates multiple options for each entry.
          You choose which suggestions to keep, edit, or discard. Nothing gets added to your resume
          without your explicit approval.
        </p>

        <h3>Step 3: Add Your Specific Details</h3>
        <p>
          This is the crucial step most people skip. After the AI generates a draft, go through each
          bullet and replace generic language with your specific details:
        </p>
        <ul>
          <li>Replace rounded percentages with exact numbers from your records</li>
          <li>Add the specific tools, technologies, or methodologies you used</li>
          <li>Include team sizes, budget amounts, or project timelines</li>
          <li>Mention specific clients, products, or initiatives by name (where appropriate)</li>
        </ul>

        <h3>Step 4: Read It Out Loud</h3>
        <p>
          If any bullet point sounds like something you would never say in a conversation, rewrite
          it. Your resume should sound like a more polished version of you, not a corporate press
          release. The &quot;read it aloud&quot; test catches most AI-sounding language immediately.
        </p>

        <h2>AI Features That Actually Help</h2>
        <p>
          Not all AI resume features are created equal. Here are the ones that provide real value
          versus gimmicks:
        </p>
        <ul>
          <li>
            <strong>Bullet point generation (high value):</strong> Turns rough notes into structured
            achievements. Save hours of writing time.
          </li>
          <li>
            <strong>ATS keyword optimization (high value):</strong> Compares your resume against a
            job description and identifies missing keywords. Read our{' '}
            <Link href="/blog/what-is-ats-and-how-to-beat-it" className="text-primary hover:underline">
              ATS guide
            </Link>{' '}
            to understand why this matters.
          </li>
          <li>
            <strong>Professional summary writing (medium value):</strong> Good for generating a first
            draft of your{' '}
            <Link href="/blog/resume-summary-vs-objective" className="text-primary hover:underline">
              professional summary
            </Link>
            , but always personalize it.
          </li>
          <li>
            <strong>Full resume generation (use with caution):</strong> Helpful for getting a
            starting structure, but requires significant editing to make it yours.
          </li>
          <li>
            <strong>Cover letter generation (medium value):</strong> Great for structure and tone, but
            add personal anecdotes and specific company research.
          </li>
        </ul>

        <h2>Red Flags to Watch For</h2>
        <p>After using AI, check your resume for these warning signs:</p>
        <ul>
          <li>Every bullet starts with a different fancy action verb (it looks forced)</li>
          <li>You cannot explain a claim in an interview</li>
          <li>The language is not consistent with your experience level</li>
          <li>Multiple bullets make the same point in different words</li>
          <li>The tone shifts dramatically between sections</li>
        </ul>

        <h2>The Bottom Line</h2>
        <p>
          AI resume builders are a tool, and like any tool, the result depends on how you use it. The
          job seekers who get the best results use AI to save time on formatting and structure, then
          invest that saved time into making every line specific, honest, and personal.
        </p>
        <p>
          MyResumeCompany is built on this philosophy. Our AI generates suggestions, but you always
          have final say. Every feature is designed to keep you in control of your career narrative.
        </p>
      </>
    ),
  },

  'resume-summary-vs-objective': {
    title: 'Resume Summary vs Objective: Which One Should You Use?',
    description:
      'Objective statements are dead. Learn how to write a professional summary that hooks recruiters in the first 6 seconds.',
    category: 'Resume Writing',
    date: '2026-03-18',
    content: (
      <>
        <p>
          The section at the top of your resume, right below your name, is the most valuable real
          estate on the entire document. Recruiters read it first, and for many, it determines
          whether they keep reading.
        </p>
        <p>
          For decades, job seekers used objective statements. Today, professional summaries have
          almost entirely replaced them. Here is why, and how to write one that makes an immediate
          impact.
        </p>

        <h2>What Is a Resume Objective?</h2>
        <p>
          A resume objective is a 1 to 2 sentence statement that describes what you want from the
          job. It typically reads like this:
        </p>
        <blockquote>
          &quot;Seeking a challenging position in marketing where I can utilize my skills and grow
          professionally.&quot;
        </blockquote>
        <p>The problems with this are obvious:</p>
        <ul>
          <li>It is about what you want, not what you offer</li>
          <li>It tells the recruiter nothing about your qualifications</li>
          <li>The phrase &quot;seeking a challenging position&quot; is on millions of resumes</li>
          <li>It wastes precious space at the top of your resume</li>
        </ul>

        <h2>What Is a Professional Summary?</h2>
        <p>
          A professional summary is a 2 to 4 sentence paragraph that highlights your most relevant
          experience, skills, and achievements for the specific role you are applying to. It answers
          the recruiter&apos;s first question: &quot;Why should I keep reading?&quot;
        </p>
        <p>Here is an example for a product manager:</p>
        <blockquote>
          &quot;Product Manager with 6 years of experience leading B2B SaaS products from concept to
          scale. Launched 3 products generating $4.2M in ARR. Expertise in data-driven
          prioritization, cross-functional team leadership, and enterprise customer discovery. Led a
          team of 12 across engineering, design, and QA.&quot;
        </blockquote>
        <p>
          Notice the difference. Every sentence communicates value. The recruiter immediately knows
          your experience level, your achievements, and your relevant skills.
        </p>

        <h2>When to Use an Objective (The Rare Exceptions)</h2>
        <p>
          Objectives are not completely dead. There are two scenarios where a modified objective makes
          sense:
        </p>
        <ul>
          <li>
            <strong>Career changers:</strong> When your work history does not obviously connect to the
            target role, a brief objective can bridge the gap. But frame it around value, not desire:
            &quot;Operations manager transitioning to product management, bringing 8 years of
            process optimization, cross-functional leadership, and data analysis experience.&quot;
          </li>
          <li>
            <strong>New graduates:</strong> With limited work experience, a targeted objective that
            references specific coursework, projects, or internships can work. But even here, a
            summary of skills and projects is usually stronger.
          </li>
        </ul>

        <h2>How to Write a Professional Summary in 4 Steps</h2>

        <h3>Step 1: Lead with Your Title and Experience Level</h3>
        <p>
          Start with who you are professionally. Include years of experience and your area of
          expertise.
        </p>
        <p>
          Example: &quot;Senior Data Engineer with 8 years of experience building scalable data
          pipelines for fintech companies.&quot;
        </p>

        <h3>Step 2: Add Your Biggest Achievement</h3>
        <p>
          One quantified accomplishment that demonstrates your impact. This is the hook that makes
          the recruiter want to read your{' '}
          <Link
            href="/blog/how-to-write-resume-bullet-points"
            className="text-primary hover:underline"
          >
            bullet points
          </Link>
          .
        </p>
        <p>
          Example: &quot;Architected a real-time processing system handling 2M+ events per second,
          reducing data latency by 94%.&quot;
        </p>

        <h3>Step 3: Include Relevant Skills or Specializations</h3>
        <p>
          Mention 2 to 3 core skills that match the job description. This helps with both{' '}
          <Link href="/blog/what-is-ats-and-how-to-beat-it" className="text-primary hover:underline">
            ATS keyword matching
          </Link>{' '}
          and recruiter scanning.
        </p>
        <p>
          Example: &quot;Expertise in Spark, Kafka, and dbt with a focus on data quality frameworks
          and cost optimization.&quot;
        </p>

        <h3>Step 4: End with Scope or Context</h3>
        <p>
          Add context that signals your level: team size, budget, company stage, or industry.
        </p>
        <p>
          Example: &quot;Currently leading a platform team of 6 supporting analytics for a Series C
          fintech processing $800M in annual transactions.&quot;
        </p>

        <h2>Common Summary Mistakes</h2>
        <ul>
          <li>
            <strong>Too long:</strong> More than 4 sentences and you lose the recruiter. This is a
            highlight reel, not your autobiography.
          </li>
          <li>
            <strong>First person pronouns:</strong> Do not write &quot;I am a&quot; or &quot;I
            have.&quot; Start directly with your title or a descriptor.
          </li>
          <li>
            <strong>Generic adjectives:</strong> &quot;Hard-working,&quot;
            &quot;detail-oriented,&quot; and &quot;passionate&quot; are filler. Replace them with
            evidence.
          </li>
          <li>
            <strong>Not tailored:</strong> A one-size-fits-all summary is barely better than an
            objective. Adjust your summary for each application, emphasizing the skills and
            achievements most relevant to the specific role.
          </li>
        </ul>

        <h2>Choosing the Right{' '}
          <Link href="/blog/best-resume-format-2026" className="text-primary hover:underline">
            Resume Format
          </Link>
        </h2>
        <p>
          Your summary works hand-in-hand with your resume format. In a chronological resume, the
          summary sets up the career progression that follows. In a hybrid format, it reinforces the
          skills section that comes next. Match them for maximum impact.
        </p>

        <h2>Let AI Help You Get Started</h2>
        <p>
          Staring at a blank summary field is daunting. MyResumeCompany&apos;s{' '}
          <Link href="/signup" className="text-primary hover:underline">
            AI summary writer
          </Link>{' '}
          generates three variants based on your experience: Confident, Balanced, and Technical. Pick
          the tone that fits your target role, customize it with your specific details, and you are
          done in minutes instead of hours.
        </p>
      </>
    ),
  },
}

function ArticleCTA() {
  return (
    <div className="mt-12 rounded-xl border bg-muted/40 p-8 text-center">
      <h2 className="text-2xl font-bold">Build Your Resume in Minutes</h2>
      <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
        MyResumeCompany gives you 50+ professional templates, AI-powered writing tools, and a
        built-in ATS scanner. Start free with 100 credits.
      </p>
      <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link href="/signup">
          <Button size="lg" className="gap-2">
            Get Started Free <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
        <Link href="/pricing">
          <Button variant="outline" size="lg">View Pricing</Button>
        </Link>
      </div>
    </div>
  )
}

export function generateStaticParams() {
  return Object.keys(ARTICLES).map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const article = ARTICLES[slug]
  if (!article) return {}

  return {
    title: article.title,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article',
      publishedTime: article.date,
      url: `${siteUrl}/blog/${slug}`,
      siteName: 'MyResumeCompany',
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
    },
    alternates: {
      canonical: `${siteUrl}/blog/${slug}`,
    },
  }
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article = ARTICLES[slug]

  if (!article) {
    notFound()
  }

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: article.title,
          description: article.description,
          image: `${siteUrl}/opengraph-image`,
          datePublished: article.date,
          dateModified: article.date,
          author: {
            '@type': 'Organization',
            '@id': `${siteUrl}/#organization`,
            name: 'MyResumeCompany',
            url: siteUrl,
          },
          publisher: {
            '@type': 'Organization',
            '@id': `${siteUrl}/#organization`,
            name: 'MyResumeCompany',
            url: siteUrl,
            logo: {
              '@type': 'ImageObject',
              url: `${siteUrl}/opengraph-image`,
            },
          },
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `${siteUrl}/blog/${slug}`,
          },
        }}
      />
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
              name: 'Blog',
              item: `${siteUrl}/blog`,
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: article.title,
              item: `${siteUrl}/blog/${slug}`,
            },
          ],
        }}
      />

      <article className="mx-auto max-w-3xl px-4 py-16 sm:py-24">
        <nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/blog" className="hover:text-foreground">
            Blog
          </Link>
          <span>/</span>
          <span className="truncate text-foreground">{article.title}</span>
        </nav>

        <header>
          <div className="flex items-center gap-3">
            <Badge variant="secondary">{article.category}</Badge>
            <time className="text-sm text-muted-foreground" dateTime={article.date}>
              {new Date(article.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{article.title}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{article.description}</p>
        </header>

        <div className="prose prose-neutral dark:prose-invert mt-10 max-w-none prose-headings:scroll-mt-20 prose-headings:font-semibold prose-h2:mt-10 prose-h2:text-2xl prose-h3:mt-6 prose-h3:text-xl prose-p:leading-7 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-li:leading-7 prose-blockquote:border-l-primary prose-blockquote:italic">
          {article.content}
        </div>

        <ArticleCTA />

        <div className="mt-10 rounded-xl border bg-muted/30 p-6">
          <NewsletterSignup source="blog" />
        </div>

        <nav className="mt-12 border-t pt-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            &larr; Back to all articles
          </Link>
        </nav>
      </article>
    </>
  )
}
