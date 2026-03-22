import { createSingleColumnTemplate } from '../single-column-base'

export const Mosaic = createSingleColumnTemplate({
  headerLayout: 'left',
  topAccent: (colors) => (
    <div style={{ display: 'flex', gap: '2px', marginBottom: '12px' }}>
      {[colors.primary, colors.secondary, colors.primary, colors.secondary, colors.primary].map((c, i) => (
        <div key={i} style={{ flex: 1, height: '4px', background: c, opacity: 1 - i * 0.15 }} />
      ))}
    </div>
  ),
})
