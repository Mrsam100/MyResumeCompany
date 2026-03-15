'use client'

import {
  User,
  Briefcase,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Globe,
  type LucideIcon,
} from 'lucide-react'

import { Input } from '@/components/ui/input'
import { useResumeStore } from '@/stores/resume-store'
import type { PersonalInfo } from '@/types/resume'

interface FieldConfig {
  key: keyof PersonalInfo
  label: string
  placeholder: string
  icon: LucideIcon
  type?: string
  span?: 2
}

const topFields: FieldConfig[] = [
  { key: 'fullName', label: 'Full name', placeholder: 'John Doe', icon: User, span: 2 },
  { key: 'title', label: 'Professional title', placeholder: 'Senior Software Engineer', icon: Briefcase, span: 2 },
]

const contactFields: FieldConfig[] = [
  { key: 'email', label: 'Email', placeholder: 'john@example.com', icon: Mail, type: 'email' },
  { key: 'phone', label: 'Phone', placeholder: '+1 (555) 123-4567', icon: Phone, type: 'tel' },
  { key: 'location', label: 'Location', placeholder: 'San Francisco, CA', icon: MapPin, span: 2 },
]

const linkFields: FieldConfig[] = [
  { key: 'linkedin', label: 'LinkedIn', placeholder: 'linkedin.com/in/johndoe', icon: Linkedin },
  { key: 'website', label: 'Website / Portfolio', placeholder: 'johndoe.com', icon: Globe },
]

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: FieldConfig
  value: string
  onChange: (val: string) => void
}) {
  return (
    <div className={field.span === 2 ? 'sm:col-span-2' : ''}>
      <div className="relative">
        <field.icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/40" />
        <Input
          type={field.type ?? 'text'}
          placeholder={field.placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 pl-10 text-sm"
          aria-label={field.label}
        />
      </div>
    </div>
  )
}

export function PersonalInfoForm() {
  const personalInfo = useResumeStore((s) => s.content.personalInfo)
  const setPersonalInfo = useResumeStore((s) => s.setPersonalInfo)

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
          <User className="h-4 w-4 text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-semibold">Personal Information</h3>
          <p className="text-xs text-muted-foreground">How employers will contact you</p>
        </div>
      </div>

      {/* Name & Title */}
      <div className="grid gap-3 sm:grid-cols-2">
        {topFields.map((field) => (
          <FieldInput
            key={field.key}
            field={field}
            value={(personalInfo[field.key] as string) ?? ''}
            onChange={(val) => setPersonalInfo(field.key, val)}
          />
        ))}
      </div>

      {/* Contact details */}
      <div>
        <p className="mb-2 text-xs font-medium text-muted-foreground">Contact</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {contactFields.map((field) => (
            <FieldInput
              key={field.key}
              field={field}
              value={(personalInfo[field.key] as string) ?? ''}
              onChange={(val) => setPersonalInfo(field.key, val)}
            />
          ))}
        </div>
      </div>

      {/* Links */}
      <div>
        <p className="mb-2 text-xs font-medium text-muted-foreground">Links</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {linkFields.map((field) => (
            <FieldInput
              key={field.key}
              field={field}
              value={(personalInfo[field.key] as string) ?? ''}
              onChange={(val) => setPersonalInfo(field.key, val)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
