import { createSingleColumnTemplate } from '../single-column-base'

export const Catalyst = createSingleColumnTemplate({
  headerLayout: 'left',
  topAccent: (colors) => (
    <div style={{ display: 'flex', gap: '3px', marginBottom: '12px' }}>
      <div style={{ flex: 3, height: '4px', background: colors.primary, borderRadius: '2px' }} />
      <div style={{ flex: 1, height: '4px', background: colors.secondary, borderRadius: '2px' }} />
    </div>
  ),
})
