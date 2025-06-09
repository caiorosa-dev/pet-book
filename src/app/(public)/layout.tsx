import { redirect } from 'next/navigation'

import { FullScreenPage } from '@/components/layout/full-screen-page'
import { Logo } from '@/components/misc/logo'
import { Toaster } from '@/components/ui/sonner'
import { getSession } from '@/lib/auth'

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  if (session) {
    redirect('/')
  }

  return (
    <FullScreenPage className="flex justify-center items-center">
      <Logo className="absolute top-12 left-1/2 -translate-x-1/2" />
      <Toaster richColors position="top-center" />
      {children}
    </FullScreenPage>
  )
}
