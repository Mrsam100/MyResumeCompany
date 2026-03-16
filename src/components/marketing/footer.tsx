import Link from 'next/link'
import Image from 'next/image'

const PRODUCT_LINKS = [
  { href: '/pricing', label: 'Pricing' },
  { href: '/resume-templates', label: 'Templates' },
  { href: '/blog', label: 'Blog' },
  { href: '/signup', label: 'Get Started' },
]

const COMPANY_LINKS = [
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Service' },
]

const COMPARE_LINKS = [
  { href: '/compare/vs-zety', label: 'vs Zety' },
  { href: '/compare/vs-resume-io', label: 'vs Resume.io' },
  { href: '/compare/vs-canva', label: 'vs Canva' },
]

export function MarketingFooter() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/file.svg" alt="" width={20} height={20} className="h-5 w-5" />
              <span className="font-bold">TheResumeCompany</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground sm:max-w-sm">
              Build professional, ATS-optimized resumes in minutes with the power of AI.
              Land more interviews with less effort.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold">Product</h3>
            <ul className="mt-3 space-y-2">
              {PRODUCT_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold">Company</h3>
            <ul className="mt-3 space-y-2">
              {COMPANY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Compare */}
          <div>
            <h3 className="text-sm font-semibold">Compare</h3>
            <ul className="mt-3 space-y-2">
              {COMPARE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t pt-6 space-y-1">
          <p className="text-center text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} TheResumeCompany. All rights reserved.
          </p>
          <p className="text-center text-xs text-muted-foreground/60">
            A Schroeder Technologies Company
          </p>
        </div>
      </div>
    </footer>
  )
}
