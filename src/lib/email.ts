/**
 * Email client using Resend.
 * Handles transactional + lifecycle emails.
 */

import { Resend } from 'resend'

let _resend: Resend | null = null

function getResend(): Resend {
  if (_resend) return _resend
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) throw new Error('RESEND_API_KEY is not configured')
  _resend = new Resend(apiKey)
  return _resend
}

const FROM_EMAIL = 'MyResumeCompany <noreply@myresumecompany.com>'

// ─── Password Reset Email ───

export async function sendPasswordResetEmail(
  to: string,
  token: string,
): Promise<void> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://myresumecompany.com'
  const resetUrl = `${appUrl}/reset-password?token=${token}`

  const resend = getResend()

  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: 'Reset your password — MyResumeCompany',
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0; padding:0; background:#f8fafc; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:560px; margin:40px auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 1px 3px rgba(0,0,0,0.1);">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#0f172a,#1e293b); padding:32px 40px; text-align:center;">
      <h1 style="margin:0; color:#f8fafc; font-size:22px; font-weight:700; letter-spacing:-0.5px;">MyResumeCompany</h1>
    </div>

    <!-- Body -->
    <div style="padding:40px;">
      <h2 style="margin:0 0 16px; color:#0f172a; font-size:20px; font-weight:600;">Reset your password</h2>
      <p style="margin:0 0 24px; color:#475569; font-size:15px; line-height:1.6;">
        We received a request to reset your password. Click the button below to choose a new one. This link expires in <strong>1 hour</strong>.
      </p>

      <!-- CTA Button -->
      <div style="text-align:center; margin:32px 0;">
        <a href="${resetUrl}"
           style="display:inline-block; padding:14px 32px; background:#0f172a; color:#ffffff; text-decoration:none; font-size:15px; font-weight:600; border-radius:8px;">
          Reset Password
        </a>
      </div>

      <p style="margin:0 0 16px; color:#64748b; font-size:13px; line-height:1.5;">
        If the button doesn't work, copy and paste this link into your browser:
      </p>
      <p style="margin:0 0 24px; word-break:break-all; color:#3b82f6; font-size:13px;">
        ${resetUrl}
      </p>

      <hr style="border:none; border-top:1px solid #e2e8f0; margin:24px 0;">

      <p style="margin:0; color:#94a3b8; font-size:12px; line-height:1.5;">
        If you didn't request this, you can safely ignore this email. Your password won't change unless you click the link above.
      </p>
    </div>

    <!-- Footer -->
    <div style="padding:20px 40px; background:#f8fafc; text-align:center;">
      <p style="margin:0; color:#94a3b8; font-size:12px;">
        &copy; ${new Date().getFullYear()} MyResumeCompany. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>`,
  })
}

// ─── Welcome Email ───

export async function sendWelcomeEmail(
  to: string,
  name: string,
): Promise<void> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://myresumecompany.com'

  const resend = getResend()

  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: 'Welcome to MyResumeCompany — your 100 free credits are ready',
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0; padding:0; background:#f8fafc; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:560px; margin:40px auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 1px 3px rgba(0,0,0,0.1);">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#0f172a,#1e293b); padding:32px 40px; text-align:center;">
      <h1 style="margin:0; color:#f8fafc; font-size:22px; font-weight:700; letter-spacing:-0.5px;">MyResumeCompany</h1>
    </div>

    <!-- Body -->
    <div style="padding:40px;">
      <h2 style="margin:0 0 16px; color:#0f172a; font-size:20px; font-weight:600;">Welcome, ${esc(name)}!</h2>
      <p style="margin:0 0 16px; color:#475569; font-size:15px; line-height:1.6;">
        Your account is ready with <strong>100 free credits</strong>. That's enough to generate a full AI resume, scan it for ATS compatibility, and export a pixel-perfect PDF.
      </p>

      <p style="margin:0 0 24px; color:#475569; font-size:15px; line-height:1.6;">Here's what you can do:</p>

      <ul style="margin:0 0 24px; padding-left:20px; color:#475569; font-size:14px; line-height:1.8;">
        <li>Pick from 15 professional templates</li>
        <li>Let AI write your bullet points and summary</li>
        <li>Score your resume against any job description</li>
        <li>Export a clean PDF that passes ATS systems</li>
      </ul>

      <!-- CTA Button -->
      <div style="text-align:center; margin:32px 0;">
        <a href="${appUrl}/dashboard"
           style="display:inline-block; padding:14px 32px; background:#0f172a; color:#ffffff; text-decoration:none; font-size:15px; font-weight:600; border-radius:8px;">
          Go to Dashboard
        </a>
      </div>

      <p style="margin:0; color:#94a3b8; font-size:12px; line-height:1.5;">
        Questions? Reply to this email or visit <a href="${appUrl}/contact" style="color:#3b82f6;">our contact page</a>.
      </p>
    </div>

    <!-- Footer -->
    <div style="padding:20px 40px; background:#f8fafc; text-align:center;">
      <p style="margin:0; color:#94a3b8; font-size:12px;">
        &copy; ${new Date().getFullYear()} MyResumeCompany. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>`,
  })
}

// ─── HTML Escape (prevent XSS in email templates) ───

function esc(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

// ─── Email Shell Helper ───

function emailShell(title: string, body: string): string {
  const year = new Date().getFullYear()
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://myresumecompany.com'
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<div style="max-width:560px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
<div style="background:linear-gradient(135deg,#0f172a,#1e293b);padding:32px 40px;text-align:center;">
<h1 style="margin:0;color:#f8fafc;font-size:22px;font-weight:700;letter-spacing:-0.5px;">MyResumeCompany</h1>
</div>
<div style="padding:40px;">
<h2 style="margin:0 0 16px;color:#0f172a;font-size:20px;font-weight:600;">${title}</h2>
${body}
</div>
<div style="padding:20px 40px;background:#f8fafc;text-align:center;">
<p style="margin:0;color:#94a3b8;font-size:12px;">&copy; ${year} MyResumeCompany. <a href="${appUrl}/unsubscribe" style="color:#94a3b8;">Unsubscribe</a></p>
</div>
</div></body></html>`
}

function ctaButton(text: string, href: string): string {
  return `<div style="text-align:center;margin:32px 0;"><a href="${href}" style="display:inline-block;padding:14px 32px;background:#0f172a;color:#fff;text-decoration:none;font-size:15px;font-weight:600;border-radius:8px;">${text}</a></div>`
}

function p(text: string): string {
  return `<p style="margin:0 0 16px;color:#475569;font-size:15px;line-height:1.6;">${text}</p>`
}

// ─── Onboarding Drip Emails (5 emails over 7 days) ───

export const ONBOARDING_EMAILS: { day: number; subject: string; builder: (name: string, appUrl: string) => string }[] = [
  {
    day: 1,
    subject: 'Pick a template that fits your industry',
    builder: (name, appUrl) => emailShell(`Choose your template, ${esc(name)}`,
      p('We have 15 professionally designed templates across 7 categories: Professional, Modern, Creative, Tech, ATS-Optimized, Academic, and Minimal.')
      + p('Each template is tested with real ATS systems. Pick one that matches your industry and start customizing.')
      + ctaButton('Browse Templates', `${appUrl}/templates`)
      + p('<strong>Tip:</strong> Not sure which to pick? Classic Professional works for any industry.')),
  },
  {
    day: 2,
    subject: 'Let AI write your bullet points in seconds',
    builder: (name, appUrl) => emailShell(`Write better bullets, ${esc(name)}`,
      p('Struggling with bullet points? Our AI Bullet Writer generates achievement-focused bullets with real metrics — just enter your job title and company.')
      + p('It uses the STAR format (Situation, Task, Action, Result) that recruiters love. Each generation costs just 10 credits.')
      + ctaButton('Try the AI Writer', `${appUrl}/dashboard`)),
  },
  {
    day: 4,
    subject: 'Score your resume against any job description',
    builder: (name, appUrl) => emailShell(`Check your ATS score, ${esc(name)}`,
      p('75% of resumes are filtered out by ATS before a human ever sees them.')
      + p('Our ATS Scanner scores your resume 0-100 against any job description. It shows exactly which keywords you\'re missing.')
      + ctaButton('Scan Your Resume', `${appUrl}/dashboard`)
      + p('After scanning, use the <strong>ATS Optimizer</strong> to automatically rewrite your bullets to match the job.')),
  },
  {
    day: 6,
    subject: 'Generate a cover letter in 30 seconds',
    builder: (name, appUrl) => emailShell(`Cover letters made easy, ${esc(name)}`,
      p('Our AI Cover Letter Generator creates personalized letters based on your resume + the job description.')
      + p('Choose your tone (Professional, Enthusiastic, or Conversational) and length. Edit, then copy or download.')
      + ctaButton('Generate a Cover Letter', `${appUrl}/dashboard`)),
  },
  {
    day: 7,
    subject: 'Unlock unlimited AI with Pro',
    builder: (name, appUrl) => emailShell(`Running low on credits, ${esc(name)}?`,
      p('You started with 100 free credits. <strong>Pro</strong> gives you unlimited AI usage + 500 monthly credits for just $12/month.')
      + `<div style="margin:24px 0;padding:20px;background:#f0fdf4;border-radius:8px;border:1px solid #bbf7d0;">
<p style="margin:0 0 8px;color:#166534;font-size:14px;font-weight:600;">Pro includes:</p>
<ul style="margin:0;padding-left:20px;color:#166534;font-size:14px;line-height:1.8;">
<li>Unlimited AI features</li><li>Unlimited PDF & DOCX exports</li><li>500 bonus credits/month</li></ul></div>`
      + ctaButton('Upgrade to Pro — $12/mo', `${appUrl}/credits`)),
  },
]

// ─── Low Credits Email ───

export async function sendLowCreditsEmail(to: string, name: string, credits: number): Promise<void> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://myresumecompany.com'
  await getResend().emails.send({
    from: FROM_EMAIL, to,
    subject: `You have ${credits} credits left — MyResumeCompany`,
    html: emailShell('You\'re running low on credits',
      p(`Hi ${esc(name)}, you have <strong>${credits} credits</strong> remaining.`)
      + `<div style="margin:24px 0;padding:16px;background:#fef3c7;border-radius:8px;border:1px solid #fde68a;">
<p style="margin:0;color:#92400e;font-size:14px;">Credit costs: Bullets (10) · Summary (10) · ATS Scan (15) · PDF Export (30)</p></div>`
      + p('Top up with a credit pack or upgrade to Pro for unlimited AI.')
      + ctaButton('Get More Credits', `${appUrl}/credits`)),
  })
}

// ─── Referral Reward Email ───

export async function sendReferralRewardEmail(to: string, name: string, friendName: string): Promise<void> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://myresumecompany.com'
  await getResend().emails.send({
    from: FROM_EMAIL, to,
    subject: 'You earned 50 bonus credits!',
    html: emailShell('50 bonus credits added!',
      p(`Hi ${esc(name)}, your friend <strong>${esc(friendName)}</strong> just signed up using your referral link. We've added <strong>50 bonus credits</strong> to your account.`)
      + p('Keep sharing — you earn 50 credits for every friend who joins.')
      + ctaButton('View Your Credits', `${appUrl}/credits`)),
  })
}

// ─── Onboarding Drip Sender ───

export async function sendOnboardingEmail(to: string, name: string, step: number): Promise<void> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://myresumecompany.com'
  const email = ONBOARDING_EMAILS.find((e) => e.day === step)
  if (!email) return
  await getResend().emails.send({
    from: FROM_EMAIL, to,
    subject: email.subject,
    html: email.builder(name, appUrl),
  })
}

// ─── Newsletter Welcome ───

export async function sendNewsletterWelcomeEmail(to: string): Promise<void> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://myresumecompany.com'
  await getResend().emails.send({
    from: FROM_EMAIL, to,
    subject: 'Welcome to the MyResumeCompany newsletter',
    html: emailShell('You\'re subscribed!',
      p('Thanks for subscribing. We\'ll send you resume tips, job search advice, and product updates — no spam, ever.')
      + `<ul style="margin:0 0 24px;padding-left:20px;color:#475569;font-size:14px;line-height:1.8;">
<li><a href="${appUrl}/blog/how-to-write-resume-bullet-points" style="color:#3b82f6;">How to Write Resume Bullet Points That Get Interviews</a></li>
<li><a href="${appUrl}/blog/what-is-ats" style="color:#3b82f6;">What Is an ATS?</a></li></ul>`
      + ctaButton('Build Your Resume', `${appUrl}/signup`)),
  })
}
