import { createSingleColumnTemplate } from '../single-column-base'

export const QuantumBits = createSingleColumnTemplate({
  headerLayout: 'left',
  dividerStyle: (colors) => ({
    borderBottom: `1px dashed ${colors.primary}`,
    paddingBottom: '3px',
    marginBottom: '6px',
  }),
})
