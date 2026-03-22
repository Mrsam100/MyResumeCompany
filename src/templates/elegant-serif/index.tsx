import { createSingleColumnTemplate } from '../single-column-base'

export const ElegantSerif = createSingleColumnTemplate({
  headerLayout: 'centered',
  dividerStyle: (colors) => ({
    borderBottom: `2px double ${colors.primary}`,
    paddingBottom: '4px',
    marginBottom: '8px',
  }),
})
