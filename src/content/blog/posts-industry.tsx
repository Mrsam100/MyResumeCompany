import Link from 'next/link'
import type { BlogPost } from './posts-resume-writing'

export const industryPosts: BlogPost[] = [
  {
    slug: 'software-engineer-resume-guide',
    title: 'Software Engineer Resume Guide: What Top Tech Companies Actually Want',
    description:
      'Learn how to structure a software engineer resume that passes ATS filters and impresses hiring managers at FAANG and top tech companies. Covers projects, GitHub, technical skills, and more.',
    category: 'Industry Guides',
    date: '2026-03-22',
    content: (
      <>
        <p>
          The tech hiring market has changed dramatically over the past few years. Remote work expanded
          the applicant pool, layoffs reshuffled talent across the industry, and companies tightened
          their hiring bars. The result is that a generic resume no longer cuts it for software
          engineering roles. Whether you are targeting FAANG, a Series B startup, or an enterprise
          company, your resume needs to communicate technical depth, measurable impact, and
          problem-solving ability within a single page.
        </p>
        <p>
          This guide breaks down exactly what top tech companies look for in a software engineer resume,
          section by section, so you can present your experience in the strongest possible light.
        </p>

        <h2>The Ideal Structure for a Software Engineer Resume</h2>
        <p>
          Engineering hiring managers have told us the same thing repeatedly: they want to find
          relevant information fast. The standard structure that works across the industry is:
        </p>
        <ul>
          <li>
            <strong>Header:</strong> Name, email, phone, location (city/state is sufficient), LinkedIn,
            GitHub, and portfolio or personal website.
          </li>
          <li>
            <strong>Professional Summary:</strong> Two to three sentences highlighting your years of
            experience, primary tech stack, and most impressive achievement. Optional for new grads but
            recommended for anyone with 3+ years of experience.
          </li>
          <li>
            <strong>Technical Skills:</strong> Grouped by category (languages, frameworks, tools,
            cloud/infrastructure, databases).
          </li>
          <li>
            <strong>Experience:</strong> Reverse-chronological with achievement-focused bullet points.
          </li>
          <li>
            <strong>Projects:</strong> Open-source contributions, side projects, or notable internal
            projects not covered under experience.
          </li>
          <li>
            <strong>Education:</strong> Degree, school, graduation year. Keep it brief unless you are a
            recent graduate.
          </li>
        </ul>
        <p>
          For a deeper dive into choosing between chronological and other formats, see our guide on the{' '}
          <Link href="/blog/best-resume-format-2026" className="text-primary hover:underline">
            best resume format in 2026
          </Link>.
        </p>

        <h2>How to Write Your Technical Skills Section</h2>
        <p>
          The skills section on a software engineer resume serves two purposes: it helps ATS systems
          match your resume to the job posting, and it gives the hiring manager a quick snapshot of
          your technical breadth. Get this section wrong and your resume may never reach a human.
        </p>
        <p>Here is how to structure it effectively:</p>
        <ul>
          <li>
            <strong>Languages:</strong> List programming languages you can confidently use in a
            technical interview. Do not include languages you touched once in a tutorial. Example:
            TypeScript, Python, Go, Java, SQL.
          </li>
          <li>
            <strong>Frameworks and Libraries:</strong> React, Next.js, Node.js, Django, Spring Boot,
            Express, FastAPI, etc.
          </li>
          <li>
            <strong>Cloud and Infrastructure:</strong> AWS (EC2, S3, Lambda, ECS), GCP, Azure,
            Terraform, Docker, Kubernetes.
          </li>
          <li>
            <strong>Databases:</strong> PostgreSQL, MongoDB, Redis, DynamoDB, Elasticsearch.
          </li>
          <li>
            <strong>Tools and Practices:</strong> Git, CI/CD (GitHub Actions, Jenkins), Datadog,
            Grafana, Agile/Scrum.
          </li>
        </ul>
        <p>
          Do not use progress bars, star ratings, or percentage-based skill visualizations. They are
          meaningless to recruiters and actively harm ATS parsing. A flat, categorized list is the
          industry standard. For more on structuring this section, read our guide on{' '}
          <Link href="/blog/how-to-list-skills-on-resume" className="text-primary hover:underline">
            how to list skills on a resume
          </Link>.
        </p>

        <h2>Writing Experience Bullets That Demonstrate Engineering Impact</h2>
        <p>
          This is where most software engineer resumes fall short. Listing technologies you used is not
          enough. Hiring managers want to see the problems you solved, the decisions you made, and the
          outcomes you delivered. Every bullet should follow this pattern:
        </p>
        <p>
          <strong>Action Verb + What You Built/Did + Technical Context + Measurable Result</strong>
        </p>
        <p>Here are examples of strong engineering bullets:</p>
        <ul>
          <li>
            Redesigned the authentication microservice from monolithic session management to JWT-based
            stateless auth, reducing login latency by 74% and eliminating 3 single points of failure.
          </li>
          <li>
            Built a real-time data pipeline using Kafka and Flink that processed 2.5M events per day,
            enabling the analytics team to generate reports in minutes instead of hours.
          </li>
          <li>
            Led migration of legacy REST API to GraphQL, reducing frontend data-fetching code by 40%
            and improving page load times by 1.2 seconds across 12 customer-facing pages.
          </li>
          <li>
            Implemented comprehensive CI/CD pipeline with GitHub Actions, automated testing (92% code
            coverage), and blue-green deployments, reducing release cycles from biweekly to daily.
          </li>
        </ul>
        <p>
          Notice how each bullet names specific technologies, describes what was done, and quantifies
          the result. For more on writing strong bullets, read our{' '}
          <Link href="/blog/how-to-write-resume-bullet-points" className="text-primary hover:underline">
            bullet points guide
          </Link>.
        </p>

        <h2>The Projects Section: Your Secret Weapon</h2>
        <p>
          For software engineers, a projects section can be just as valuable as work experience,
          especially for those with fewer than five years in the industry. This section lets you
          demonstrate initiative, learning ability, and technical range beyond your day job.
        </p>
        <p>Each project entry should include:</p>
        <ul>
          <li>
            <strong>Project name and link:</strong> GitHub repo URL or live demo link.
          </li>
          <li>
            <strong>One-line description:</strong> What the project does, in plain language.
          </li>
          <li>
            <strong>Tech stack:</strong> The key technologies used.
          </li>
          <li>
            <strong>Impact or scope:</strong> Number of users, stars, downloads, or the problem it
            solves.
          </li>
        </ul>
        <p>
          A project that has real users, even a small number, is far more impressive than a todo app.
          Contributions to well-known open-source projects also carry significant weight at top
          companies.
        </p>

        <h2>GitHub and Portfolio: What Recruiters Actually Check</h2>
        <p>
          Including your GitHub profile is standard for software engineering resumes, but understand
          what recruiters and engineering managers actually look at. They are not reading every line of
          code. They check:
        </p>
        <ul>
          <li>
            <strong>Pinned repositories:</strong> Are your best projects front and center with clear
            README files?
          </li>
          <li>
            <strong>Contribution activity:</strong> Is there consistent activity, or did everything stop
            two years ago?
          </li>
          <li>
            <strong>Code quality:</strong> If they click into a repo, does the code look organized, well
            documented, and maintainable?
          </li>
          <li>
            <strong>Open-source contributions:</strong> PRs to reputable projects demonstrate you can
            work in existing codebases with established conventions.
          </li>
        </ul>
        <p>
          A personal portfolio site is optional but valuable, especially for frontend and full-stack
          engineers. It does not need to be elaborate. A clean page that lists your projects, links to
          your GitHub, and provides a downloadable resume is sufficient.
        </p>

        <h2>What FAANG and Top Tech Companies Specifically Look For</h2>
        <p>
          Each major tech company has its own hiring culture, but several patterns emerge consistently
          across Google, Amazon, Meta, Apple, Netflix, and similar-tier companies:
        </p>
        <ul>
          <li>
            <strong>Scale:</strong> They want to see that you have worked on systems handling high
            traffic, large datasets, or complex distributed architectures. If you have, quantify it.
          </li>
          <li>
            <strong>Ownership:</strong> Bullets that show you drove a project end-to-end, from design
            to deployment, carry more weight than those describing tasks within a larger team.
          </li>
          <li>
            <strong>Cross-functional collaboration:</strong> Mention working with product managers,
            designers, data scientists, or other engineering teams.
          </li>
          <li>
            <strong>Technical decision-making:</strong> Show that you evaluated tradeoffs and made
            architecture decisions, not just implemented tickets.
          </li>
          <li>
            <strong>Mentorship and leadership:</strong> For senior roles, bullets about mentoring junior
            engineers, leading design reviews, or defining team standards are essential.
          </li>
        </ul>

        <h2>Common Mistakes on Software Engineer Resumes</h2>
        <ul>
          <li>
            <strong>Listing every technology you have ever touched.</strong> Be selective. If you
            cannot pass a technical screen on it, leave it off.
          </li>
          <li>
            <strong>Two or more pages.</strong> Unless you have 15+ years of experience, one page is the
            standard. Conciseness is a skill, and your resume is the first place to demonstrate it.
          </li>
          <li>
            <strong>No metrics.</strong> &quot;Built a feature&quot; tells the reader nothing.
            &quot;Built a feature used by 50K daily active users&quot; tells a story.
          </li>
          <li>
            <strong>Ignoring ATS keywords.</strong> Read the job description carefully and mirror its
            terminology. If they say &quot;microservices,&quot; your resume should say
            &quot;microservices,&quot; not &quot;distributed services.&quot;
          </li>
          <li>
            <strong>Fancy designs with columns and graphics.</strong> Multi-column layouts and icons
            break ATS parsing. Use a clean, single-column format for tech roles.
          </li>
        </ul>

        <h2>Build Your Software Engineer Resume in Minutes</h2>
        <p>
          Structuring a tech resume that balances technical depth with readability is challenging.
          MyResumeCompany&apos;s{' '}
          <Link href="/signup" className="text-primary hover:underline">
            AI resume builder
          </Link>{' '}
          is built specifically for this. Choose from ATS-optimized templates designed for tech roles,
          use our AI bullet point writer to generate impact-driven descriptions of your engineering
          work, and run an ATS scan against any job description to make sure your resume matches what
          the company is looking for.
        </p>
        <p>
          Your code speaks for itself, but only if your resume gets you to the interview. Make sure it
          does.
        </p>
      </>
    ),
  },
  {
    slug: 'career-change-resume-guide',
    title: 'Career Change Resume: How to Pivot Industries Without Starting Over',
    description:
      'Switching careers? Learn how to write a resume that highlights transferable skills, reframes your experience, and convinces hiring managers you are the right fit for a new industry.',
    category: 'Career Advice',
    date: '2026-03-22',
    content: (
      <>
        <p>
          Changing careers is one of the most nerve-wracking professional decisions you can make. You
          have built experience, credibility, and expertise in one field, and now you want to start
          fresh in another. The biggest fear most career changers share is that their resume will
          scream &quot;unqualified.&quot; But here is the truth: you are not starting over. You are
          redirecting. The skills, achievements, and work ethic you built in your previous career are
          assets, not liabilities. The challenge is presenting them in a way that resonates with
          hiring managers in your target industry.
        </p>
        <p>
          This guide will show you exactly how to structure a career change resume that gets
          interviews, even when your work history does not line up perfectly with the job description.
        </p>

        <h2>Why Chronological Resumes Hurt Career Changers</h2>
        <p>
          The standard reverse-chronological resume format works well when your career tells a linear
          story: each role builds on the last, showing clear progression within an industry. For career
          changers, this format works against you because it highlights irrelevant job titles and draws
          attention to your lack of direct experience in the new field.
        </p>
        <p>
          Instead, consider a <strong>hybrid (combination) format</strong> that leads with a skills
          and achievements section before listing your work history. This lets you control the
          narrative by putting your transferable qualifications front and center.
        </p>
        <p>
          Our guide on the{' '}
          <Link href="/blog/best-resume-format-2026" className="text-primary hover:underline">
            best resume format in 2026
          </Link>{' '}
          compares chronological, functional, and hybrid formats in detail and explains when each is
          appropriate.
        </p>

        <h2>Identifying and Articulating Transferable Skills</h2>
        <p>
          Transferable skills are the foundation of every successful career change resume. These are
          competencies that apply across industries and roles. The mistake most people make is thinking
          too narrowly about their skills, defining themselves by industry-specific knowledge rather
          than the underlying capabilities they have developed.
        </p>
        <p>Here are categories of transferable skills with examples:</p>
        <ul>
          <li>
            <strong>Communication:</strong> Presenting to stakeholders, writing proposals, training
            team members, negotiating with vendors.
          </li>
          <li>
            <strong>Project Management:</strong> Planning timelines, managing budgets, coordinating
            cross-functional teams, tracking milestones.
          </li>
          <li>
            <strong>Data and Analysis:</strong> Interpreting metrics, building reports, making
            data-driven recommendations, forecasting trends.
          </li>
          <li>
            <strong>Leadership:</strong> Managing direct reports, mentoring junior staff, driving
            organizational change, resolving conflicts.
          </li>
          <li>
            <strong>Technical Proficiency:</strong> CRM systems, spreadsheet modeling, digital tools,
            process automation.
          </li>
          <li>
            <strong>Customer Focus:</strong> Handling client relationships, gathering feedback,
            improving satisfaction scores, understanding user needs.
          </li>
        </ul>
        <p>
          Go through each role you have held and extract these transferable skills. Then map them to
          the requirements listed in your target job descriptions. The overlap is larger than you
          think.
        </p>

        <h2>The Career Change Resume Structure</h2>
        <p>
          Here is the recommended structure for a career change resume, designed to lead with relevance
          and minimize attention on industry mismatch:
        </p>
        <ul>
          <li>
            <strong>Professional Summary (critical):</strong> This is the single most important section
            on a career change resume. Use it to bridge your past and your future. State the role you
            are targeting, highlight your most relevant transferable skills, and briefly explain how
            your background gives you a unique advantage.
          </li>
          <li>
            <strong>Core Competencies / Key Skills:</strong> A skills section that mirrors the language
            of your target job description. Use their exact terminology.
          </li>
          <li>
            <strong>Relevant Experience or Achievements:</strong> Pull bullet points from across your
            career that directly relate to the new role. These do not need to be organized by
            employer.
          </li>
          <li>
            <strong>Work History:</strong> Brief reverse-chronological listing with company, title,
            and dates. Keep bullets minimal here, especially for roles that are not relevant.
          </li>
          <li>
            <strong>Education and Certifications:</strong> Include any new certifications, courses, or
            credentials you have earned in preparation for the career change.
          </li>
        </ul>

        <h2>How to Reframe Your Experience for a New Industry</h2>
        <p>
          Reframing is the art of describing your existing experience using the language and priorities
          of your target industry. You are not lying or exaggerating. You are translating your work
          into terms that a hiring manager in a different field will understand and value.
        </p>
        <p>Here are before-and-after examples:</p>
        <ul>
          <li>
            <strong>Teacher pivoting to corporate training:</strong> Before: &quot;Taught 11th grade
            English to 120 students.&quot; After: &quot;Designed and delivered curriculum for 120+
            learners, achieving a 94% pass rate through differentiated instruction and ongoing
            assessment.&quot;
          </li>
          <li>
            <strong>Retail manager pivoting to operations:</strong> Before: &quot;Managed store with
            $2M in annual revenue.&quot; After: &quot;Oversaw P&amp;L for a $2M revenue center, managing
            inventory optimization, vendor relationships, and a team of 15 across scheduling and
            performance management.&quot;
          </li>
          <li>
            <strong>Military officer pivoting to project management:</strong> Before: &quot;Led a
            platoon of 40 soldiers.&quot; After: &quot;Directed a 40-person team through high-stakes
            operations with strict deadlines and zero-error tolerance, managing logistics, resource
            allocation, and cross-team coordination.&quot;
          </li>
        </ul>
        <p>
          Notice how each reframed version uses industry-neutral language and emphasizes results. Use
          strong{' '}
          <Link href="/blog/resume-action-verbs-list" className="text-primary hover:underline">
            action verbs
          </Link>{' '}
          that translate across industries: led, managed, developed, optimized, delivered, launched,
          coordinated.
        </p>

        <h2>Addressing the Elephant in the Room: Why Are You Switching?</h2>
        <p>
          Hiring managers will wonder why you are changing careers. Your resume should answer this
          question subtly through your professional summary and any new certifications or education
          you list. Your cover letter should address it directly.
        </p>
        <p>A strong career change cover letter accomplishes three things:</p>
        <ul>
          <li>
            <strong>Explains your motivation:</strong> Why this industry, and why now? Connect it to a
            genuine interest, not just dissatisfaction with your current field.
          </li>
          <li>
            <strong>Draws the bridge:</strong> Explicitly connect your past experience to the role
            requirements. Do not make the hiring manager guess how your teacher experience relates to
            their training coordinator position.
          </li>
          <li>
            <strong>Demonstrates commitment:</strong> Mention relevant courses, certifications,
            volunteer work, or freelance projects that show you have already started building
            expertise in the new field.
          </li>
        </ul>

        <h2>Building Credibility in Your New Field</h2>
        <p>
          If you are switching careers, the single best thing you can do for your resume is acquire
          tangible proof that you are serious about the new field. Here are concrete steps:
        </p>
        <ul>
          <li>
            <strong>Certifications:</strong> Google Project Management, HubSpot Inbound Marketing, AWS
            Cloud Practitioner, or whatever credential is respected in your target field.
          </li>
          <li>
            <strong>Freelance or volunteer work:</strong> Even one pro bono project in your new field
            gives you a real bullet point to add.
          </li>
          <li>
            <strong>Online courses:</strong> Coursera, LinkedIn Learning, or bootcamp certificates show
            investment in learning.
          </li>
          <li>
            <strong>Industry involvement:</strong> Attending meetups, joining professional
            associations, or writing articles about your new field.
          </li>
        </ul>
        <p>
          These entries fill the experience gap and signal to hiring managers that you are not applying
          on a whim. You have done the work.
        </p>

        <h2>Common Mistakes Career Changers Make</h2>
        <ul>
          <li>
            <strong>Using a one-size-fits-all resume.</strong> Every application should be tailored.
            The transferable skills you highlight for a marketing role differ from those for a project
            management role, even if you are drawing from the same work history.
          </li>
          <li>
            <strong>Apologizing for the career change.</strong> Phrases like &quot;although I lack
            direct experience&quot; undermine your candidacy. Focus on what you bring, not what you
            lack.
          </li>
          <li>
            <strong>Keeping your old resume format.</strong> A chronological resume optimized for your
            previous industry will not work. Restructure everything around the new target.
          </li>
          <li>
            <strong>Ignoring keywords.</strong> ATS systems do not care about your potential. They care
            about keyword matches. Study the job description and weave its language into your resume.
          </li>
        </ul>

        <h2>Start Your Career Change Resume Today</h2>
        <p>
          Pivoting industries is challenging, but your resume does not have to be the obstacle.
          MyResumeCompany&apos;s{' '}
          <Link href="/signup" className="text-primary hover:underline">
            AI-powered resume builder
          </Link>{' '}
          can help you reframe your experience for a new industry, identify your strongest
          transferable skills, and generate a professionally structured resume that puts your best
          foot forward. Our ATS scanner lets you test your resume against real job descriptions so
          you know exactly where you stand before you hit apply.
        </p>
        <p>
          Your next career is not a leap of faith. It is a strategic move, and it starts with the
          right resume.
        </p>
      </>
    ),
  },
  {
    slug: 'nursing-resume-guide',
    title: 'Nursing Resume Guide: Templates and Tips for RNs, LPNs, and New Grads',
    description:
      'Build a nursing resume that highlights clinical skills, certifications, and patient care experience. Includes tips for RNs, LPNs, and new nursing graduates entering the field.',
    category: 'Industry Guides',
    date: '2026-03-23',
    content: (
      <>
        <p>
          Nursing is one of the most in-demand professions in the world, but that does not mean
          getting hired is automatic. Hospitals and healthcare systems receive hundreds of applications
          for every open position, and many use applicant tracking systems to filter candidates before
          a human ever reads the resume. Whether you are an experienced RN looking to move to a new
          specialty, an LPN seeking advancement, or a new graduate applying for your first clinical
          position, your resume needs to clearly communicate your clinical competencies, certifications,
          and patient care philosophy.
        </p>
        <p>
          This guide covers everything you need to build a nursing resume that stands out to nurse
          managers, recruiters, and ATS software alike.
        </p>

        <h2>The Right Resume Structure for Nursing Professionals</h2>
        <p>
          Healthcare hiring managers look for specific information in a specific order. The standard
          nursing resume structure that works across specialties is:
        </p>
        <ul>
          <li>
            <strong>Header:</strong> Full name, credentials after your name (BSN, RN, CCRN), phone,
            email, city/state, LinkedIn (optional).
          </li>
          <li>
            <strong>Professional Summary:</strong> Two to three sentences highlighting years of
            experience, specialty, key clinical skills, and a notable achievement or certification.
          </li>
          <li>
            <strong>Licenses and Certifications:</strong> State license(s) with number and expiration,
            BLS, ACLS, PALS, specialty certifications.
          </li>
          <li>
            <strong>Clinical Experience:</strong> Reverse-chronological with facility name, unit type,
            bed count, and patient population.
          </li>
          <li>
            <strong>Education:</strong> Nursing degree, school, graduation date, honors.
          </li>
          <li>
            <strong>Additional Skills:</strong> EMR systems (Epic, Cerner, Meditech), languages,
            specialized equipment.
          </li>
        </ul>
        <p>
          Notice that licenses and certifications come before experience. In nursing, your credentials
          are a hard requirement. Putting them near the top ensures they are seen immediately and
          parsed by ATS systems.
        </p>

        <h2>How to Format Your Nursing Licenses and Certifications</h2>
        <p>
          This section is non-negotiable on a nursing resume. Format each entry clearly:
        </p>
        <ul>
          <li>
            <strong>Registered Nurse (RN)</strong> — State Board of Nursing, License #123456, Exp.
            06/2027
          </li>
          <li>
            <strong>Basic Life Support (BLS)</strong> — American Heart Association, Exp. 09/2026
          </li>
          <li>
            <strong>Advanced Cardiovascular Life Support (ACLS)</strong> — American Heart Association,
            Exp. 09/2026
          </li>
          <li>
            <strong>Critical Care Registered Nurse (CCRN)</strong> — AACN, Exp. 12/2027
          </li>
        </ul>
        <p>
          If you hold a compact/multistate license, note it explicitly. For travel nursing positions,
          list all active state licenses. Always include expiration dates so recruiters do not have to
          verify currency separately.
        </p>

        <h2>Writing Clinical Experience Bullets That Demonstrate Competency</h2>
        <p>
          Nursing bullets should demonstrate clinical judgment, patient outcomes, and scope of
          practice. The formula is the same as any industry (action verb + what you did + result), but
          the content should reflect healthcare-specific metrics and responsibilities.
        </p>
        <p>Here are strong nursing bullet point examples:</p>
        <ul>
          <li>
            Provided direct patient care for a 32-bed medical-surgical unit with 5:1 patient ratios,
            managing complex comorbidities including diabetes, CHF, and post-operative recovery.
          </li>
          <li>
            Reduced catheter-associated urinary tract infections (CAUTI) by 38% over 6 months by
            implementing evidence-based bundle protocols and championing compliance across a 12-nurse
            team.
          </li>
          <li>
            Triaged an average of 45 patients per shift in a Level I trauma center emergency
            department, prioritizing care using ESI acuity levels and collaborating with a
            multidisciplinary team of physicians, PAs, and respiratory therapists.
          </li>
          <li>
            Mentored 8 new graduate nurses through 12-week preceptorship rotations, achieving a 100%
            retention rate and contributing to unit onboarding program development.
          </li>
          <li>
            Administered and monitored IV chemotherapy regimens for oncology patients, managing adverse
            reactions and educating patients and families on treatment plans and side effect management.
          </li>
        </ul>
        <p>
          Notice the specificity: bed counts, patient ratios, acuity levels, percentage improvements,
          team sizes. These details give nurse managers a concrete picture of your capabilities. For
          more guidance on writing impactful bullets, see our{' '}
          <Link href="/blog/how-to-write-resume-bullet-points" className="text-primary hover:underline">
            bullet points guide
          </Link>.
        </p>

        <h2>Metrics That Matter in Nursing Resumes</h2>
        <p>
          Many nurses struggle to quantify their work, but healthcare is full of measurable outcomes.
          Here are metrics you should track and include:
        </p>
        <ul>
          <li>
            <strong>Patient ratios:</strong> 4:1, 6:1, 1:1 (ICU). This tells the manager your acuity
            comfort level.
          </li>
          <li>
            <strong>Bed count and unit type:</strong> 28-bed cardiac step-down, 40-bed med-surg, 16-bed
            NICU.
          </li>
          <li>
            <strong>Patient volume:</strong> Number of patients triaged per shift, admissions processed,
            discharges coordinated.
          </li>
          <li>
            <strong>Quality improvement outcomes:</strong> HCAHPS score improvements, fall rate
            reductions, infection rate decreases.
          </li>
          <li>
            <strong>Team size:</strong> Number of CNAs, LPNs, or new grads you supervised or mentored.
          </li>
          <li>
            <strong>Training:</strong> Number of preceptees, orientation programs developed, in-service
            presentations delivered.
          </li>
        </ul>

        <h2>New Graduate Nursing Resume Tips</h2>
        <p>
          If you are a new nursing graduate, you face the classic catch-22: you need experience to get
          hired, but you need to get hired to gain experience. Here is how to build a strong resume
          without years of clinical employment:
        </p>
        <ul>
          <li>
            <strong>Lead with your clinical rotations.</strong> Treat each rotation like a job entry.
            List the facility, unit, patient population, and specific skills practiced. Include hours
            completed.
          </li>
          <li>
            <strong>Highlight your capstone or practicum.</strong> This is your most substantial
            clinical experience. Describe your role, patient load, and any projects or presentations
            you completed.
          </li>
          <li>
            <strong>Include relevant coursework.</strong> Pharmacology, pathophysiology, health
            assessment, and evidence-based practice courses demonstrate your knowledge base.
          </li>
          <li>
            <strong>Add certifications immediately.</strong> If you have your BLS, ACLS, or any
            specialty certification, list it prominently. New grads with ACLS stand out for
            telemetry and ICU positions.
          </li>
          <li>
            <strong>Leverage non-clinical healthcare experience.</strong> CNA, medical assistant,
            volunteer, or patient transport roles all demonstrate comfort in clinical environments.
          </li>
          <li>
            <strong>Mention honors and organizations.</strong> Sigma Theta Tau membership, Dean&apos;s
            List, or clinical excellence awards add credibility.
          </li>
        </ul>

        <h2>EMR and Technical Skills for Nursing Resumes</h2>
        <p>
          Electronic medical record proficiency is essential in modern nursing. Include your EMR
          experience because many facilities filter candidates by system familiarity:
        </p>
        <ul>
          <li>
            <strong>Epic</strong> (most widely used in the US)
          </li>
          <li>
            <strong>Cerner</strong> (now Oracle Health)
          </li>
          <li>
            <strong>Meditech</strong>
          </li>
          <li>
            <strong>CPSI / TruBridge</strong>
          </li>
        </ul>
        <p>
          Also include proficiency with medication dispensing systems (Pyxis, Omnicell), telemetry
          monitoring, ventilator management, or any specialized equipment relevant to your unit. For
          a comprehensive approach to listing technical skills, refer to our{' '}
          <Link href="/blog/how-to-list-skills-on-resume" className="text-primary hover:underline">
            skills section guide
          </Link>.
        </p>

        <h2>Nursing Resume Mistakes to Avoid</h2>
        <ul>
          <li>
            <strong>Omitting credentials after your name.</strong> &quot;Jane Smith, BSN, RN,
            CCRN&quot; is the standard header format. Your credentials are your professional identity.
          </li>
          <li>
            <strong>Using vague descriptions.</strong> &quot;Provided excellent patient care&quot; says
            nothing. Specify what kind of care, to which population, and with what outcomes.
          </li>
          <li>
            <strong>Forgetting to list license numbers and expirations.</strong> Recruiters need to
            verify your credentials. Make it easy for them.
          </li>
          <li>
            <strong>Ignoring ATS keywords.</strong> If the posting says &quot;critical care
            experience,&quot; use that phrase verbatim on your resume.
          </li>
          <li>
            <strong>Going beyond two pages.</strong> One page for new grads, two pages maximum for
            experienced nurses. Hiring managers do not have time for more.
          </li>
        </ul>

        <h2>Build Your Nursing Resume With Confidence</h2>
        <p>
          Your clinical skills save lives. Your resume should reflect that level of competence and
          professionalism. MyResumeCompany&apos;s{' '}
          <Link href="/signup" className="text-primary hover:underline">
            resume builder
          </Link>{' '}
          includes ATS-optimized templates that format your credentials, licenses, and clinical
          experience exactly the way healthcare recruiters expect to see them. Our AI bullet writer
          helps you translate your patient care experience into achievement-focused language, and our
          ATS scanner checks your resume against specific job postings to make sure nothing is missed.
        </p>
        <p>
          You worked hard to earn your license. Make sure your resume works just as hard to land you
          the right position.
        </p>
      </>
    ),
  },
  {
    slug: 'marketing-resume-guide',
    title: 'Marketing Resume Guide: How to Showcase Campaigns, Metrics, and Creativity',
    description:
      'Learn how to build a marketing resume that balances creative accomplishments with hard metrics. Covers digital marketing, content, brand, and performance marketing roles.',
    category: 'Industry Guides',
    date: '2026-03-23',
    content: (
      <>
        <p>
          Marketing is one of the few professions where you are expected to sell yourself and be
          exceptional at it. Your resume is, quite literally, a marketing document about you. Yet
          many marketers submit resumes that would fail their own campaign standards: no clear value
          proposition, no measurable results, and no compelling call to action. The irony is painful,
          but the fix is straightforward.
        </p>
        <p>
          This guide covers how to build a marketing resume that showcases your campaign results,
          demonstrates your analytical capabilities, and still lets your creative instincts shine
          through.
        </p>

        <h2>What Marketing Hiring Managers Look For</h2>
        <p>
          Before diving into structure and formatting, understand what marketing leaders prioritize
          when reviewing resumes. Based on conversations with CMOs, VPs of Marketing, and hiring
          managers across B2B and B2C companies, the priorities are consistent:
        </p>
        <ul>
          <li>
            <strong>Metrics and ROI:</strong> Can you prove that your work drove measurable business
            outcomes? Revenue generated, leads captured, conversion rates improved, cost per
            acquisition reduced.
          </li>
          <li>
            <strong>Channel expertise:</strong> What channels have you owned? SEO, paid social, email,
            content, events, partnerships, product marketing? Be specific.
          </li>
          <li>
            <strong>Strategic thinking:</strong> Did you just execute campaigns, or did you develop
            strategy, identify target audiences, and choose channels based on data?
          </li>
          <li>
            <strong>Tool proficiency:</strong> Which marketing platforms, analytics tools, and
            automation systems do you know?
          </li>
          <li>
            <strong>Adaptability:</strong> Marketing changes fast. Evidence that you have learned new
            channels, adapted to algorithm changes, or pivoted strategy shows resilience.
          </li>
        </ul>

        <h2>The Optimal Marketing Resume Structure</h2>
        <p>
          For most marketing professionals, a reverse-chronological format works best because career
          progression matters in this field. Here is the recommended structure:
        </p>
        <ul>
          <li>
            <strong>Header:</strong> Name, email, phone, LinkedIn, portfolio link (if applicable).
          </li>
          <li>
            <strong>Professional Summary:</strong> Two to three sentences that state your specialty
            (growth marketing, brand, content, demand gen), years of experience, and your most
            impressive metric.
          </li>
          <li>
            <strong>Experience:</strong> Reverse-chronological. Each role should include campaign
            highlights and quantified results.
          </li>
          <li>
            <strong>Key Skills and Tools:</strong> Organized by category: channels, platforms, analytics,
            creative tools.
          </li>
          <li>
            <strong>Education and Certifications:</strong> Degree plus any relevant certifications
            (Google Ads, HubSpot, Meta Blueprint, Google Analytics).
          </li>
          <li>
            <strong>Portfolio or Campaign Highlights (optional):</strong> A brief section with links to
            notable campaigns, published content, or case studies.
          </li>
        </ul>
        <p>
          For more on choosing the right format for your situation, see our{' '}
          <Link href="/blog/best-resume-format-2026" className="text-primary hover:underline">
            resume format guide
          </Link>.
        </p>

        <h2>Writing Campaign-Driven Bullet Points</h2>
        <p>
          Marketing resumes live and die by the quality of their bullet points. Every bullet should
          answer: &quot;What did you do, and what was the business impact?&quot; Here are examples
          that work:
        </p>
        <ul>
          <li>
            Developed and executed a multi-channel product launch campaign (email, paid social,
            influencer) that generated $1.4M in first-quarter revenue and 12,000 new customers,
            exceeding targets by 40%.
          </li>
          <li>
            Grew organic blog traffic from 15,000 to 120,000 monthly sessions over 18 months through
            SEO content strategy, increasing marketing-sourced pipeline by $2.8M annually.
          </li>
          <li>
            Managed a $500K annual paid media budget across Google Ads, Meta, and LinkedIn, achieving a
            blended ROAS of 5.2x while reducing cost per lead by 34% through audience segmentation and
            creative testing.
          </li>
          <li>
            Built and optimized an email nurture program with 14 automated sequences, increasing MQL to
            SQL conversion by 28% and contributing $680K in attributed pipeline per quarter.
          </li>
          <li>
            Led a brand refresh initiative including new visual identity, messaging framework, and
            brand guidelines, resulting in a 22% increase in aided brand awareness measured via
            quarterly survey.
          </li>
        </ul>
        <p>
          Every bullet includes the channel, the action taken, and the quantified outcome. Use strong{' '}
          <Link href="/blog/resume-action-verbs-list" className="text-primary hover:underline">
            action verbs
          </Link>{' '}
          like launched, optimized, scaled, developed, and managed. For more on structuring effective
          bullets, read our{' '}
          <Link href="/blog/how-to-write-resume-bullet-points" className="text-primary hover:underline">
            bullet points guide
          </Link>.
        </p>

        <h2>Digital Marketing vs. Traditional Marketing: Tailoring Your Resume</h2>
        <p>
          The skills you emphasize should match the type of marketing role you are targeting:
        </p>
        <ul>
          <li>
            <strong>Digital / Growth / Performance Marketing:</strong> Emphasize CAC, LTV, ROAS,
            conversion rates, A/B testing results, attribution modeling, and funnel optimization.
            Highlight tools like Google Analytics 4, Mixpanel, Segment, and ad platform expertise.
          </li>
          <li>
            <strong>Content Marketing:</strong> Emphasize traffic growth, engagement metrics, content
            production volume, SEO rankings, and audience growth. Highlight CMS platforms, SEO tools
            (Ahrefs, SEMrush), and editorial calendar management.
          </li>
          <li>
            <strong>Brand Marketing:</strong> Emphasize awareness metrics, campaign reach and
            impressions, brand sentiment, creative direction, and agency management. Highlight brand
            tracking tools, creative suites, and event marketing experience.
          </li>
          <li>
            <strong>Product Marketing:</strong> Emphasize launch outcomes, sales enablement materials
            created, competitive analysis, win/loss rates, and positioning frameworks. Highlight
            cross-functional collaboration with product and sales teams.
          </li>
        </ul>

        <h2>Marketing Tools to Highlight on Your Resume</h2>
        <p>
          Tool proficiency is a major differentiator in marketing hiring. Include a dedicated skills
          section organized by category:
        </p>
        <ul>
          <li>
            <strong>Analytics:</strong> Google Analytics 4, Mixpanel, Amplitude, Looker, Tableau,
            HubSpot Analytics.
          </li>
          <li>
            <strong>Advertising:</strong> Google Ads, Meta Ads Manager, LinkedIn Campaign Manager,
            TikTok Ads, programmatic platforms (The Trade Desk, DV360).
          </li>
          <li>
            <strong>Marketing Automation:</strong> HubSpot, Marketo, Pardot, Klaviyo, ActiveCampaign,
            Iterable.
          </li>
          <li>
            <strong>SEO:</strong> Ahrefs, SEMrush, Moz, Screaming Frog, Google Search Console.
          </li>
          <li>
            <strong>Creative:</strong> Adobe Creative Suite, Figma, Canva. Include if relevant to the
            role.
          </li>
          <li>
            <strong>CMS:</strong> WordPress, Webflow, Contentful, Shopify.
          </li>
          <li>
            <strong>Project Management:</strong> Asana, Monday.com, Notion, Jira.
          </li>
        </ul>
        <p>
          For tips on organizing this section for maximum ATS compatibility, check our guide on{' '}
          <Link href="/blog/how-to-list-skills-on-resume" className="text-primary hover:underline">
            how to list skills on a resume
          </Link>.
        </p>

        <h2>Should You Include a Portfolio Link?</h2>
        <p>
          For many marketing roles, the answer is yes. A portfolio link lets you show work that a
          resume cannot fully capture: campaign creative, published articles, case studies, video
          content, or brand guidelines you developed. Include the link in your header next to your
          LinkedIn.
        </p>
        <p>
          If you do not have a dedicated portfolio site, a well-organized Google Drive folder or a
          LinkedIn featured section can serve the same purpose. The key is that the work is easy to
          access and clearly presented.
        </p>

        <h2>Creative Formatting: Where to Draw the Line</h2>
        <p>
          Marketers are often tempted to use heavily designed resumes with color blocks, infographics,
          and creative layouts. Here is the guidance:
        </p>
        <ul>
          <li>
            <strong>For ATS-screened applications (most corporate roles):</strong> Use a clean,
            single-column layout. Creativity in formatting can break ATS parsing and get your resume
            rejected before anyone sees it.
          </li>
          <li>
            <strong>For agency, startup, or design-adjacent roles:</strong> A subtle use of color,
            a well-chosen font, and clean visual hierarchy can differentiate you. But always keep a
            plain-text version ready.
          </li>
          <li>
            <strong>Portfolio is where creativity lives.</strong> Let your resume be professional and
            scannable. Let your portfolio be where you show off creative range.
          </li>
        </ul>

        <h2>Common Marketing Resume Mistakes</h2>
        <ul>
          <li>
            <strong>No metrics.</strong> A marketing resume without numbers is like a campaign without
            KPIs. If you cannot quantify it, estimate it. &quot;Approximately 3x ROAS&quot; is better
            than nothing.
          </li>
          <li>
            <strong>Listing channels without results.</strong> &quot;Managed social media&quot; tells
            the reader nothing. &quot;Grew LinkedIn followers from 5K to 28K and increased engagement
            rate by 180%&quot; tells a story.
          </li>
          <li>
            <strong>Ignoring the job description.</strong> Each application should be tailored. Mirror
            the language and priorities of the specific posting.
          </li>
          <li>
            <strong>Burying certifications.</strong> Google Ads, HubSpot, and Meta certifications are
            valuable signals. Make them visible.
          </li>
        </ul>

        <h2>Create a Marketing Resume That Markets You</h2>
        <p>
          You know how to position products. Now position yourself. MyResumeCompany&apos;s{' '}
          <Link href="/signup" className="text-primary hover:underline">
            AI resume builder
          </Link>{' '}
          helps you craft campaign-driven bullet points with real metrics, choose from professionally
          designed templates that balance style with ATS compatibility, and scan your resume against
          specific job descriptions to optimize your keyword match rate.
        </p>
        <p>
          Your next campaign is your career. Make it convert.
        </p>
      </>
    ),
  },
  {
    slug: 'recent-graduate-resume-guide',
    title: 'Recent Graduate Resume: How to Land Your First Job With Zero Work Experience',
    description:
      'No work experience? No problem. Learn how to build a compelling resume as a recent graduate using education, internships, projects, and extracurriculars to land your first professional role.',
    category: 'Career Advice',
    date: '2026-03-24',
    content: (
      <>
        <p>
          You just walked across a stage, diploma in hand, and now the job market is asking for three
          to five years of experience for &quot;entry-level&quot; positions. It is the most frustrating
          paradox in hiring: you cannot get experience without a job, and you cannot get a job without
          experience. But here is what most new graduates do not realize: you have more relevant
          experience than you think. You just have not learned how to present it yet.
        </p>
        <p>
          This guide will show you how to build a resume that competes with experienced candidates by
          strategically showcasing your education, projects, internships, leadership, and skills. No
          fluff, no filler, just a real strategy that works.
        </p>

        <h2>The Education-First Resume Layout</h2>
        <p>
          For recent graduates, education moves to the top of the resume, directly below your
          professional summary. Once you have two or more years of professional experience, work
          history takes the top position. But right now, your degree is your strongest credential.
        </p>
        <p>Here is the recommended structure for a recent graduate resume:</p>
        <ul>
          <li>
            <strong>Header:</strong> Name, email, phone, LinkedIn, portfolio or GitHub (if relevant).
          </li>
          <li>
            <strong>Professional Summary or Objective:</strong> Two to three sentences positioning you
            for the specific type of role you are targeting.
          </li>
          <li>
            <strong>Education:</strong> Degree, school, graduation date, GPA (if strong), relevant
            coursework, honors, and academic achievements.
          </li>
          <li>
            <strong>Experience:</strong> Internships, part-time jobs, research assistantships, or
            teaching assistantships.
          </li>
          <li>
            <strong>Projects:</strong> Academic projects, capstone work, freelance work, or personal
            projects.
          </li>
          <li>
            <strong>Skills:</strong> Technical skills, tools, languages, and relevant software.
          </li>
          <li>
            <strong>Activities and Leadership:</strong> Student organizations, volunteer work, athletics,
            or relevant extracurriculars.
          </li>
        </ul>
        <p>
          This structure ensures that your most competitive assets appear first. For a comparison
          of different format options, read our guide on the{' '}
          <Link href="/blog/best-resume-format-2026" className="text-primary hover:underline">
            best resume format in 2026
          </Link>.
        </p>

        <h2>How to Write Your Education Section (It Is More Than School and Degree)</h2>
        <p>
          Most graduates list their school, degree, and graduation date, then move on. That is a
          missed opportunity. Your education section should be a detailed showcase of your academic
          accomplishments:
        </p>
        <ul>
          <li>
            <strong>Relevant coursework:</strong> List four to six courses directly related to the job
            you are applying for. A marketing graduate applying for a digital marketing role should
            list courses like Digital Marketing Strategy, Consumer Behavior, Marketing Analytics, and
            Social Media Marketing.
          </li>
          <li>
            <strong>Academic honors:</strong> Dean&apos;s List (specify semesters), Magna Cum Laude,
            departmental awards, scholarships.
          </li>
          <li>
            <strong>Thesis or capstone:</strong> If your senior project is relevant to your target
            industry, describe it in one to two bullet points with outcomes or findings.
          </li>
          <li>
            <strong>Study abroad:</strong> Demonstrates adaptability and global perspective. Include
            it if relevant.
          </li>
        </ul>

        <h2>The GPA Question: When to Include It and When to Leave It Off</h2>
        <p>
          The GPA debate is one of the most common questions we hear from recent graduates. Here are
          the guidelines:
        </p>
        <ul>
          <li>
            <strong>Include your GPA if it is 3.5 or above.</strong> This is a clear signal of
            academic excellence and will never hurt you.
          </li>
          <li>
            <strong>Include it if it is 3.0 to 3.4 and the job posting mentions GPA requirements.</strong>{' '}
            Many finance, consulting, and engineering firms have minimum GPA thresholds.
          </li>
          <li>
            <strong>Leave it off if it is below 3.0.</strong> Omitting a GPA is common and not a red
            flag. No one will assume the worst; they will simply evaluate you on other merits.
          </li>
          <li>
            <strong>Use your major GPA if it is significantly higher than your cumulative GPA.</strong>{' '}
            Label it clearly: &quot;Major GPA: 3.7/4.0.&quot;
          </li>
        </ul>
        <p>
          After your first one to two years of work experience, remove the GPA entirely. It becomes
          irrelevant once you have professional accomplishments to show.
        </p>

        <h2>Turning Internships Into Powerful Resume Entries</h2>
        <p>
          Internships are the closest thing to professional experience that most graduates have, and
          hiring managers know it. Treat every internship as a full job entry with detailed,
          accomplishment-focused bullet points.
        </p>
        <p>Compare these approaches:</p>
        <ul>
          <li>
            <strong>Weak:</strong> &quot;Assisted the marketing team with various projects and social
            media tasks.&quot;
          </li>
          <li>
            <strong>Strong:</strong> &quot;Created and scheduled 60+ social media posts across
            Instagram and LinkedIn during a 10-week internship, contributing to a 15% increase in
            follower engagement and earning a full-time offer.&quot;
          </li>
        </ul>
        <p>
          The strong version specifies the volume of work, the platforms, the timeframe, and the
          outcome. Even short internships have quantifiable results if you think about them carefully.
          For more on writing impactful bullet points, see our{' '}
          <Link href="/blog/how-to-write-resume-bullet-points" className="text-primary hover:underline">
            bullet points guide
          </Link>.
        </p>

        <h2>How to Showcase Projects When You Lack Work Experience</h2>
        <p>
          Projects are the great equalizer for new graduates. A well-executed academic or personal
          project can demonstrate the same skills an employer would see in a junior hire. Here is how
          to present them:
        </p>
        <ul>
          <li>
            <strong>Give each project a clear title.</strong> &quot;Capstone Project: Customer Churn
            Prediction Model&quot; is stronger than &quot;Senior Project.&quot;
          </li>
          <li>
            <strong>Describe what you built and why.</strong> One sentence explaining the project&apos;s
            purpose or the problem it solved.
          </li>
          <li>
            <strong>Specify your role and tools.</strong> &quot;Built using Python, scikit-learn, and
            Tableau. Led a team of 4 students.&quot;
          </li>
          <li>
            <strong>Include outcomes.</strong> Grades earned, presentations given, competitions won, or
            real-world impact if the project was for an external client.
          </li>
        </ul>
        <p>Examples of strong project entries:</p>
        <ul>
          <li>
            <strong>E-Commerce Recommendation Engine:</strong> Developed a collaborative filtering
            recommendation system using Python and TensorFlow that achieved 89% accuracy on a test
            dataset of 50,000 user interactions. Presented findings to a panel of industry judges
            and received Best Technical Project award.
          </li>
          <li>
            <strong>Nonprofit Website Redesign:</strong> Led a 3-person team in redesigning the
            website for a local food bank using WordPress, increasing online donation submissions by
            45% within the first month of launch.
          </li>
        </ul>

        <h2>Making Extracurriculars and Leadership Count</h2>
        <p>
          Student organizations, volunteer work, athletics, and campus leadership roles can all
          strengthen a graduate resume if presented correctly. The key is to describe these
          experiences the same way you would describe a job: with specific responsibilities, actions
          taken, and results achieved.
        </p>
        <ul>
          <li>
            <strong>Student Government, Treasurer:</strong> Managed a $45,000 annual budget across 12
            student organizations, implemented a new reimbursement tracking system that reduced
            processing time by 60%.
          </li>
          <li>
            <strong>Volunteer Tutor, Community Literacy Program:</strong> Tutored 8 adult learners in
            English literacy for 6 months, with 6 of 8 students advancing to the next proficiency
            level.
          </li>
          <li>
            <strong>Captain, Varsity Soccer:</strong> Led a 28-member team through a conference
            championship season, coordinated team logistics, and organized community service events
            that raised $3,200 for local youth sports programs.
          </li>
        </ul>
        <p>
          Notice that each entry includes numbers. Team size, budget, time commitment, and measurable
          outcomes transform generic activities into compelling resume content.
        </p>

        <h2>Writing a Professional Summary as a New Graduate</h2>
        <p>
          A professional summary replaces the outdated &quot;objective statement&quot; and gives you a
          chance to frame your candidacy in two to three sentences. For graduates, this section should
          accomplish three things: state your degree and area of focus, highlight one to two key
          strengths or experiences, and signal the type of role you are pursuing.
        </p>
        <p>Example:</p>
        <p>
          <strong>
            &quot;Recent Finance graduate from the University of Michigan with hands-on experience in
            financial modeling, equity research, and data analysis through internships at two regional
            investment firms. Built a stock screening tool using Python that identified undervalued
            equities with 78% historical accuracy. Seeking an entry-level analyst role in asset
            management or equity research.&quot;
          </strong>
        </p>
        <p>
          This summary is specific, quantified, and clearly targeted. Avoid generic summaries like
          &quot;motivated recent graduate seeking an opportunity to grow.&quot; Every graduate is
          motivated. Tell the hiring manager what makes you different.
        </p>

        <h2>Skills Section Strategy for New Graduates</h2>
        <p>
          Your skills section needs to be tailored to each application. Read the job description and
          include every skill they mention that you genuinely possess. Common categories for
          graduates:
        </p>
        <ul>
          <li>
            <strong>Technical:</strong> Programming languages, data tools, design software, or
            industry-specific platforms.
          </li>
          <li>
            <strong>Analytical:</strong> Financial modeling, statistical analysis, market research,
            data visualization.
          </li>
          <li>
            <strong>Communication:</strong> Public speaking, technical writing, client presentations.
          </li>
          <li>
            <strong>Languages:</strong> Bilingual or multilingual abilities are valuable across
            industries.
          </li>
        </ul>
        <p>
          For detailed guidance on structuring this section, see our{' '}
          <Link href="/blog/how-to-list-skills-on-resume" className="text-primary hover:underline">
            skills section guide
          </Link>.
        </p>

        <h2>Common Mistakes New Graduates Make</h2>
        <ul>
          <li>
            <strong>Listing every job you have ever held.</strong> Your barista job from sophomore year
            does not belong on a resume targeting financial analyst positions, unless you can reframe
            it meaningfully (customer service, cash handling, high-volume operations).
          </li>
          <li>
            <strong>Using an objective statement instead of a summary.</strong> &quot;Seeking an
            entry-level position where I can utilize my skills&quot; wastes precious space.
          </li>
          <li>
            <strong>Exceeding one page.</strong> As a new graduate, your resume should be exactly one
            page. No exceptions. If it spills over, cut the weakest content.
          </li>
          <li>
            <strong>Sending the same resume everywhere.</strong> Tailor your summary, skills, and
            bullet emphasis for each role. A generic resume gets generic results.
          </li>
          <li>
            <strong>Neglecting formatting.</strong> Inconsistent fonts, uneven spacing, or creative
            layouts that break ATS parsing. Use a clean, professional template.
          </li>
        </ul>

        <h2>Build Your First Professional Resume Today</h2>
        <p>
          Starting your career is exciting, and your resume should reflect the energy and preparation
          you bring to the table. MyResumeCompany&apos;s{' '}
          <Link href="/signup" className="text-primary hover:underline">
            AI resume builder
          </Link>{' '}
          is designed to help new graduates turn limited experience into a compelling one-page resume.
          Our AI can generate achievement-focused bullet points from your internships and projects,
          suggest skills based on your target role, and scan your resume against real job postings
          to maximize your keyword match rate.
        </p>
        <p>
          You have spent years building knowledge and skills. Now build the resume that opens the
          door to your first opportunity.
        </p>
      </>
    ),
  },
]
