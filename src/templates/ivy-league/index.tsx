import { createSingleColumnTemplate } from '../single-column-base'

export const IvyLeague = createSingleColumnTemplate({
  headerLayout: 'centered',
  topAccent: (colors) => (
    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
      <div style={{ width: '80px', height: '2px', background: colors.primary }} />
    </div>
  ),
  dividerStyle: (colors) => ({
    borderBottom: `1px solid ${colors.textLight}40`,
    paddingBottom: '3px',
    marginBottom: '6px',
  }),
})
