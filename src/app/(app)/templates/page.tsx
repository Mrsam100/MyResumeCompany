'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Crown } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { TemplatePreview } from '@/components/templates/template-preview'
import { cn } from '@/lib/utils'

interface Template {
  id: string
  name: string
  slug: string
  description: string | null
  category: string
  isPremium: boolean
}

const CATEGORY_LABELS: Record<string, string> = {
  PROFESSIONAL: 'Professional',
  MODERN: 'Modern',
  CREATIVE: 'Creative',
  TECH: 'Tech',
  ATS_OPTIMIZED: 'ATS-Optimized',
  ACADEMIC: 'Academic',
  MINIMAL: 'Minimal',
}

const CATEGORY_COLORS: Record<string, string> = {
  PROFESSIONAL: 'bg-blue-50 text-blue-700 border-blue-200',
  MODERN: 'bg-violet-50 text-violet-700 border-violet-200',
  CREATIVE: 'bg-pink-50 text-pink-700 border-pink-200',
  TECH: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  ATS_OPTIMIZED: 'bg-amber-50 text-amber-700 border-amber-200',
  ACADEMIC: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  MINIMAL: 'bg-gray-50 text-gray-700 border-gray-200',
}

export default function TemplatesPage() {
  const router = useRouter()
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState<string | null>(null)
  const [filter, setFilter] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTemplates() {
      try {
        const res = await fetch('/api/templates')
        if (res.ok) {
          const data = await res.json()
          setTemplates(data.templates)
        }
      } catch {
        toast.error('Failed to load templates')
      } finally {
        setLoading(false)
      }
    }
    fetchTemplates()
  }, [])

  async function handleUseTemplate(slug: string) {
    setCreating(slug)
    try {
      const res = await fetch('/api/resumes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId: slug }),
      })
      if (res.ok) {
        const data = await res.json()
        router.push(`/editor/${data.resume.id}`)
      } else {
        toast.error('Failed to create resume')
      }
    } catch {
      toast.error('Something went wrong')
    } finally {
      setCreating(null)
    }
  }

  const categories = [...new Set(templates.map((t) => t.category))]
  const filtered = filter ? templates.filter((t) => t.category === filter) : templates

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Choose a Template</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          50+ professional templates — pick one and start editing
        </p>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        <Button
          variant={filter === null ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter(null)}
          className="h-9"
        >
          All ({templates.length})
        </Button>
        {categories.map((cat) => {
          const count = templates.filter((t) => t.category === cat).length
          return (
            <Button
              key={cat}
              variant={filter === cat ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(cat)}
              className="h-9"
            >
              {CATEGORY_LABELS[cat] ?? cat} ({count})
            </Button>
          )
        })}
      </div>

      {/* Template grid — big cards with resume previews */}
      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-xl border">
              <Skeleton className="aspect-[3/4] w-full rounded-none" />
              <div className="space-y-2 p-4">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((template) => {
            const isCreating = creating === template.slug
            const catColor = CATEGORY_COLORS[template.category] ?? ''

            return (
              <div
                key={template.id}
                className="animate-fade-in-up group relative overflow-hidden rounded-xl border bg-card transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                style={{ animationDelay: `${filtered.indexOf(template) * 50}ms` }}
              >
                {/* Resume preview — aspect ratio like real A4 paper */}
                <div className="relative aspect-[3/4] overflow-hidden border-b bg-gradient-to-b from-gray-50 to-gray-100/50">
                  <div className="absolute inset-3">
                    <TemplatePreview slug={template.slug} />
                  </div>

                  {template.isPremium && (
                    <Badge className="absolute right-3 top-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm">
                      <Crown className="mr-1 h-3 w-3" />
                      Pro
                    </Badge>
                  )}

                  {/* Hover overlay */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/50 opacity-0 backdrop-blur-[2px] transition-all duration-300 group-hover:opacity-100">
                    <Button
                      size="lg"
                      onClick={() => handleUseTemplate(template.slug)}
                      disabled={isCreating}
                      className="gap-2 shadow-lg scale-95 transition-transform duration-200 group-hover:scale-100"
                    >
                      {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                      {isCreating ? 'Creating...' : 'Use This Template'}
                    </Button>
                  </div>
                </div>

                {/* Template info */}
                <div className="p-4 transition-colors duration-200 group-hover:bg-muted/30">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{template.name}</h3>
                    <Badge variant="outline" className={cn('text-[10px] border', catColor)}>
                      {CATEGORY_LABELS[template.category] ?? template.category}
                    </Badge>
                  </div>
                  {template.description && (
                    <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                      {template.description}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="flex flex-col items-center py-20">
          <p className="text-sm text-muted-foreground">No templates in this category</p>
          <Button variant="outline" size="sm" className="mt-3" onClick={() => setFilter(null)}>
            Show all
          </Button>
        </div>
      )}
    </div>
  )
}
