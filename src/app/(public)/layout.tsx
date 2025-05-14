import { FullScreenPage } from '@/components/layout/full-screen-page'
import { Logo } from '@/components/misc/logo'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <FullScreenPage className="flex justify-center items-center">
      <Logo className="absolute top-12 left-1/2 -translate-x-1/2" />
      {children}
    </FullScreenPage>
  )
}
