import { createSingleColumnTemplate } from '../single-column-base'

export const EducatorClassic = createSingleColumnTemplate({
  headerLayout: 'centered',
  dividerStyle: (colors) => ({
    borderBottom: `2px solid ${colors.primary}`,
    paddingBottom: '3px',
    marginBottom: '8px',
  }),
})
