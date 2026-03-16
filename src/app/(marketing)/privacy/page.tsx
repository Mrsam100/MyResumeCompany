import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'TheResumeCompany privacy policy — how we collect, use, and protect your data.',
}

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:py-24">
      <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: March 15, 2026</p>

      <div className="prose prose-sm mt-10 max-w-none text-muted-foreground [&_h2]:mt-10 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-6">
        <h2>1. Information We Collect</h2>
        <p>We collect information you provide directly when you create an account, build a resume, or make a purchase:</p>
        <ul>
          <li>Account information: name, email address, and password (hashed)</li>
          <li>Resume content: personal information, work history, education, and skills you enter</li>
          <li>Payment information: processed securely by Stripe — we never store card numbers</li>
          <li>Usage data: how you interact with our features to improve the product</li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <p>We use your information to:</p>
        <ul>
          <li>Provide and maintain the resume builder service</li>
          <li>Process AI requests (your resume content is sent to our AI provider for processing)</li>
          <li>Process payments and manage your subscription</li>
          <li>Send transactional emails (account verification, purchase receipts)</li>
          <li>Improve our product and fix bugs</li>
        </ul>

        <h2>3. AI Processing</h2>
        <p>
          When you use our AI features (bullet point writer, summary generator, ATS scanner, etc.),
          your resume content and job descriptions are sent to Anthropic&apos;s Claude API for processing.
          This data is used solely to generate your results and is not used to train AI models.
        </p>

        <h2>4. Data Sharing</h2>
        <p>We do not sell your personal information. We share data only with:</p>
        <ul>
          <li>Anthropic (AI processing via Claude API) — resume content for AI features</li>
          <li>Stripe (payment processing) — payment and billing information</li>
          <li>Supabase (database hosting) — all account and resume data</li>
          <li>Vercel (hosting) — server logs and performance data</li>
        </ul>

        <h2>5. Data Security</h2>
        <p>
          We use industry-standard security measures including encrypted connections (HTTPS),
          hashed passwords (bcrypt), and secure database hosting. All payment processing is
          handled by Stripe, a PCI-DSS compliant payment processor.
        </p>

        <h2>6. Data Retention</h2>
        <p>
          We retain your data for as long as your account is active. You can delete your account
          and all associated data at any time from your Settings page. Upon deletion, we remove
          all your resumes, transaction history, and personal information within 30 days.
        </p>

        <h2>7. Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access your personal data</li>
          <li>Correct inaccurate data</li>
          <li>Delete your account and all associated data</li>
          <li>Export your resume data</li>
        </ul>

        <h2>8. Cookies</h2>
        <p>
          We use essential cookies for authentication and session management. We do not use
          third-party advertising cookies.
        </p>

        <h2>9. Changes to This Policy</h2>
        <p>
          We may update this privacy policy from time to time. We will notify you of significant
          changes via email or an in-app notification.
        </p>

        <h2>10. Contact</h2>
        <p>
          If you have questions about this privacy policy or your data, please contact us at
          privacy@theresumecompany.com.
        </p>
      </div>
    </div>
  )
}
