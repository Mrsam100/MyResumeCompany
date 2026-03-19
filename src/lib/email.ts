/**
 * Email client using Resend.
 * Handles transactional emails: password reset, welcome, receipts.
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

const FROM_EMAIL = 'TheResumeCompany <noreply@theresumecompany.com>'

// ─── Password Reset Email ───

export async function sendPasswordResetEmail(
  to: string,
  token: string,
): Promise<void> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://theresumecompany.com'
  const resetUrl = `${appUrl}/reset-password?token=${token}`

  const resend = getResend()

  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: 'Reset your password — TheResumeCompany',
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
      <h1 style="margin:0; color:#f8fafc; font-size:22px; font-weight:700; letter-spacing:-0.5px;">TheResumeCompany</h1>
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
        &copy; ${new Date().getFullYear()} TheResumeCompany. All rights reserved.
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
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://theresumecompany.com'

  const resend = getResend()

  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: 'Welcome to TheResumeCompany — your 100 free credits are ready',
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
      <h1 style="margin:0; color:#f8fafc; font-size:22px; font-weight:700; letter-spacing:-0.5px;">TheResumeCompany</h1>
    </div>

    <!-- Body -->
    <div style="padding:40px;">
      <h2 style="margin:0 0 16px; color:#0f172a; font-size:20px; font-weight:600;">Welcome, ${name}!</h2>
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
        &copy; ${new Date().getFullYear()} TheResumeCompany. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>`,
  })
}
