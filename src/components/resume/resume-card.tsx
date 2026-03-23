'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import {
  MoreHorizontal,
  Pencil,
  Copy,
  Trash2,
  FileText,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface ResumeCardProps {
  id: string
  title: string
  templateId: string
  lastEditedAt: string | Date
  onDelete: (id: string) => Promise<void>
  onDuplicate: (id: string) => Promise<void>
}

export function ResumeCard({
  id,
  title,
  templateId,
  lastEditedAt,
  onDelete,
  onDuplicate,
}: ResumeCardProps) {
  const router = useRouter()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const timeAgo = formatDistanceToNow(new Date(lastEditedAt), { addSuffix: true })

  async function handleDelete() {
    setDeleting(true)
    try {
      await onDelete(id)
      setDeleteOpen(false)
    } catch {
      // Error toast handled by parent
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <Link href={`/editor/${id}`} className="block">
          <div className="flex h-48 items-center justify-center bg-gradient-to-br from-muted/60 to-muted/30">
            <FileText className="h-12 w-12 text-muted-foreground/30 transition-transform duration-200 group-hover:scale-105" />
          </div>
        </Link>

        {/* Bottom accent bar */}
        <div className="h-0.5 bg-gradient-to-r from-primary/40 via-primary/20 to-transparent" />

        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-medium">{title}</h3>
              <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary/40" />
                {templateId.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Edited {timeAgo}</p>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger className="h-8 w-8 shrink-0 rounded-md opacity-100 sm:opacity-0 transition-all duration-200 hover:bg-muted/80 sm:group-hover:opacity-100 backdrop-blur-sm">
                <MoreHorizontal className="mx-auto h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => router.push(`/editor/${id}`)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDuplicate(id)}>
                  <Copy className="mr-2 h-4 w-4" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => setDeleteOpen(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete resume</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{title}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
