import { createSingleColumnTemplate } from '../single-column-base'

export const PaperCut = createSingleColumnTemplate({
  headerLayout: 'left',
  dividerStyle: (colors) => ({
    borderBottom: `1px solid ${colors.textLight}20`,
    paddingBottom: '3px',
    marginBottom: '6px',
  }),
})
