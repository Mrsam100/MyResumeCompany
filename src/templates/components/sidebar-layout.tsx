import type { TemplateColors, TemplateFonts, TemplateSpacing } from '@/types'

interface SidebarLayoutProps {
  colors: TemplateColors
  fonts: TemplateFonts
  spacing: TemplateSpacing
  sidebar: React.ReactNode
  main: React.ReactNode
  side?: 'left' | 'right'
}

export function SidebarLayout({ colors, spacing, sidebar, main, side = 'left' }: SidebarLayoutProps) {
  const sidebarStyle: React.CSSProperties = {
    width: '35%',
    backgroundColor: colors.sidebarBg ?? colors.primary,
    color: colors.sidebarText ?? '#ffffff',
    padding: `${spacing.margins}px`,
  }

  const mainStyle: React.CSSProperties = {
    width: '65%',
    backgroundColor: colors.background,
    color: colors.text,
    padding: `${spacing.margins}px`,
  }

  return (
    <div style={{ display: 'flex', width: '100%', minHeight: '100%' }}>
      {side === 'left' ? (
        <>
          <div style={sidebarStyle}>{sidebar}</div>
          <div style={mainStyle}>{main}</div>
        </>
      ) : (
        <>
          <div style={mainStyle}>{main}</div>
          <div style={sidebarStyle}>{sidebar}</div>
        </>
      )}
    </div>
  )
}
