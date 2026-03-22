import { createSingleColumnTemplate } from '../single-column-base'

export const Fintech = createSingleColumnTemplate({
  headerLayout: 'left',
  topAccent: (colors) => (
    <div style={{ height: '3px', background: colors.primary, marginBottom: '10px' }} />
  ),
})
