import { createSingleColumnTemplate } from '../single-column-base'

export const CleanLine = createSingleColumnTemplate({
  headerLayout: 'left',
  dividerStyle: (colors) => ({
    borderBottom: `1px solid ${colors.textLight}30`,
    paddingBottom: '2px',
    marginBottom: '6px',
  }),
})
