import { auth } from '@/auth'
import { LandingPageClient } from '@/components/marketing/landing-page'

export default async function HomePage() {
  const session = await auth()
  const isLoggedIn = !!session?.user

  return <LandingPageClient isLoggedIn={isLoggedIn} />
}
