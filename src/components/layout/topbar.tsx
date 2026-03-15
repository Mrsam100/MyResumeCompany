'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { Plus, Coins, Menu, LogOut, Settings } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Sidebar } from './sidebar'
import { useCurrentUser } from '@/hooks/use-current-user'
import { cn } from '@/lib/utils'

const breadcrumbMap: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/templates': 'Templates',
  '/credits': 'Credits',
  '/settings': 'Settings',
}

export function Topbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useCurrentUser()

  const breadcrumb =
    breadcrumbMap[pathname] ??
    (pathname.startsWith('/editor') ? 'Resume Editor' : 'Dashboard')

  const initials =
    user?.name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) ?? '?'

  return (
    <header className="flex h-14 items-center justify-between border-b bg-card px-4">
      {/* Left: Mobile menu + Breadcrumb */}
      <div className="flex items-center gap-3">
        <Sheet>
          <SheetTrigger className="lg:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <Sidebar />
          </SheetContent>
        </Sheet>

        <h1 className="text-lg font-semibold">{breadcrumb}</h1>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Credit balance */}
        <Link href="/credits">
          <Button variant="ghost" size="sm" className="gap-1.5">
            <Coins className="h-4 w-4" />
            <span
              className={cn(
                'font-semibold',
                (user?.credits ?? 0) < 20 && 'text-destructive',
              )}
            >
              {user?.credits ?? 0}
            </span>
          </Button>
        </Link>

        {/* New Resume — navigates to dashboard where create logic lives */}
        <Link href="/dashboard">
          <Button size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Resume</span>
          </Button>
        </Link>

        {/* User avatar — desktop only */}
        <div className="hidden lg:block">
          <DropdownMenu>
            <DropdownMenuTrigger className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.image ?? undefined} />
                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <div className="px-2 py-1.5">
                <p className="truncate text-sm font-medium">{user?.name}</p>
                <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/credits')}>
                <Coins className="mr-2 h-4 w-4" />
                Credits
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/login' })}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
