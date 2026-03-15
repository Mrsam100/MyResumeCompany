import { createSingleColumnTemplate } from '../single-column-base'

export const Metro = createSingleColumnTemplate({
  headerLayout: 'left',
  topAccent: (colors) => (
    <div style={{ height: '6px', backgroundColor: colors.primary, marginBottom: '16px', borderRadius: '3px' }} />
  ),
})
