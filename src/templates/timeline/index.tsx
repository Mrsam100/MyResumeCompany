import { createSingleColumnTemplate } from '../single-column-base'

export const Timeline = createSingleColumnTemplate({
  headerLayout: 'left',
  dividerStyle: (colors) => ({
    borderLeft: `3px solid ${colors.primary}`,
    paddingLeft: '10px',
    paddingBottom: '0px',
    marginBottom: '4px',
  }),
})
