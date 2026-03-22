import { createSingleColumnTemplate } from '../single-column-base'

export const ZenMaster = createSingleColumnTemplate({
  headerLayout: 'centered',
  dividerStyle: () => ({
    borderBottom: 'none',
    paddingBottom: '0px',
    marginBottom: '4px',
  }),
})
