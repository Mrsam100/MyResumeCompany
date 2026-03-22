import { createSingleColumnTemplate } from '../single-column-base'

export const PixelArt = createSingleColumnTemplate({
  headerLayout: 'left',
  dividerStyle: (colors) => ({
    borderBottom: `3px dotted ${colors.primary}`,
    paddingBottom: '4px',
    marginBottom: '8px',
  }),
})
