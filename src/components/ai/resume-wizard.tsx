'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, Loader2, ArrowLeft, ArrowRight, Plus, Trash2, GraduationCap, Briefcase, Target, Lightbulb, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'
import { nanoid } from 'nanoid'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface Position {
  id: string
  title: string
  company: string
  duration: string
  description: string
}

interface WizardData {
  targetRole: string
  industry: string
  experienceLevel: string
  positions: Position[]
  education: {
    degree: string
    school: string
    field: string
    graduationYear: string
  }
  skills: string[]
  goals: string
}

const STEPS = [
  { label: 'Target Role', icon: Target },
  { label: 'Experience', icon: Briefcase },
  { label: 'Education', icon: GraduationCap },
  { label: 'Skills', icon: Lightbulb },
  { label: 'Generate', icon: Sparkles },
]

const EXPERIENCE_LEVELS = [
  'Entry Level (0-2 years)',
  'Mid Level (3-5 years)',
  'Senior (6-10 years)',
  'Lead / Principal (10+ years)',
  'Executive / Director',
]

function createEmptyPosition(): Position {
  return { id: nanoid(10), title: '', company: '', duration: '', description: '' }
}

interface ResumeWizardProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ResumeWizard({ open, onOpenChange }: ResumeWizardProps) {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [generating, setGenerating] = useState(false)
  const [skillInput, setSkillInput] = useState('')

  const [data, setData] = useState<WizardData>({
    targetRole: '',
    industry: '',
    experienceLevel: '',
    positions: [createEmptyPosition()],
    education: { degree: '', school: '', field: '', graduationYear: '' },
    skills: [],
    goals: '',
  })

  function updateField<K extends keyof WizardData>(key: K, value: WizardData[K] | ((prev: WizardData[K]) => WizardData[K])) {
    setData((prev) => ({
      ...prev,
      [key]: typeof value === 'function' ? (value as (prev: WizardData[K]) => WizardData[K])(prev[key]) : value,
    }))
  }

  function updatePosition(id: string, field: keyof Position, value: string) {
    setData((prev) => ({
      ...prev,
      positions: prev.positions.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    }))
  }

  function addPosition() {
    if (data.positions.length >= 5) return
    setData((prev) => ({ ...prev, positions: [...prev.positions, createEmptyPosition()] }))
  }

  function removePosition(id: string) {
    if (data.positions.length <= 1) return
    setData((prev) => ({ ...prev, positions: prev.positions.filter((p) => p.id !== id) }))
  }

  function addSkill(skill: string) {
    const trimmed = skill.trim()
    if (!trimmed || data.skills.includes(trimmed) || data.skills.length >= 30) return
    updateField('skills', [...data.skills, trimmed])
    setSkillInput('')
  }

  function removeSkill(skill: string) {
    updateField('skills', data.skills.filter((s) => s !== skill))
  }

  function canProceed(): boolean {
    switch (step) {
      case 0: return !!data.targetRole.trim() && !!data.experienceLevel
      case 1: return data.positions.some((p) => p.title.trim() && p.company.trim())
      case 2: return !!data.education.degree.trim() && !!data.education.school.trim()
      case 3: return data.skills.length >= 3
      default: return true
    }
  }

  async function handleGenerate() {
    setGenerating(true)
    try {
      // Create a blank resume first
      const createRes = await fetch('/api/resumes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: `${data.targetRole} Resume` }),
      })

      if (!createRes.ok) {
        toast.error('Failed to create resume')
        return
      }

      const { resume } = await createRes.json()

      // Generate AI content
      const aiRes = await fetch('/api/ai/full-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetRole: data.targetRole,
          industry: data.industry || undefined,
          experienceLevel: data.experienceLevel,
          positions: data.positions.filter((p) => p.title.trim() && p.company.trim()),
          education: data.education,
          skills: data.skills,
          goals: data.goals || undefined,
        }),
      })

      if (aiRes.status === 402) {
        // Clean up orphaned resume
        await fetch(`/api/resumes/${resume.id}`, { method: 'DELETE' }).catch(() => {})
        toast.error('Not enough credits (40 required)')
        return
      }

      if (aiRes.status === 429) {
        await fetch(`/api/resumes/${resume.id}`, { method: 'DELETE' }).catch(() => {})
        toast.error('Rate limit exceeded. Please try again later.')
        return
      }

      if (!aiRes.ok) {
        // Clean up orphaned resume
        await fetch(`/api/resumes/${resume.id}`, { method: 'DELETE' }).catch(() => {})
        const errData = await aiRes.json().catch(() => null)
        toast.error(errData?.error || 'AI generation failed. Please try again.')
        return
      }

      const { resume: aiResume } = await aiRes.json()

      // Merge AI content into the created resume
      const content = {
        personalInfo: {
          fullName: '',
          title: aiResume.personalInfo.title || data.targetRole,
          email: '',
          phone: '',
          location: '',
          summary: aiResume.personalInfo.summary || '',
        },
        sections: (aiResume.sections || []).map((section: { type: string; title: string; entries: Array<{ fields: Record<string, string>; bulletPoints: string[]; startDate?: string; endDate?: string; current?: boolean }> }) => ({
          id: nanoid(10),
          type: section.type,
          title: section.title,
          visible: true,
          entries: (section.entries || []).map((entry: { fields: Record<string, string>; bulletPoints: string[]; startDate?: string; endDate?: string; current?: boolean }) => ({
            id: nanoid(10),
            fields: entry.fields || {},
            bulletPoints: entry.bulletPoints || [],
            startDate: entry.startDate,
            endDate: entry.endDate,
            current: entry.current,
          })),
        })),
      }

      // Save the AI content to the resume
      const saveRes = await fetch(`/api/resumes/${resume.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })

      if (!saveRes.ok) {
        toast.error('Failed to save generated resume. Please try again.')
        return
      }

      toast.success('Resume generated! Redirecting to editor...')
      onOpenChange(false)
      router.push(`/editor/${resume.id}`)
    } catch {
      toast.error('Something went wrong')
    } finally {
      setGenerating(false)
    }
  }

  function resetWizard() {
    setStep(0)
    setData({
      targetRole: '',
      industry: '',
      experienceLevel: '',
      positions: [createEmptyPosition()],
      education: { degree: '', school: '', field: '', graduationYear: '' },
      skills: [],
      goals: '',
    })
    setSkillInput('')
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (!generating) {
          onOpenChange(val)
          if (!val) resetWizard()
        }
      }}
    >
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Resume with AI</DialogTitle>
          <DialogDescription>
            Answer a few questions and AI will generate a complete resume (40 credits)
          </DialogDescription>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-between px-2">
          {STEPS.map((s, i) => {
            const Icon = s.icon
            return (
              <div key={i} className="flex flex-col items-center gap-1">
                <div
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full transition-colors',
                    i < step ? 'bg-green-500 text-white' :
                    i === step ? 'bg-primary text-primary-foreground' :
                    'bg-muted text-muted-foreground',
                  )}
                >
                  {i < step ? <CheckCircle className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                </div>
                <span className={cn('text-[10px]', i === step ? 'font-semibold text-primary' : 'text-muted-foreground')}>
                  {s.label}
                </span>
              </div>
            )
          })}
        </div>

        {/* Step Content */}
        <div className="min-h-[240px] space-y-4 py-2">
          {/* Step 0: Target Role */}
          {step === 0 && (
            <>
              <div>
                <Label className="mb-1.5 text-xs">Target Role *</Label>
                <Input
                  value={data.targetRole}
                  onChange={(e) => updateField('targetRole', e.target.value)}
                  placeholder="Senior Software Engineer"
                  autoFocus
                />
              </div>
              <div>
                <Label className="mb-1.5 text-xs">Industry (optional)</Label>
                <Input
                  value={data.industry}
                  onChange={(e) => updateField('industry', e.target.value)}
                  placeholder="Technology, Healthcare, Finance..."
                />
              </div>
              <div>
                <Label className="mb-1.5 text-xs">Experience Level *</Label>
                <Select value={data.experienceLevel} onValueChange={(val) => { if (val) updateField('experienceLevel', val) }}>
                  <SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger>
                  <SelectContent>
                    {EXPERIENCE_LEVELS.map((level) => (
                      <SelectItem key={level} value={level}>{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {/* Step 1: Experience */}
          {step === 1 && (
            <>
              <p className="text-xs text-muted-foreground">Add your recent positions (1-5). A brief description is enough — AI will expand it.</p>
              {data.positions.map((pos, i) => (
                <div key={pos.id} className="space-y-2 rounded-lg border p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground">Position {i + 1}</span>
                    {data.positions.length > 1 && (
                      <button onClick={() => removePosition(pos.id)} className="text-muted-foreground/50 hover:text-destructive" aria-label={`Remove position ${i + 1}`}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <Input placeholder="Job Title *" value={pos.title} onChange={(e) => updatePosition(pos.id, 'title', e.target.value)} />
                    <Input placeholder="Company *" value={pos.company} onChange={(e) => updatePosition(pos.id, 'company', e.target.value)} />
                  </div>
                  <Input placeholder="Duration (e.g., 2 years)" value={pos.duration} onChange={(e) => updatePosition(pos.id, 'duration', e.target.value)} />
                  <Textarea
                    placeholder="Brief description of your role (1 sentence)"
                    value={pos.description}
                    onChange={(e) => updatePosition(pos.id, 'description', e.target.value)}
                    rows={2}
                    className="resize-none text-sm"
                  />
                </div>
              ))}
              {data.positions.length < 5 && (
                <Button variant="outline" size="sm" className="w-full gap-1.5 border-dashed" onClick={addPosition}>
                  <Plus className="h-4 w-4" /> Add Another Position
                </Button>
              )}
            </>
          )}

          {/* Step 2: Education */}
          {step === 2 && (
            <>
              <div>
                <Label className="mb-1.5 text-xs">Degree *</Label>
                <Select
                  value={data.education.degree}
                  onValueChange={(val) => { if (val) updateField('education', (prev) => ({ ...prev, degree: val })) }}
                >
                  <SelectTrigger><SelectValue placeholder="Select degree" /></SelectTrigger>
                  <SelectContent>
                    {['High School Diploma', 'Associate Degree', "Bachelor's Degree", "Master's Degree", 'PhD / Doctorate', 'Professional Certificate', 'Other'].map((d) => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="mb-1.5 text-xs">School / University *</Label>
                <Input
                  value={data.education.school}
                  onChange={(e) => { const v = e.target.value; updateField('education', (prev) => ({ ...prev, school: v })) }}
                  placeholder="Stanford University"
                />
              </div>
              <div>
                <Label className="mb-1.5 text-xs">Field of Study</Label>
                <Input
                  value={data.education.field}
                  onChange={(e) => { const v = e.target.value; updateField('education', (prev) => ({ ...prev, field: v })) }}
                  placeholder="Computer Science"
                />
              </div>
              <div>
                <Label className="mb-1.5 text-xs">Graduation Year *</Label>
                <Input
                  value={data.education.graduationYear}
                  onChange={(e) => { const v = e.target.value; updateField('education', (prev) => ({ ...prev, graduationYear: v })) }}
                  placeholder="2020"
                  maxLength={4}
                />
              </div>
            </>
          )}

          {/* Step 3: Skills */}
          {step === 3 && (
            <>
              <div>
                <Label className="mb-1.5 text-xs">Add your skills (minimum 3)</Label>
                <div className="flex gap-2">
                  <Input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ',') {
                        e.preventDefault()
                        addSkill(skillInput)
                      }
                    }}
                    placeholder="Type a skill and press Enter"
                    autoFocus
                  />
                  <Button variant="outline" size="sm" onClick={() => addSkill(skillInput)} disabled={!skillInput.trim()}>
                    Add
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {data.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="gap-1 pr-1">
                    {skill}
                    <button onClick={() => removeSkill(skill)} className="ml-1 rounded-full hover:bg-muted-foreground/20 p-0.5" aria-label={`Remove ${skill}`}>
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              {data.skills.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-4">
                  Add skills like: JavaScript, Project Management, Data Analysis, etc.
                </p>
              )}
              <p className="text-xs text-muted-foreground">{data.skills.length}/30 skills added</p>
            </>
          )}

          {/* Step 4: Review & Generate */}
          {step === 4 && (
            <>
              <div>
                <Label className="mb-1.5 text-xs">Career Goals (optional)</Label>
                <Textarea
                  value={data.goals}
                  onChange={(e) => updateField('goals', e.target.value)}
                  placeholder="What kind of roles are you targeting? Any specific goals?"
                  rows={3}
                  className="resize-none text-sm"
                />
              </div>
              <div className="rounded-lg border bg-muted/30 p-3 space-y-2">
                <p className="text-xs font-semibold">Summary</p>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <p><span className="font-medium text-foreground">Role:</span> {data.targetRole}</p>
                  <p><span className="font-medium text-foreground">Level:</span> {data.experienceLevel}</p>
                  <p><span className="font-medium text-foreground">Positions:</span> {data.positions.filter(p => p.title.trim()).length}</p>
                  <p><span className="font-medium text-foreground">Education:</span> {data.education.degree} — {data.education.school}</p>
                  <p><span className="font-medium text-foreground">Skills:</span> {data.skills.length}</p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 0 || generating}
            className="gap-1.5"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>

          {step < 4 ? (
            <Button
              size="sm"
              onClick={() => setStep((s) => s + 1)}
              disabled={!canProceed()}
              className="gap-1.5"
            >
              Next <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleGenerate}
              disabled={generating}
              className="gap-2"
            >
              {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {generating ? 'Generating Resume...' : 'Generate Resume (40 credits)'}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
