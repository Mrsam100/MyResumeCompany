import { createSingleColumnTemplate } from '../single-column-base'

export const HeritageSerif = createSingleColumnTemplate({
  headerLayout: 'centered',
  dividerStyle: (colors) => ({
    borderBottom: `1.5px solid ${colors.primary}`,
    paddingBottom: '3px',
    marginBottom: '8px',
  }),
  summaryStyle: (colors) => ({
    borderTop: `1px solid ${colors.textLight}30`,
    borderBottom: `1px solid ${colors.textLight}30`,
    padding: '10px 0',
    fontStyle: 'italic' as const,
  }),
})
