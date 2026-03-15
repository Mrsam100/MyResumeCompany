import { createSingleColumnTemplate } from '../single-column-base'

export const Designer = createSingleColumnTemplate({
  headerLayout: 'left',
  topAccent: (colors) => (
    <div style={{ display: 'flex', gap: '4px', marginBottom: '14px' }}>
      <div style={{ width: '40px', height: '4px', backgroundColor: colors.primary, borderRadius: '2px' }} />
      <div style={{ width: '20px', height: '4px', backgroundColor: colors.secondary, borderRadius: '2px' }} />
      <div style={{ width: '10px', height: '4px', backgroundColor: `${colors.primary}40`, borderRadius: '2px' }} />
    </div>
  ),
})
