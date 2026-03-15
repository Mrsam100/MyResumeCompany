import { nanoid } from 'nanoid'
import type { ResumeContent } from '@/types/resume'

export function createDefaultResumeContent(): ResumeContent {
  return {
    personalInfo: {
      fullName: '',
      title: '',
      email: '',
      phone: '',
      location: '',
      summary: '',
    },
    sections: [
      {
        id: nanoid(10),
        type: 'experience',
        title: 'Work Experience',
        visible: true,
        entries: [],
      },
      {
        id: nanoid(10),
        type: 'education',
        title: 'Education',
        visible: true,
        entries: [],
      },
      {
        id: nanoid(10),
        type: 'skills',
        title: 'Skills',
        visible: true,
        entries: [],
      },
      {
        id: nanoid(10),
        type: 'projects',
        title: 'Projects',
        visible: true,
        entries: [],
      },
    ],
  }
}
