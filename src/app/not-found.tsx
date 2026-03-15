import Link from 'next/link'
import { FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <FileText className="h-16 w-16 text-muted-foreground/30" />
      <h1 className="mt-6 text-4xl font-bold">404</h1>
      <p className="mt-2 text-muted-foreground">
        This page doesn&apos;t exist.
      </p>
      <div className="mt-8 flex gap-3">
        <Link href="/">
          <Button variant="outline">Go home</Button>
        </Link>
        <Link href="/dashboard">
          <Button>Dashboard</Button>
        </Link>
      </div>
    </div>
  )
}
