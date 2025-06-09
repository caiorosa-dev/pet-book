import { redirect } from 'next/navigation'

import { FullScreenPage } from '@/components/layout/full-screen-page'
import { Header } from '@/components/layout/header'
import { MobileNav } from '@/components/layout/mobile-nav'
import { getSession } from '@/lib/auth'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const authSession = await getSession()

  if (!authSession) {
    redirect('/welcome')
  }

  return (
    <>
      <FullScreenPage inApp>
        <Header currentLocation={'Itajaí, SC'} />
        {children}
        <MobileNav user={authSession.user} />
      </FullScreenPage>
    </>
  )
}
