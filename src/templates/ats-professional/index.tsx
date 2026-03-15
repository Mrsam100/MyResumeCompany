import { createSingleColumnTemplate } from '../single-column-base'

export const ATSProfessional = createSingleColumnTemplate({
  headerLayout: 'left',
  topAccent: (colors) => (
    <div style={{ height: '2px', backgroundColor: colors.primary, marginBottom: '14px' }} />
  ),
})
