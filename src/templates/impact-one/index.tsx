import { createSingleColumnTemplate } from '../single-column-base'

export const ImpactOne = createSingleColumnTemplate({
  headerLayout: 'left',
  topAccent: (colors) => (
    <div style={{ background: colors.primary, padding: '14px 16px', marginBottom: '14px', borderRadius: '4px' }}>
      <div style={{ fontSize: '10px', color: '#ffffff80', letterSpacing: '2px', textTransform: 'uppercase' as const }}>Resume</div>
    </div>
  ),
})
