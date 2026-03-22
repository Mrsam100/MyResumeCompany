import { createSingleColumnTemplate } from '../single-column-base'

export const LegalBrief = createSingleColumnTemplate({
  headerLayout: 'centered',
  dividerStyle: (colors) => ({
    borderBottom: `1px solid ${colors.text}`,
    paddingBottom: '3px',
    marginBottom: '6px',
  }),
})
