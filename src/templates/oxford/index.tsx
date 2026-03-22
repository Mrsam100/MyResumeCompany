import { createSingleColumnTemplate } from '../single-column-base'

export const Oxford = createSingleColumnTemplate({
  headerLayout: 'centered',
  topAccent: (colors) => (
    <div style={{ height: '4px', background: colors.primary, marginBottom: '16px' }} />
  ),
  dividerStyle: (colors) => ({
    borderBottom: `1px solid ${colors.primary}`,
    paddingBottom: '3px',
    marginBottom: '6px',
  }),
})
