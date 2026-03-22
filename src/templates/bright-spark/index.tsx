import { createSingleColumnTemplate } from '../single-column-base'

export const BrightSpark = createSingleColumnTemplate({
  headerLayout: 'left',
  dividerStyle: (colors) => ({
    borderBottom: `2px solid ${colors.secondary}`,
    paddingBottom: '2px',
    marginBottom: '6px',
  }),
})
