import { createSingleColumnTemplate } from '../single-column-base'

export const ZenGarden = createSingleColumnTemplate({
  headerLayout: 'centered',
  dividerStyle: () => ({
    borderBottom: 'none',
    paddingBottom: '0px',
    marginBottom: '2px',
  }),
  summaryStyle: (colors) => ({
    textAlign: 'center' as const,
    maxWidth: '85%',
    margin: '0 auto',
    padding: '8px 0',
    borderTop: `1px solid ${colors.textLight}20`,
    borderBottom: `1px solid ${colors.textLight}20`,
  }),
})
