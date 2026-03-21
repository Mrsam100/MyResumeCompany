'use client'

import { SessionProvider } from '@/components/providers/session-provider'
import { PostHogIdentifier } from '@/components/posthog-provider'
import { Sidebar } from '@/components/layout/sidebar'
import { Topbar } from '@/components/layout/topbar'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <PostHogIdentifier />
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar — desktop only */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* Main content area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <Topbar />
          <main className="flex-1 overflow-y-auto bg-[radial-gradient(ellipse_at_top_right,oklch(0.205_0_0/3%),transparent_50%),radial-gradient(ellipse_at_bottom_left,oklch(0.623_0.214_259.815/3%),transparent_50%)] bg-muted/20 p-4 md:p-6">
            <div className="animate-fade-in-up">{children}</div>
          </main>
        </div>
      </div>
    </SessionProvider>
  )
}
