import { FullScreenPage } from '@/components/layout/full-screen-page'
import { Header } from '@/components/layout/header'
import { Navbar } from '@/components/layout/navbar'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <FullScreenPage inApp className="flex justify-center items-center">
      <Header className="flex items-center justify-between p-4 self-start w-full" />
      {children}
      <Navbar className="flex items-center justify-between p-4 self-start w-full" />
    </FullScreenPage>
  )
}
