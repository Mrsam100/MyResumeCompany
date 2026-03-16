import type { Metadata } from 'next'
import { JsonLd } from '@/components/schema/json-ld'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'TheResumeCompany privacy policy — how we collect, use, and protect your data.',
  alternates: { canonical: '/privacy' },
}

export default function PrivacyPage() {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://theresumecompany.com'
  return (
    <>
    <JsonLd data={{ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl }, { '@type': 'ListItem', position: 2, name: 'Privacy Policy', item: `${siteUrl}/privacy` }] }} />
    <div className="mx-auto max-w-3xl px-4 py-16 sm:py-24">
      <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: March 16, 2026</p>

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
          your resume content and job descriptions are sent to Google&apos;s Gemini API for processing.
          This data is used solely to generate your results and is not used to train AI models.
        </p>

        <h2>4. Data Sharing</h2>
        <p>We do not sell your personal information. We share data only with:</p>
        <ul>
          <li>Google (AI processing via Gemini API) — resume content for AI features</li>
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
        <p>Depending on your location, you may have the following rights under applicable privacy laws (including GDPR and CCPA/CPRA):</p>
        <ul>
          <li><strong>Right to access</strong> — Request a copy of the personal data we hold about you</li>
          <li><strong>Right to correction</strong> — Request correction of inaccurate or incomplete data</li>
          <li><strong>Right to deletion</strong> — Request deletion of your account and all associated data. You can self-service this from your Settings page, or email privacy@theresumecompany.com</li>
          <li><strong>Right to data portability</strong> — Export your resume data in a structured format</li>
          <li><strong>Right to opt out of sale</strong> — We do not sell your personal information. No action is required</li>
          <li><strong>Right to non-discrimination</strong> — We will not discriminate against you for exercising any of these rights</li>
        </ul>
        <p>
          To exercise any of these rights, email privacy@theresumecompany.com. We will respond within
          30 days (or sooner as required by applicable law). We may ask you to verify your identity
          before processing your request.
        </p>

        <h2>8. International Users (GDPR)</h2>
        <p>
          If you are located in the European Economic Area (EEA), United Kingdom, or Switzerland,
          we process your personal data under the following legal bases:
        </p>
        <ul>
          <li><strong>Contract performance</strong> — To provide the resume builder service you signed up for</li>
          <li><strong>Legitimate interest</strong> — To improve our product, prevent fraud, and ensure security</li>
          <li><strong>Consent</strong> — For any optional data processing, which you may withdraw at any time</li>
        </ul>
        <p>
          You may lodge a complaint with your local data protection authority if you believe we have
          not handled your data in accordance with applicable law.
        </p>

        <h2>9. California Residents (CCPA/CPRA)</h2>
        <p>
          If you are a California resident, you have additional rights under the California Consumer
          Privacy Act (CCPA) and the California Privacy Rights Act (CPRA):
        </p>
        <ul>
          <li>Right to know what personal information we collect, use, and disclose</li>
          <li>Right to delete your personal information</li>
          <li>Right to opt out of the sale or sharing of personal information — we do not sell or share your data</li>
          <li>Right to limit use of sensitive personal information — we only use sensitive data as needed to provide the service</li>
        </ul>
        <p>
          In the past 12 months, we have collected the categories of personal information described
          in Section 1. We have not sold or shared personal information for cross-context behavioral
          advertising.
        </p>

        <h2>10. Cookies</h2>
        <p>
          We use essential cookies for authentication and session management. We do not use
          third-party advertising cookies.
        </p>

        <h2>11. Changes to This Policy</h2>
        <p>
          We may update this privacy policy from time to time. We will notify you of significant
          changes via email or an in-app notification.
        </p>

        <h2>12. Contact</h2>
        <p>
          If you have questions about this privacy policy or your data, please contact us at
          privacy@theresumecompany.com.
        </p>
      </div>
    </div>
    </>
  )
}
