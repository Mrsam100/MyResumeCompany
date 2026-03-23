'use client'

import { Calendar } from 'lucide-react'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { cn } from '@/lib/utils'

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

const currentYear = new Date().getFullYear()
const YEARS = Array.from({ length: 56 }, (_, i) => currentYear + 5 - i)

function parseDate(value: string): { month: string; year: string } {
  if (!value) return { month: '', year: '' }
  const parts = value.trim().split(/[\s/,]+/)
  if (parts.length === 2) {
    const monthStr = parts[0]
    const yearStr = parts[1]
    const matchedMonth = MONTHS.find(
      (m) => m.toLowerCase() === monthStr.toLowerCase() || monthStr.startsWith(m),
    )
    return { month: matchedMonth ?? '', year: yearStr }
  }
  if (parts.length === 1 && /^\d{4}$/.test(parts[0])) {
    return { month: '', year: parts[0] }
  }
  return { month: '', year: '' }
}

interface DateMonthYearPickerProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

export function DateMonthYearPicker({
  value,
  onChange,
  disabled,
}: DateMonthYearPickerProps) {
  const { month, year } = parseDate(value)

  function handleMonthChange(newMonth: string | null) {
    if (!newMonth) return
    const newValue = newMonth && year ? `${newMonth} ${year}` : newMonth || year || ''
    onChange(newValue)
  }

  function handleYearChange(newYear: string | null) {
    if (!newYear) return
    const newValue = month && newYear ? `${month} ${newYear}` : month || newYear || ''
    onChange(newValue)
  }

  return (
    <div className={cn('flex min-w-0 gap-1.5', disabled && 'pointer-events-none opacity-50')}>
      {/* Month */}
      <Select value={month} onValueChange={handleMonthChange}>
        <SelectTrigger size="sm" className="min-w-0 flex-1">
          <Calendar className="h-3 w-3 shrink-0 text-muted-foreground/50" />
          <SelectValue placeholder="Month" />
        </SelectTrigger>
        <SelectContent>
          {MONTHS.map((m) => (
            <SelectItem key={m} value={m}>
              {m}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Year */}
      <Select value={year} onValueChange={handleYearChange}>
        <SelectTrigger size="sm" className="w-[4.5rem] shrink-0">
          <SelectValue placeholder="Year" />
        </SelectTrigger>
        <SelectContent>
          {YEARS.map((y) => (
            <SelectItem key={y} value={String(y)}>
              {y}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
