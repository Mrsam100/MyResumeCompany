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
  Sparkles,
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
    <aside className="flex h-full w-64 flex-col border-r border-border/50 bg-card/80 backdrop-blur-xl">
      {/* Logo */}
      <div className="flex h-14 items-center gap-2.5 border-b border-border/50 px-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/70 shadow-sm">
          <Image src="/file.svg" alt="" width={14} height={14} className="h-3.5 w-3.5 brightness-0 invert" />
        </div>
        <span className="font-heading text-[15px] font-bold tracking-tight">TheResumeCompany</span>
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
                'relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-primary/8 text-primary before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-5 before:w-[3px] before:rounded-full before:bg-primary'
                  : 'text-muted-foreground hover:bg-muted/80 hover:text-foreground',
              )}
            >
              <item.icon className={cn('h-4 w-4 transition-transform duration-200', isActive && 'scale-110')} />
              {item.label}
              {item.href === '/credits' && user && (
                <span
                  className={cn(
                    'ml-auto rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums transition-colors',
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
            <div className="rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-[1px]">
              <div className="rounded-[11px] bg-card/90 p-3 transition-shadow duration-300 hover:shadow-[0_0_20px_oklch(0.205_0_0/10%)]">
                <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                  <Crown className="h-4 w-4" />
                  <Sparkles className="h-3 w-3 text-amber-500" />
                  Upgrade to Pro
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Unlimited AI + 500 credits/month
                </p>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* User menu */}
      <div className="border-t border-border/50 p-3">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex w-full items-center gap-3 rounded-lg p-2 text-sm transition-colors hover:bg-muted/60">
            <div className="relative">
              <Avatar className="h-8 w-8 ring-2 ring-transparent transition-all hover:ring-primary/20">
                <AvatarImage src={user?.image ?? undefined} />
                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-xs font-semibold">{initials}</AvatarFallback>
              </Avatar>
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-card bg-emerald-500" />
            </div>
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
