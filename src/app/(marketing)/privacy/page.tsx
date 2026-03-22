import type { Metadata } from 'next'
import Link from 'next/link'
import { JsonLd } from '@/components/schema/json-ld'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'TheResumeCompany privacy policy — how we collect, use, store, and protect your personal data. GDPR, CCPA/CPRA, and international compliance.',
  alternates: { canonical: '/privacy' },
}

export default function PrivacyPage() {
  const siteUrl =
    process.env.NEXT_PUBLIC_APP_URL || 'https://theresumecompany.com'

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Privacy Policy',
              item: `${siteUrl}/privacy`,
            },
          ],
        }}
      />

      <div className="mx-auto max-w-3xl px-4 py-16 sm:py-24">
        <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Effective date: March 1, 2026 &middot; Last updated: March 19, 2026
        </p>

        <div className="prose prose-sm mt-10 max-w-none text-muted-foreground [&_h2]:mt-12 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground [&_h3]:mt-6 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-foreground [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:mt-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_table]:mt-4 [&_table]:w-full [&_th]:text-left [&_th]:text-foreground [&_th]:font-semibold [&_th]:pb-2 [&_td]:py-1.5 [&_td]:pr-4">
          {/* ── Introduction ── */}
          <p>
            TheResumeCompany (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) operates the website at{' '}
            <Link href="/" className="text-primary hover:underline">
              theresumecompany.com
            </Link>{' '}
            and the associated AI resume builder service (collectively, the &ldquo;Service&rdquo;).
            TheResumeCompany is a product of Schroeder Technologies Company, registered in the United States.
          </p>
          <p>
            This Privacy Policy explains what personal data we collect, why we collect it, how we use
            and protect it, who we share it with, and what rights you have. It applies to all users
            of the Service regardless of location.
          </p>
          <p>
            By creating an account or using the Service, you agree to the practices described in this
            policy. If you do not agree, please do not use the Service.
          </p>

          {/* ── 1. Data Controller ── */}
          <h2>1. Data Controller</h2>
          <p>
            Schroeder Technologies Company is the data controller for the personal data processed
            through the Service. If you have questions or concerns, you can reach us at:
          </p>
          <ul>
            <li>
              <strong>Privacy inquiries:</strong>{' '}
              <a href="mailto:privacy@theresumecompany.com" className="text-primary hover:underline">
                privacy@theresumecompany.com
              </a>
            </li>
            <li>
              <strong>General support:</strong>{' '}
              <a href="mailto:support@theresumecompany.com" className="text-primary hover:underline">
                support@theresumecompany.com
              </a>
            </li>
            <li>
              <strong>Mailing address:</strong> Schroeder Technologies Company, United States
            </li>
          </ul>

          {/* ── 2. Information We Collect ── */}
          <h2>2. Information We Collect</h2>

          <h3>2.1 Information You Provide Directly</h3>
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Examples</th>
                <th>Purpose</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Account data</strong></td>
                <td>Full name, email address, hashed password (bcrypt)</td>
                <td>Account creation, authentication, communication</td>
              </tr>
              <tr>
                <td><strong>Profile data</strong></td>
                <td>Profile photo (optional), display name</td>
                <td>Account personalization</td>
              </tr>
              <tr>
                <td><strong>Resume content</strong></td>
                <td>Personal info, work history, education, skills, certifications, projects, summary</td>
                <td>Providing the resume builder service, AI processing</td>
              </tr>
              <tr>
                <td><strong>Payment data</strong></td>
                <td>Billing name, billing address, payment method (processed by Stripe)</td>
                <td>Processing purchases and subscriptions</td>
              </tr>
              <tr>
                <td><strong>Communications</strong></td>
                <td>Emails you send to support or privacy addresses</td>
                <td>Responding to inquiries, improving service</td>
              </tr>
            </tbody>
          </table>
          <p>
            <strong>Important:</strong> We never store raw credit card numbers, CVVs, or full card
            details. All payment processing is handled by{' '}
            <a
              href="https://stripe.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Stripe
            </a>
            , a PCI-DSS Level 1 compliant payment processor.
          </p>

          <h3>2.2 Information Collected Automatically</h3>
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Examples</th>
                <th>Purpose</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Device data</strong></td>
                <td>Browser type, operating system, screen resolution, device type</td>
                <td>Ensuring compatibility, debugging</td>
              </tr>
              <tr>
                <td><strong>Log data</strong></td>
                <td>IP address, access timestamps, pages visited, referral URL</td>
                <td>Security monitoring, analytics, abuse prevention</td>
              </tr>
              <tr>
                <td><strong>Usage data</strong></td>
                <td>Features used, button clicks, session duration, error logs</td>
                <td>Product improvement, performance monitoring</td>
              </tr>
            </tbody>
          </table>

          <h3>2.3 Information From Third-Party Sign-In</h3>
          <p>
            If you sign in with Google, we receive your name, email address, and profile
            photo. We do not receive your password. You can revoke access at any
            time through your Google account settings.
          </p>

          {/* ── 3. How We Use Your Information ── */}
          <h2>3. How We Use Your Information</h2>
          <p>We use your personal data for the following purposes:</p>
          <ol>
            <li>
              <strong>Providing the Service</strong> — Creating and managing your account, storing
              your resumes, generating PDFs, and processing AI requests.
            </li>
            <li>
              <strong>AI processing</strong> — When you use AI features (bullet writer, summary
              generator, full resume wizard, ATS scanner, ATS optimizer, cover letter generator),
              your resume content and any job descriptions you provide are sent to Google&apos;s
              Gemini API for processing. See Section 5 for details.
            </li>
            <li>
              <strong>Payment processing</strong> — Processing credit purchases, subscription
              payments, renewals, and refunds through Stripe.
            </li>
            <li>
              <strong>Communication</strong> — Sending transactional emails (account verification,
              password reset, purchase receipts, subscription confirmations). We do not send
              marketing emails without your explicit consent.
            </li>
            <li>
              <strong>Security and fraud prevention</strong> — Rate limiting, abuse detection,
              monitoring for unauthorized access.
            </li>
            <li>
              <strong>Product improvement</strong> — Analyzing aggregate usage patterns to improve
              features, fix bugs, and optimize performance. We do not use your resume content
              for product analytics.
            </li>
            <li>
              <strong>Legal compliance</strong> — Responding to legal requests, enforcing our Terms
              of Service, and complying with applicable laws.
            </li>
          </ol>

          {/* ── 4. Legal Bases for Processing (GDPR) ── */}
          <h2>4. Legal Bases for Processing (GDPR)</h2>
          <p>
            If you are in the European Economic Area (EEA), United Kingdom, or Switzerland, we
            process your personal data under the following legal bases:
          </p>
          <table>
            <thead>
              <tr>
                <th>Legal Basis</th>
                <th>Processing Activities</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Contract performance</strong> (Art. 6(1)(b))</td>
                <td>
                  Account creation, resume storage, AI processing, PDF export, payment processing —
                  all necessary to deliver the Service you signed up for
                </td>
              </tr>
              <tr>
                <td><strong>Legitimate interest</strong> (Art. 6(1)(f))</td>
                <td>
                  Security monitoring, fraud prevention, product improvement using aggregate analytics,
                  enforcing Terms of Service
                </td>
              </tr>
              <tr>
                <td><strong>Consent</strong> (Art. 6(1)(a))</td>
                <td>
                  Optional marketing communications, analytics cookies (if implemented in the future).
                  You may withdraw consent at any time
                </td>
              </tr>
              <tr>
                <td><strong>Legal obligation</strong> (Art. 6(1)(c))</td>
                <td>
                  Tax record retention, responding to lawful data requests from authorities
                </td>
              </tr>
            </tbody>
          </table>

          {/* ── 5. AI Processing ── */}
          <h2>5. AI Processing and Your Resume Data</h2>
          <p>
            Our AI features are powered by <strong>Google&apos;s Gemini API</strong> (model:
            gemini-2.0-flash). When you use an AI feature, the following happens:
          </p>
          <ol>
            <li>Your resume content (and job description, if applicable) is sent to Google&apos;s servers via an encrypted API connection.</li>
            <li>Google processes the request and returns the generated content (bullet points, summary, ATS score, etc.).</li>
            <li>The generated content is returned to you. We do not store the raw AI response beyond what you choose to save to your resume.</li>
          </ol>
          <p><strong>What Google does NOT do with your data:</strong></p>
          <ul>
            <li>Google does not use Gemini API inputs to train its models (per Google&apos;s{' '}
              <a
                href="https://ai.google.dev/gemini-api/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                API Terms of Service
              </a>
              )
            </li>
            <li>Google does not retain API inputs beyond the period necessary for processing and abuse monitoring</li>
            <li>Google does not share your data with third parties</li>
          </ul>
          <p>
            We sanitize all user input before sending it to the AI to remove HTML tags, control
            characters, and potential injection content. All AI requests include a 30-second timeout
            and are subject to per-user rate limits (20 requests/hour for free accounts, 100/hour
            for Pro).
          </p>

          {/* ── 6. Data Sharing ── */}
          <h2>6. Who We Share Your Data With</h2>
          <p>
            <strong>We do not sell, rent, or trade your personal information.</strong> We share data
            only with the following service providers who process it on our behalf:
          </p>
          <table>
            <thead>
              <tr>
                <th>Provider</th>
                <th>Purpose</th>
                <th>Data Shared</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Google (Gemini API)</strong></td>
                <td>AI resume writing features</td>
                <td>Resume content, job descriptions (per request)</td>
                <td>United States</td>
              </tr>
              <tr>
                <td><strong>Stripe</strong></td>
                <td>Payment processing</td>
                <td>Billing name, email, payment method, transaction details</td>
                <td>United States</td>
              </tr>
              <tr>
                <td><strong>Supabase</strong></td>
                <td>Database and file storage</td>
                <td>All account data, resume content, uploaded files</td>
                <td>United States (AWS us-east-1)</td>
              </tr>
              <tr>
                <td><strong>Vercel</strong></td>
                <td>Application hosting, edge functions</td>
                <td>Server logs, request metadata, performance data</td>
                <td>United States (iad1 region)</td>
              </tr>
              <tr>
                <td><strong>Resend</strong></td>
                <td>Transactional email delivery</td>
                <td>Email address, email content</td>
                <td>United States</td>
              </tr>
            </tbody>
          </table>
          <p>We may also share data when required by law, court order, or to protect our legal rights.</p>

          <h3>6.1 International Data Transfers</h3>
          <p>
            All our service providers are based in the United States. If you are located outside the
            United States, your data will be transferred to and processed in the United States. For
            EEA/UK users, these transfers are conducted under Standard Contractual Clauses (SCCs) as
            approved by the European Commission, or other legally recognized transfer mechanisms.
          </p>

          {/* ── 7. Data Security ── */}
          <h2>7. Data Security</h2>
          <p>We implement industry-standard security measures to protect your data:</p>
          <ul>
            <li><strong>Encryption in transit:</strong> All connections use TLS/HTTPS with HSTS preloading (2-year max-age)</li>
            <li><strong>Password security:</strong> Passwords are hashed using bcrypt with per-user salts. We never store plaintext passwords</li>
            <li><strong>Payment security:</strong> All payment processing is handled by Stripe (PCI-DSS Level 1 certified). We never receive or store card numbers</li>
            <li><strong>Database security:</strong> Row-level security policies, encrypted connections, and access controls on all database operations</li>
            <li><strong>API security:</strong> Rate limiting on all endpoints, input validation with Zod schemas, CSRF protection via origin header verification</li>
            <li><strong>Access control:</strong> Ownership verification on all resume operations — users can only access their own data</li>
            <li><strong>Security headers:</strong> X-Frame-Options DENY, Content-Type nosniff, strict Referrer-Policy, restrictive Permissions-Policy</li>
            <li><strong>Monitoring:</strong> Error tracking via Sentry for production incident response</li>
          </ul>
          <p>
            No system is 100% secure. If we become aware of a data breach affecting your personal
            information, we will notify you and any applicable regulatory authority within 72 hours
            as required by GDPR, or as otherwise required by applicable law.
          </p>

          {/* ── 8. Data Retention ── */}
          <h2>8. Data Retention</h2>
          <table>
            <thead>
              <tr>
                <th>Data Type</th>
                <th>Retention Period</th>
                <th>Reason</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Account data</td>
                <td>Until account deletion</td>
                <td>Required to provide the Service</td>
              </tr>
              <tr>
                <td>Resume content</td>
                <td>Until account deletion or individual resume deletion</td>
                <td>Required to provide the Service</td>
              </tr>
              <tr>
                <td>Payment records</td>
                <td>7 years after transaction</td>
                <td>Tax and legal compliance</td>
              </tr>
              <tr>
                <td>Credit transaction history</td>
                <td>Until account deletion</td>
                <td>Account billing transparency</td>
              </tr>
              <tr>
                <td>Server logs</td>
                <td>90 days</td>
                <td>Security monitoring and debugging</td>
              </tr>
              <tr>
                <td>AI request/response data</td>
                <td>Not stored (processed in real-time only)</td>
                <td>N/A</td>
              </tr>
              <tr>
                <td>Support emails</td>
                <td>2 years after resolution</td>
                <td>Quality assurance and dispute resolution</td>
              </tr>
            </tbody>
          </table>
          <p>
            When you delete your account, we permanently remove all your personal data, resumes, and
            transaction history within <strong>30 days</strong>. Some anonymized, aggregate data (e.g.,
            total number of resumes created) may be retained for analytics purposes but cannot be
            linked back to you.
          </p>

          {/* ── 9. Your Rights ── */}
          <h2>9. Your Rights</h2>
          <p>
            Depending on your location, you have the following rights regarding your personal data.
            We honor these rights for all users regardless of jurisdiction:
          </p>
          <table>
            <thead>
              <tr>
                <th>Right</th>
                <th>Description</th>
                <th>How to Exercise</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Access</strong></td>
                <td>Request a copy of all personal data we hold about you</td>
                <td>Email privacy@theresumecompany.com</td>
              </tr>
              <tr>
                <td><strong>Correction</strong></td>
                <td>Request correction of inaccurate or incomplete data</td>
                <td>Edit directly in your account, or email us</td>
              </tr>
              <tr>
                <td><strong>Deletion</strong></td>
                <td>Request deletion of your account and all associated data</td>
                <td>
                  Self-service via{' '}
                  <Link href="/settings" className="text-primary hover:underline">
                    Settings
                  </Link>{' '}
                  page, or email us
                </td>
              </tr>
              <tr>
                <td><strong>Data portability</strong></td>
                <td>Receive your data in a structured, machine-readable format (JSON)</td>
                <td>Email privacy@theresumecompany.com</td>
              </tr>
              <tr>
                <td><strong>Restrict processing</strong></td>
                <td>Request that we limit how we use your data</td>
                <td>Email privacy@theresumecompany.com</td>
              </tr>
              <tr>
                <td><strong>Object to processing</strong></td>
                <td>Object to processing based on legitimate interest</td>
                <td>Email privacy@theresumecompany.com</td>
              </tr>
              <tr>
                <td><strong>Withdraw consent</strong></td>
                <td>Withdraw any previously given consent at any time</td>
                <td>Email privacy@theresumecompany.com</td>
              </tr>
              <tr>
                <td><strong>Opt out of sale</strong></td>
                <td>We do not sell personal information — no action required</td>
                <td>N/A</td>
              </tr>
              <tr>
                <td><strong>Non-discrimination</strong></td>
                <td>We will not treat you differently for exercising your rights</td>
                <td>N/A</td>
              </tr>
            </tbody>
          </table>
          <p>
            We will respond to all rights requests within <strong>30 days</strong> (or sooner as
            required by applicable law — 15 days for certain CCPA requests). We may ask you to
            verify your identity before processing your request. We will not charge a fee for
            reasonable requests.
          </p>

          {/* ── 10. GDPR ── */}
          <h2>10. Additional Rights for EEA, UK, and Swiss Users (GDPR)</h2>
          <p>
            If you are located in the European Economic Area, United Kingdom, or Switzerland, you
            have additional protections under the General Data Protection Regulation (GDPR):
          </p>
          <ul>
            <li>
              <strong>Legal bases:</strong> We process your data only under the legal bases described
              in Section 4 above.
            </li>
            <li>
              <strong>Data transfers:</strong> Transfers to the United States are conducted under
              Standard Contractual Clauses (SCCs). See Section 6.1.
            </li>
            <li>
              <strong>Data Protection Authority:</strong> You have the right to lodge a complaint
              with your local data protection authority if you believe we have not handled your data
              in accordance with applicable law. A list of EU DPAs is available at{' '}
              <a
                href="https://edpb.europa.eu/about-edpb/about-edpb/members_en"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                edpb.europa.eu
              </a>
              .
            </li>
            <li>
              <strong>Automated decision-making:</strong> We do not make legally significant decisions
              about you based solely on automated processing. AI features generate content suggestions
              that you review and choose to accept or reject.
            </li>
          </ul>

          {/* ── 11. CCPA/CPRA ── */}
          <h2>11. Additional Rights for California Residents (CCPA/CPRA)</h2>
          <p>
            If you are a California resident, the California Consumer Privacy Act (CCPA) and
            California Privacy Rights Act (CPRA) provide you with additional rights:
          </p>

          <h3>11.1 Categories of Personal Information Collected</h3>
          <p>In the preceding 12 months, we have collected the following categories:</p>
          <ul>
            <li><strong>Identifiers</strong> — Name, email address, IP address, account ID</li>
            <li><strong>Commercial information</strong> — Purchase history, credit transactions, subscription status</li>
            <li><strong>Internet activity</strong> — Browsing history on our site, feature usage, search queries</li>
            <li><strong>Professional information</strong> — Job titles, employers, skills, education (from resume content you provide)</li>
            <li><strong>Inferences</strong> — None. We do not create profiles or inferences about you</li>
          </ul>

          <h3>11.2 Sale and Sharing</h3>
          <p>
            <strong>We do not sell personal information.</strong> We do not share personal information
            for cross-context behavioral advertising. We have not sold or shared personal information
            in the preceding 12 months.
          </p>

          <h3>11.3 Sensitive Personal Information</h3>
          <p>
            We may process sensitive personal information (such as account login credentials) solely
            as necessary to provide the Service. We do not use sensitive personal information for
            purposes beyond what is necessary to perform the Service.
          </p>

          <h3>11.4 How to Submit a Request</h3>
          <p>
            California residents may submit requests to know, delete, or correct their personal
            information by emailing{' '}
            <a href="mailto:privacy@theresumecompany.com" className="text-primary hover:underline">
              privacy@theresumecompany.com
            </a>{' '}
            with the subject line &ldquo;CCPA Request.&rdquo; You may also designate an authorized
            agent to submit a request on your behalf with written proof of authorization.
          </p>

          {/* ── 12. Children ── */}
          <h2>12. Children&apos;s Privacy</h2>
          <p>
            The Service is not intended for children under the age of 16. We do not knowingly collect
            personal information from children under 16. If we learn that we have collected personal
            data from a child under 16, we will delete that data promptly. If you believe a child
            under 16 has provided us with personal information, please contact us at{' '}
            <a href="mailto:privacy@theresumecompany.com" className="text-primary hover:underline">
              privacy@theresumecompany.com
            </a>
            .
          </p>

          {/* ── 13. Cookies ── */}
          <h2>13. Cookies and Tracking Technologies</h2>

          <h3>13.1 Cookies We Use</h3>
          <table>
            <thead>
              <tr>
                <th>Cookie</th>
                <th>Type</th>
                <th>Purpose</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>__Secure-next-auth.session-token</code></td>
                <td>Essential</td>
                <td>Authentication and session management</td>
                <td>30 days</td>
              </tr>
              <tr>
                <td><code>__Secure-next-auth.csrf-token</code></td>
                <td>Essential</td>
                <td>Cross-site request forgery protection</td>
                <td>Session</td>
              </tr>
              <tr>
                <td><code>__Secure-next-auth.callback-url</code></td>
                <td>Essential</td>
                <td>Redirect after authentication</td>
                <td>Session</td>
              </tr>
            </tbody>
          </table>
          <p>
            We use only <strong>essential cookies</strong> required for the Service to function.
            We do not use advertising cookies, tracking pixels, or third-party analytics cookies.
            Because these cookies are strictly necessary, no consent banner is required under GDPR
            (Recital 30, ePrivacy Directive Art. 5(3) exemption for necessary cookies).
          </p>

          <h3>13.2 Local Storage</h3>
          <p>
            We use browser localStorage and sessionStorage for client-side preferences (e.g., editor
            state, theme preference). This data never leaves your browser and is not transmitted to
            our servers.
          </p>

          {/* ── 14. Do Not Track ── */}
          <h2>14. Do Not Track</h2>
          <p>
            We respect Do Not Track (DNT) browser signals. Because we do not engage in third-party
            tracking or cross-site behavioral advertising, our practices are consistent with DNT
            preferences by default.
          </p>

          {/* ── 15. Third-Party Links ── */}
          <h2>15. Third-Party Links</h2>
          <p>
            The Service may contain links to third-party websites (e.g., LinkedIn, GitHub). We are
            not responsible for the privacy practices of these external sites. We encourage you to
            review their privacy policies before providing any personal information.
          </p>

          {/* ── 16. Changes ── */}
          <h2>16. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time to reflect changes in our practices,
            technology, legal requirements, or other factors. When we make material changes, we will:
          </p>
          <ul>
            <li>Update the &ldquo;Last updated&rdquo; date at the top of this page</li>
            <li>Notify you via email at the address associated with your account</li>
            <li>Display a prominent notice within the Service</li>
          </ul>
          <p>
            We encourage you to review this policy periodically. Your continued use of the Service
            after changes take effect constitutes acceptance of the updated policy.
          </p>

          {/* ── 17. Contact ── */}
          <h2>17. Contact Us</h2>
          <p>
            If you have questions, concerns, or requests related to this Privacy Policy or your
            personal data, please contact us:
          </p>
          <ul>
            <li>
              <strong>Email:</strong>{' '}
              <a href="mailto:privacy@theresumecompany.com" className="text-primary hover:underline">
                privacy@theresumecompany.com
              </a>
            </li>
            <li>
              <strong>General support:</strong>{' '}
              <a href="mailto:support@theresumecompany.com" className="text-primary hover:underline">
                support@theresumecompany.com
              </a>
            </li>
            <li>
              <strong>Contact page:</strong>{' '}
              <Link href="/contact" className="text-primary hover:underline">
                theresumecompany.com/contact
              </Link>
            </li>
          </ul>
          <p>
            We aim to respond to all privacy-related inquiries within <strong>30 days</strong>. For
            EEA residents exercising GDPR rights, we will respond within 30 days as required by law,
            with a possible extension of 60 additional days for complex requests (with notification).
          </p>
        </div>
      </div>
    </>
  )
}
