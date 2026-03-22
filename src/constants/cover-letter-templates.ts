export interface CoverLetterTemplate {
  id: string
  name: string
  category: 'general' | 'career-change' | 'entry-level' | 'executive' | 'creative' | 'technical' | 'follow-up' | 'referral'
  description: string
  content: string
}

export const COVER_LETTER_TEMPLATES: CoverLetterTemplate[] = [
  // General
  {
    id: 'standard-professional',
    name: 'Standard Professional',
    category: 'general',
    description: 'Classic professional cover letter suitable for most industries',
    content: `Dear Hiring Manager,

I am writing to express my strong interest in the [Job Title] position at [Company Name]. With [X years] of experience in [industry/field], I am confident that my skills and accomplishments make me an excellent candidate for this role.

In my current role at [Current Company], I have [key achievement 1]. Additionally, I [key achievement 2], which resulted in [measurable outcome]. These experiences have equipped me with [relevant skills] that directly align with the requirements of this position.

What particularly excites me about [Company Name] is [specific reason - company mission, product, culture]. I believe my background in [relevant area] would allow me to contribute meaningfully to your team's goals.

I would welcome the opportunity to discuss how my experience and skills can benefit [Company Name]. Thank you for your time and consideration.

Sincerely,
[Your Name]`,
  },
  {
    id: 'concise-direct',
    name: 'Concise & Direct',
    category: 'general',
    description: 'Short and impactful for busy hiring managers',
    content: `Dear Hiring Manager,

I'm applying for the [Job Title] role at [Company Name]. Here's why I'm a strong fit:

- [Key qualification 1 with measurable result]
- [Key qualification 2 with measurable result]
- [Key qualification 3 with measurable result]

I'm drawn to [Company Name] because [specific reason]. I'd love to bring my [key skill] expertise to your team.

Can we schedule a conversation? I'm available at your convenience.

Best regards,
[Your Name]`,
  },
  // Career Change
  {
    id: 'career-change',
    name: 'Career Changer',
    category: 'career-change',
    description: 'Highlights transferable skills for career transitions',
    content: `Dear Hiring Manager,

I am excited to apply for the [Job Title] position at [Company Name]. While my background is in [previous field], my experience has equipped me with transferable skills that make me uniquely suited for this role.

Throughout my career in [previous field], I developed strong abilities in [transferable skill 1], [transferable skill 2], and [transferable skill 3]. For example, I [specific achievement that demonstrates transferable value].

My transition into [new field] is driven by [genuine motivation]. I have been actively preparing through [courses, certifications, projects, or volunteer work], and I bring a fresh perspective combined with proven professional skills.

I am particularly impressed by [Company Name]'s [specific aspect] and am eager to contribute my diverse experience to your team. I would appreciate the opportunity to discuss how my unique background can add value to your organization.

Thank you for your consideration.

Sincerely,
[Your Name]`,
  },
  // Entry Level
  {
    id: 'recent-graduate',
    name: 'Recent Graduate',
    category: 'entry-level',
    description: 'Perfect for new grads with limited work experience',
    content: `Dear Hiring Manager,

As a recent graduate from [University] with a degree in [Field], I am eager to apply for the [Job Title] position at [Company Name].

During my studies, I [relevant academic achievement or project]. I also gained practical experience through [internship/part-time work/volunteer experience], where I [specific accomplishment]. These experiences taught me [relevant skills] and confirmed my passion for [industry/field].

What draws me to [Company Name] is [specific reason]. As someone who [relevant quality], I am excited about the opportunity to grow with your team and contribute fresh ideas.

I am a quick learner with strong [key soft skills] and am ready to bring my enthusiasm and dedication to this role. I would love the opportunity to discuss how I can contribute to [Company Name].

Thank you for your time.

Sincerely,
[Your Name]`,
  },
  {
    id: 'internship',
    name: 'Internship Application',
    category: 'entry-level',
    description: 'Tailored for internship positions',
    content: `Dear Hiring Manager,

I am writing to apply for the [Internship Title] at [Company Name]. As a [year] student at [University] studying [Major], I am seeking an opportunity to apply my academic knowledge in a real-world setting.

My coursework in [relevant subjects] has given me a solid foundation in [relevant skills]. Additionally, I [relevant project or extracurricular activity], which helped me develop [practical skills].

I am particularly interested in [Company Name] because [specific reason]. I am eager to learn from your team and contribute to [specific goal or project].

I am available [dates/hours] and am flexible with scheduling. Thank you for considering my application.

Best regards,
[Your Name]`,
  },
  // Executive
  {
    id: 'executive-leadership',
    name: 'Executive Leadership',
    category: 'executive',
    description: 'For C-suite and senior leadership positions',
    content: `Dear [Hiring Manager Name/Board],

With over [X years] of executive leadership experience driving [revenue growth/operational excellence/digital transformation] across [industries], I am writing to express my interest in the [Title] position at [Company Name].

Key highlights of my leadership track record include:

- Led [initiative] resulting in [quantified business impact]
- Built and scaled teams from [X] to [Y], achieving [outcome]
- Drove [strategic initiative] that delivered [measurable result]

My leadership philosophy centers on [approach], which has consistently produced [results]. At [Most Recent Company], I [signature achievement that demonstrates strategic thinking].

[Company Name]'s [strategic direction/challenge/opportunity] resonates with my experience in [relevant area]. I am confident that my combination of strategic vision and operational execution would drive meaningful results for your organization.

I would welcome a confidential discussion about how my experience aligns with your leadership needs.

Respectfully,
[Your Name]`,
  },
  // Creative
  {
    id: 'creative-storytelling',
    name: 'Creative Storytelling',
    category: 'creative',
    description: 'Narrative-driven for creative roles',
    content: `Dear [Company Name] Team,

When I first [encountered Company Name's work/product], I [specific emotional or intellectual reaction]. That moment sparked my interest in bringing my [creative skill] expertise to your team as [Job Title].

My creative journey has taken me from [starting point] to [current achievement]. Along the way, I've [notable creative accomplishment 1] and [creative accomplishment 2]. My work has been recognized by [awards/publications/clients], and I've collaborated with [notable brands or individuals].

What sets me apart is my ability to [unique creative approach]. For example, when [brief case study or project description], I [approach taken] which resulted in [measurable creative impact].

I'm inspired by [Company Name]'s commitment to [creative value/mission]. I'd love to discuss how my creative vision can complement your team's incredible work.

Let's create something remarkable together.

[Your Name]`,
  },
  // Technical
  {
    id: 'software-engineer',
    name: 'Software Engineer',
    category: 'technical',
    description: 'For software engineering and development roles',
    content: `Dear Hiring Manager,

I am applying for the [Job Title] position at [Company Name]. As a software engineer with [X years] of experience building [type of systems/applications], I am excited about the opportunity to contribute to [specific product/team/initiative].

Technical highlights:
- Built [system/feature] using [technologies] that [measurable impact]
- Improved [metric] by [X%] through [technical approach]
- Led the migration/implementation of [technical initiative] serving [scale]

I am proficient in [primary tech stack] and have hands-on experience with [relevant technologies from job description]. Beyond technical skills, I am passionate about [code quality/mentoring/system design/open source].

[Company Name]'s work on [specific technical challenge or product] aligns perfectly with my experience in [relevant domain]. I am eager to contribute to [specific team goal].

I look forward to discussing the technical challenges your team is tackling.

Best regards,
[Your Name]`,
  },
  // Follow-up
  {
    id: 'follow-up',
    name: 'Follow-Up Letter',
    category: 'follow-up',
    description: 'For following up after an interview or networking event',
    content: `Dear [Interviewer Name],

Thank you for taking the time to speak with me about the [Job Title] position on [date]. I thoroughly enjoyed learning about [specific topic discussed] and [Company Name]'s plans for [mentioned initiative].

Our conversation reinforced my enthusiasm for this opportunity. I was particularly excited to hear about [specific challenge or project], and I believe my experience with [relevant skill/project] would allow me to make an immediate impact.

As we discussed, [briefly reference a key point from the conversation that demonstrates your fit]. I wanted to follow up on [any question asked or topic to elaborate on].

I remain very interested in joining [Company Name] and contributing to your team's success. Please don't hesitate to reach out if you need any additional information.

Thank you again for your time and consideration.

Warm regards,
[Your Name]`,
  },
  // Referral
  {
    id: 'employee-referral',
    name: 'Employee Referral',
    category: 'referral',
    description: 'When referred by a current employee',
    content: `Dear Hiring Manager,

[Referrer Name], a [their title] at [Company Name], suggested I apply for the [Job Title] position. Having heard [them] speak passionately about the team's work on [specific project/initiative], I am excited to submit my application.

My background in [field] has prepared me well for this role. Specifically, I have:
- [Relevant achievement 1]
- [Relevant achievement 2]
- [Relevant achievement 3]

[Referrer Name] and I [how you know each other], and [they] believed my skills in [specific area] would be a strong match for your team's needs.

I would love to discuss how my experience can contribute to [Company Name]'s continued success. Thank you for your time.

Sincerely,
[Your Name]`,
  },
  {
    id: 'networking-introduction',
    name: 'Networking Introduction',
    category: 'referral',
    description: 'For cold outreach or informational interview requests',
    content: `Dear [Name],

I came across your profile while researching [Company Name/industry/topic] and was impressed by your work on [specific project or article]. I am a [your title] with experience in [relevant field], and I would greatly appreciate the opportunity to learn from your insights.

I am currently [exploring opportunities in/transitioning to/deepening my expertise in] [field], and [Company Name]'s approach to [specific aspect] particularly resonates with my professional interests.

Would you be open to a brief 15-20 minute conversation? I'd love to hear about your experience at [Company Name] and any advice you might have for someone with my background.

Thank you for considering my request. I understand you're busy and appreciate any time you can spare.

Best regards,
[Your Name]`,
  },
  {
    id: 'data-analyst',
    name: 'Data Analyst',
    category: 'technical',
    description: 'For data science and analytics roles',
    content: `Dear Hiring Manager,

I am excited to apply for the [Job Title] position at [Company Name]. With [X years] of experience turning complex data into actionable business insights, I am eager to bring my analytical expertise to your team.

In my current role at [Company], I have:
- Developed [dashboard/model/pipeline] that [business impact with numbers]
- Analyzed [data type] to identify [insight] leading to [outcome]
- Automated [process] reducing [time/cost] by [X%]

I am skilled in [tools: Python, SQL, Tableau, R, etc.] and have experience with [relevant methodologies]. What differentiates me is my ability to [translate technical findings into business recommendations/communicate with non-technical stakeholders].

[Company Name]'s data-driven approach to [specific area] is exactly the kind of environment where I thrive. I am eager to help your team uncover insights that drive [business goal].

Looking forward to discussing how I can contribute.

Best regards,
[Your Name]`,
  },
]

export const COVER_LETTER_CATEGORIES = [
  { id: 'general', label: 'General' },
  { id: 'career-change', label: 'Career Change' },
  { id: 'entry-level', label: 'Entry Level' },
  { id: 'executive', label: 'Executive' },
  { id: 'creative', label: 'Creative' },
  { id: 'technical', label: 'Technical' },
  { id: 'follow-up', label: 'Follow-Up' },
  { id: 'referral', label: 'Referral' },
] as const
