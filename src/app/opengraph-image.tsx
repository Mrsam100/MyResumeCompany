import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'TheResumeCompany — AI Resume Builder'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #3b82f6)',
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 24,
          }}
        >
          {/* Logo area */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 14,
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: 28,
                fontWeight: 700,
              }}
            >
              R
            </div>
            <span
              style={{
                fontSize: 42,
                fontWeight: 700,
                color: '#f8fafc',
                letterSpacing: -1,
              }}
            >
              TheResumeCompany
            </span>
          </div>

          {/* Tagline */}
          <p
            style={{
              fontSize: 28,
              color: '#94a3b8',
              textAlign: 'center',
              maxWidth: 700,
              lineHeight: 1.4,
            }}
          >
            AI-Powered Resume Builder
          </p>

          {/* Feature pills */}
          <div
            style={{
              display: 'flex',
              gap: 16,
              marginTop: 16,
            }}
          >
            {['15 Templates', 'AI Writer', 'ATS Scanner', 'PDF Export'].map(
              (feature) => (
                <div
                  key={feature}
                  style={{
                    padding: '10px 24px',
                    borderRadius: 999,
                    background: 'rgba(59, 130, 246, 0.15)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    color: '#93c5fd',
                    fontSize: 18,
                    fontWeight: 500,
                  }}
                >
                  {feature}
                </div>
              ),
            )}
          </div>

          {/* Bottom text */}
          <p
            style={{
              fontSize: 20,
              color: '#64748b',
              marginTop: 24,
            }}
          >
            Free to start · No credit card required
          </p>
        </div>
      </div>
    ),
    { ...size },
  )
}
