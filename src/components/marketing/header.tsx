import Link from 'next/link'
import Image from 'next/image'

import { auth } from '@/auth'
import { Button } from '@/components/ui/button'

const NAV_LINKS = [
  { href: '/pricing', label: 'Pricing' },
  { href: '/about', label: 'About' },
]

export async function MarketingHeader() {
  const session = await auth()
  const isLoggedIn = !!session?.user

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/file.svg" alt="" width={24} height={24} className="h-6 w-6" />
          <span className="text-lg font-bold tracking-tight">TheResumeCompany</span>
        </Link>

        {/* Nav links */}
        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Auth CTA */}
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <Link href="/dashboard">
              <Button size="sm">Dashboard</Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">Log in</Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Get Started Free</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
