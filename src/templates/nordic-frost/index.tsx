import { createSingleColumnTemplate } from '../single-column-base'

export const NordicFrost = createSingleColumnTemplate({
  headerLayout: 'left',
  topAccent: (colors) => (
    <div style={{ width: '40px', height: '3px', background: colors.primary, marginBottom: '12px' }} />
  ),
})
