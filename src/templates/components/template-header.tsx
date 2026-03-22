import type { PersonalInfo, TemplateColors, TemplateFonts } from '@/types'
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react'

interface TemplateHeaderProps {
  info: PersonalInfo
  colors: TemplateColors
  fonts: TemplateFonts
  layout?: 'centered' | 'left'
}

export function TemplateHeader({ info, colors, fonts, layout = 'left' }: TemplateHeaderProps) {
  const contactItems = [
    { key: 'email', value: info.email, icon: Mail },
    { key: 'phone', value: info.phone, icon: Phone },
    { key: 'location', value: info.location, icon: MapPin },
    { key: 'linkedin', value: info.linkedin, icon: Linkedin },
    { key: 'website', value: info.website ?? info.portfolio, icon: Globe },
  ].filter((item) => item.value?.trim())

  const isCentered = layout === 'centered'
  const hasPhoto = !!info.photoUrl

  return (
    <div style={{ textAlign: isCentered ? 'center' : 'left' }}>
      <div style={{ display: 'flex', alignItems: isCentered ? 'center' : 'flex-start', gap: '12px', flexDirection: isCentered ? 'column' : 'row' }}>
        {hasPhoto && (
          <img
            src={info.photoUrl}
            alt=""
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              objectFit: 'cover',
              flexShrink: 0,
              border: `2px solid ${colors.primary}`,
            }}
          />
        )}
        <div style={{ textAlign: isCentered ? 'center' : 'left' }}>
      {info.fullName && (
        <h1
          style={{ color: colors.text, fontFamily: fonts.heading, fontSize: '24px', fontWeight: 700, lineHeight: 1.2, margin: 0 }}
        >
          {info.fullName}
        </h1>
      )}
      {info.title && (
        <p style={{ color: colors.primary, fontFamily: fonts.body, fontSize: '14px', marginTop: '2px', margin: 0, marginBlockStart: '2px' }}>
          {info.title}
        </p>
      )}
      {contactItems.length > 0 && (
        <div
          style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '11px', color: colors.textLight, justifyContent: isCentered ? 'center' : 'flex-start' }}
        >
          {contactItems.map(({ key, value, icon: Icon }) => (
            <span key={key} style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              <Icon size={10} />
              {value}
            </span>
          ))}
        </div>
      )}
        </div>
      </div>
    </div>
  )
}
