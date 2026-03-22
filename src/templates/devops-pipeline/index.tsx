import { createSingleColumnTemplate } from '../single-column-base'

export const DevopsPipeline = createSingleColumnTemplate({
  headerLayout: 'left',
  topAccent: (colors) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '12px' }}>
      {['○', '─', '●', '─', '○', '─', '●'].map((s, i) => (
        <span key={i} style={{ color: i % 2 === 0 ? colors.primary : colors.secondary, fontSize: '10px', fontFamily: 'monospace' }}>{s}</span>
      ))}
    </div>
  ),
})
