import { createSingleColumnTemplate } from '../single-column-base'

export const CyberMatrix = createSingleColumnTemplate({
  headerLayout: 'left',
  topAccent: (colors) => (
    <div style={{ borderBottom: `2px solid ${colors.primary}`, marginBottom: '12px', paddingBottom: '4px', fontFamily: 'monospace', fontSize: '8px', color: colors.primary, opacity: 0.5 }}>
      {'// system.resume.render()'}
    </div>
  ),
})
