import { createSingleColumnTemplate } from '../single-column-base'

export const NonprofitMission = createSingleColumnTemplate({
  headerLayout: 'left',
  topAccent: (colors) => (
    <div style={{ height: '2px', background: colors.primary, marginBottom: '10px' }} />
  ),
})
