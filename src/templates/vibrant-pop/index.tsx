import { createSingleColumnTemplate } from '../single-column-base'

export const VibrantPop = createSingleColumnTemplate({
  headerLayout: 'left',
  topAccent: (colors) => (
    <div style={{ height: '6px', background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary}, ${colors.primary})`, marginBottom: '14px', borderRadius: '3px' }} />
  ),
})
