import Link from 'next/link'
import Image from 'next/image'

const PRODUCT_LINKS = [
  { href: '/pricing', label: 'Pricing' },
  { href: '/templates', label: 'Templates' },
  { href: '/signup', label: 'Get Started' },
]

const COMPANY_LINKS = [
  { href: '/about', label: 'About' },
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Service' },
]

export function MarketingFooter() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/file.svg" alt="" width={20} height={20} className="h-5 w-5" />
              <span className="font-bold">TheResumeCompany</span>
            </Link>
            <p className="mt-3 max-w-sm text-sm text-muted-foreground">
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
        </div>

        <div className="mt-10 border-t pt-6">
          <p className="text-center text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} TheResumeCompany. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
