import { createSingleColumnTemplate } from '../single-column-base'

export const PremiumEdge = createSingleColumnTemplate({
  headerLayout: 'left',
  topAccent: (colors) => (
    <div style={{ height: '5px', background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`, marginBottom: '14px', borderRadius: '2px' }} />
  ),
})
