'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  LayoutDashboard,
  LayoutGrid,
  Coins,
  Settings,
  LogOut,
  Crown,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useCurrentUser } from '@/hooks/use-current-user'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/templates', label: 'Templates', icon: LayoutGrid },
  { href: '/credits', label: 'Credits', icon: Coins },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useCurrentUser()

  const initials =
    user?.name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) ?? '?'

  return (
    <aside className="flex h-full w-64 flex-col border-r bg-card">
      {/* Logo */}
      <div className="flex h-14 items-center gap-2 border-b px-4">
        <Image src="/file.svg" alt="" width={20} height={20} className="h-5 w-5" />
        <span className="font-bold">TheResumeCompany</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
              {item.href === '/credits' && user && (
                <span
                  className={cn(
                    'ml-auto rounded-full px-2 py-0.5 text-xs font-semibold',
                    (user.credits ?? 0) < 20
                      ? 'bg-destructive/10 text-destructive'
                      : 'bg-muted text-muted-foreground',
                  )}
                >
                  {user.credits ?? 0}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Upgrade CTA */}
      {user?.subscriptionTier !== 'PRO' && (
        <div className="mx-3 mb-3">
          <Link href="/credits">
            <div className="rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 p-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                <Crown className="h-4 w-4" />
                Upgrade to Pro
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Unlimited AI + 500 credits/month
              </p>
            </div>
          </Link>
        </div>
      )}

      {/* User menu */}
      <div className="border-t p-3">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex w-full items-center gap-3 rounded-md p-2 text-sm hover:bg-muted">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.image ?? undefined} />
              <AvatarFallback className="text-xs">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 text-left">
              <p className="truncate font-medium">{user?.name ?? 'User'}</p>
              <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={() => router.push('/settings')}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/login' })}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  )
}
