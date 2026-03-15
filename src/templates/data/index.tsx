import { createSingleColumnTemplate } from '../single-column-base'

export const Data = createSingleColumnTemplate({
  headerLayout: 'left',
  topAccent: (colors) => (
    <div style={{ height: '3px', background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`, marginBottom: '14px', borderRadius: '2px' }} />
  ),
})
