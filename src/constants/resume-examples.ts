export interface ResumeExample {
  slug: string
  jobTitle: string
  category: string
  description: string
  template: string
  summary: string
  experience: { title: string; company: string; dates: string; bullets: string[] }[]
  education: { degree: string; school: string; year: string }[]
  skills: string[]
}

export const EXAMPLE_CATEGORIES = [
  { id: 'tech', label: 'Technology', description: 'Software engineering, data science, DevOps, and IT roles.' },
  { id: 'business', label: 'Business', description: 'Management, finance, marketing, and operations roles.' },
  { id: 'healthcare', label: 'Healthcare', description: 'Nursing, medical, and healthcare administration roles.' },
  { id: 'creative', label: 'Creative', description: 'Design, writing, and media roles.' },
  { id: 'entry-level', label: 'Entry Level', description: 'Students, recent graduates, and career starters.' },
] as const

export const RESUME_EXAMPLES: ResumeExample[] = [
  // Tech
  {
    slug: 'software-engineer',
    jobTitle: 'Software Engineer',
    category: 'tech',
    description: 'Full-stack engineer with 5 years of experience building scalable web applications.',
    template: 'developer',
    summary: 'Full-stack software engineer with 5 years of experience building high-performance web applications. Proficient in TypeScript, React, Node.js, and PostgreSQL. Led migration of monolithic architecture to microservices, reducing deployment time by 60%.',
    experience: [
      {
        title: 'Senior Software Engineer',
        company: 'TechFlow Inc.',
        dates: 'Jan 2022 — Present',
        bullets: [
          'Architected and led migration from monolithic Rails app to microservices using Node.js and Kubernetes, reducing deployment time from 45 minutes to 8 minutes',
          'Built real-time collaboration features serving 50K+ daily active users using WebSocket and Redis pub/sub, achieving 99.9% uptime',
          'Mentored 4 junior engineers through code reviews and pair programming, resulting in 30% faster feature delivery',
          'Implemented CI/CD pipeline with GitHub Actions, reducing manual QA time by 40% through automated testing',
        ],
      },
      {
        title: 'Software Engineer',
        company: 'DataPulse',
        dates: 'Jun 2019 — Dec 2021',
        bullets: [
          'Developed customer-facing analytics dashboard using React and D3.js, increasing user engagement by 45%',
          'Optimized PostgreSQL queries and added Redis caching, reducing API response times from 800ms to 120ms',
          'Built automated data pipeline processing 2M+ records daily using Python and Apache Airflow',
        ],
      },
    ],
    education: [{ degree: 'B.S. Computer Science', school: 'University of Washington', year: '2019' }],
    skills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'AWS', 'Docker', 'Kubernetes', 'Redis', 'GraphQL', 'Python'],
  },
  {
    slug: 'data-scientist',
    jobTitle: 'Data Scientist',
    category: 'tech',
    description: 'ML engineer specializing in NLP and predictive modeling with Python and TensorFlow.',
    template: 'data',
    summary: 'Data scientist with 4 years of experience building ML models for production. Specialized in NLP and predictive analytics using Python, TensorFlow, and scikit-learn. Published researcher with 3 peer-reviewed papers.',
    experience: [
      {
        title: 'Senior Data Scientist',
        company: 'Predictive AI Labs',
        dates: 'Mar 2022 — Present',
        bullets: [
          'Built NLP-based customer sentiment analysis pipeline processing 500K+ reviews monthly, achieving 92% accuracy',
          'Developed churn prediction model that identified at-risk customers 30 days early, saving $2.1M in annual revenue',
          'Led A/B testing framework redesign, increasing experiment velocity by 3x across 5 product teams',
        ],
      },
      {
        title: 'Data Scientist',
        company: 'RetailMetrics',
        dates: 'Aug 2020 — Feb 2022',
        bullets: [
          'Created demand forecasting model using LSTM networks, reducing inventory waste by 18% ($800K annual savings)',
          'Built automated feature engineering pipeline in Python, reducing model development time from 2 weeks to 3 days',
        ],
      },
    ],
    education: [{ degree: 'M.S. Machine Learning', school: 'Stanford University', year: '2020' }],
    skills: ['Python', 'TensorFlow', 'PyTorch', 'SQL', 'Spark', 'scikit-learn', 'NLP', 'A/B Testing', 'Tableau', 'AWS SageMaker'],
  },
  {
    slug: 'product-manager',
    jobTitle: 'Product Manager',
    category: 'business',
    description: 'PM with experience shipping B2B SaaS products from 0 to 1.',
    template: 'modern-minimal',
    summary: 'Product manager with 6 years of experience shipping B2B SaaS products. Led cross-functional teams of 15+ to deliver features that increased ARR by $4M. Strong background in data-driven decision making and user research.',
    experience: [
      {
        title: 'Senior Product Manager',
        company: 'CloudSync',
        dates: 'Feb 2021 — Present',
        bullets: [
          'Owned product roadmap for collaboration suite (50K+ users), driving 35% increase in daily active usage through feature prioritization based on customer interviews and data analysis',
          'Led launch of enterprise SSO integration, unlocking $2M+ in new annual contracts from Fortune 500 clients',
          'Reduced customer onboarding time from 14 days to 3 days by redesigning the setup wizard based on 50+ user interviews',
          'Established product analytics framework using Amplitude, enabling data-driven prioritization across 3 product teams',
        ],
      },
      {
        title: 'Product Manager',
        company: 'Streamline HR',
        dates: 'Jan 2018 — Jan 2021',
        bullets: [
          'Shipped v1 of employee engagement platform from concept to 10K users in 8 months',
          'Defined and tracked OKRs that drove 40% improvement in NPS score over 4 quarters',
        ],
      },
    ],
    education: [{ degree: 'MBA', school: 'Wharton School of Business', year: '2018' }],
    skills: ['Product Strategy', 'User Research', 'A/B Testing', 'SQL', 'Amplitude', 'Jira', 'Figma', 'Agile/Scrum'],
  },
  {
    slug: 'registered-nurse',
    jobTitle: 'Registered Nurse',
    category: 'healthcare',
    description: 'RN with 7 years of experience in emergency and critical care settings.',
    template: 'classic-professional',
    summary: 'Registered Nurse (BSN, RN) with 7 years of experience in emergency and critical care. Skilled in triage, patient assessment, and crisis management. Recognized for reducing medication errors by 40% through protocol improvements.',
    experience: [
      {
        title: 'Emergency Room Nurse',
        company: 'City General Hospital',
        dates: 'Jun 2020 — Present',
        bullets: [
          'Managed triage and care for 30+ patients per shift in Level 1 trauma center, maintaining 98% patient satisfaction scores',
          'Implemented new medication verification protocol that reduced medication errors by 40% across the ER department',
          'Trained and mentored 12 new graduate nurses, developing standardized orientation checklist adopted department-wide',
          'Coordinated with interdisciplinary teams during COVID-19 surge, managing up to 45 patients during peak capacity',
        ],
      },
      {
        title: 'ICU Nurse',
        company: 'St. Mary Medical Center',
        dates: 'May 2017 — May 2020',
        bullets: [
          'Provided critical care for patients with complex conditions including ventilator management and hemodynamic monitoring',
          'Led quality improvement initiative that reduced central line infections by 25% over 12 months',
        ],
      },
    ],
    education: [{ degree: 'BSN, Registered Nurse', school: 'Johns Hopkins School of Nursing', year: '2017' }],
    skills: ['Emergency Triage', 'Critical Care', 'Patient Assessment', 'IV Therapy', 'BLS/ACLS', 'Epic EMR', 'Wound Care'],
  },
  {
    slug: 'graphic-designer',
    jobTitle: 'Graphic Designer',
    category: 'creative',
    description: 'Visual designer with expertise in branding, UI design, and motion graphics.',
    template: 'creative-bold',
    summary: 'Graphic designer with 5 years of experience creating compelling brand identities and digital experiences. Proficient in Figma, Adobe Creative Suite, and After Effects. Portfolio includes work for Fortune 500 clients and award-winning startups.',
    experience: [
      {
        title: 'Senior Graphic Designer',
        company: 'BrandForge Agency',
        dates: 'Apr 2021 — Present',
        bullets: [
          'Led complete brand redesign for 3 enterprise clients, resulting in average 28% increase in brand recognition metrics',
          'Created design system with 200+ reusable components in Figma, reducing design-to-development handoff time by 50%',
          'Produced motion graphics for social media campaigns generating 2M+ views across platforms',
        ],
      },
      {
        title: 'Graphic Designer',
        company: 'Pixel & Co.',
        dates: 'Jul 2019 — Mar 2021',
        bullets: [
          'Designed marketing materials for 20+ client campaigns, contributing to $1.5M in new business revenue',
          'Won regional AIGA design award for nonprofit brand identity project',
        ],
      },
    ],
    education: [{ degree: 'BFA Graphic Design', school: 'Rhode Island School of Design', year: '2019' }],
    skills: ['Figma', 'Adobe Photoshop', 'Illustrator', 'After Effects', 'InDesign', 'Branding', 'Typography', 'UI/UX'],
  },
  {
    slug: 'marketing-manager',
    jobTitle: 'Marketing Manager',
    category: 'business',
    description: 'Digital marketing leader driving growth through SEO, paid media, and content strategy.',
    template: 'metro',
    summary: 'Marketing manager with 6 years of experience driving B2B SaaS growth. Managed $2M+ annual ad budget across Google, LinkedIn, and Meta. Increased organic traffic by 180% and reduced CAC by 35% through full-funnel optimization.',
    experience: [
      {
        title: 'Marketing Manager',
        company: 'GrowthStack',
        dates: 'Jan 2021 — Present',
        bullets: [
          'Managed $2M annual digital advertising budget across Google Ads, LinkedIn, and Meta, achieving 4.2x ROAS',
          'Led SEO strategy that increased organic traffic from 15K to 42K monthly visitors in 18 months',
          'Reduced customer acquisition cost by 35% through landing page optimization and audience segmentation',
          'Built and managed team of 4 marketers, establishing OKR framework that improved campaign velocity by 50%',
        ],
      },
    ],
    education: [{ degree: 'B.A. Marketing', school: 'University of Michigan', year: '2018' }],
    skills: ['Google Ads', 'SEO/SEM', 'HubSpot', 'Google Analytics', 'Content Strategy', 'LinkedIn Ads', 'A/B Testing'],
  },
  {
    slug: 'recent-graduate',
    jobTitle: 'Recent Graduate',
    category: 'entry-level',
    description: 'New grad with internship experience and strong academic background.',
    template: 'starter',
    summary: 'Recent computer science graduate with internship experience at a Fortune 500 company. Strong foundation in full-stack development and machine learning. Eager to contribute to innovative engineering teams.',
    experience: [
      {
        title: 'Software Engineering Intern',
        company: 'Microsoft',
        dates: 'Jun 2025 — Aug 2025',
        bullets: [
          'Developed feature for Teams desktop app used by 300M+ users, improving meeting scheduling UX for recurring events',
          'Built automated testing suite with 95% code coverage, reducing regression bugs by 20% in release cycle',
          'Collaborated with senior engineers in Agile sprints, delivering 3 features ahead of internship timeline',
        ],
      },
      {
        title: 'Teaching Assistant — Data Structures',
        company: 'UC Berkeley',
        dates: 'Jan 2025 — May 2025',
        bullets: [
          'Led weekly lab sessions for 30 students, achieving 4.8/5.0 student satisfaction rating',
          'Created supplementary study materials that improved average exam scores by 12%',
        ],
      },
    ],
    education: [{ degree: 'B.S. Computer Science', school: 'UC Berkeley', year: '2025' }],
    skills: ['Python', 'JavaScript', 'React', 'Java', 'SQL', 'Git', 'Machine Learning', 'Agile'],
  },
  {
    slug: 'accountant',
    jobTitle: 'Accountant',
    category: 'business',
    description: 'CPA with expertise in financial reporting, tax compliance, and audit.',
    template: 'corporate',
    summary: 'CPA-certified accountant with 5 years of experience in financial reporting and tax compliance. Managed $50M+ in client portfolios. Reduced audit preparation time by 30% through process automation.',
    experience: [
      {
        title: 'Senior Accountant',
        company: 'Deloitte',
        dates: 'Sep 2021 — Present',
        bullets: [
          'Managed financial reporting for 8 corporate clients with combined revenue of $50M+, ensuring 100% compliance with GAAP',
          'Led implementation of automated reconciliation system, reducing month-end close time from 10 days to 6 days',
          'Prepared and reviewed federal and state tax returns for 25+ clients, identifying $1.2M in tax savings opportunities',
        ],
      },
    ],
    education: [{ degree: 'B.S. Accounting, CPA', school: 'University of Illinois', year: '2019' }],
    skills: ['GAAP', 'Tax Compliance', 'Financial Reporting', 'QuickBooks', 'SAP', 'Excel', 'Audit', 'Budgeting'],
  },
]
