import { FullScreenPage } from '@/components/layout/full-screen-page'
import { Header } from '@/components/layout/header'
import { MobileNav } from '@/components/layout/mobile-nav'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // const authSession = await auth.api.getSession({
  //   headers: await headers(),
  // })

  // if (!authSession) {
  //   redirect('/welcome')
  // }

  return (
    <>
      <FullScreenPage inApp>
        <Header currentLocation={'Itajaí, SC'} />
        {children}
        <MobileNav />
      </FullScreenPage>
    </>
  )
}
