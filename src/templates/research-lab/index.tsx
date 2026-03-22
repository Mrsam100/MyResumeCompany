import { createSingleColumnTemplate } from '../single-column-base'

export const ResearchLab = createSingleColumnTemplate({
  headerLayout: 'left',
  dividerStyle: (colors) => ({
    borderBottom: `1.5px solid ${colors.primary}`,
    paddingBottom: '3px',
    marginBottom: '6px',
  }),
})
