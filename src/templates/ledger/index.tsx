import { createSingleColumnTemplate } from '../single-column-base'

export const Ledger = createSingleColumnTemplate({
  headerLayout: 'left',
  dividerStyle: (colors) => ({
    borderBottom: `1.5px solid ${colors.primary}`,
    paddingBottom: '4px',
    marginBottom: '8px',
  }),
})
