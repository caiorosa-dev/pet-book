import { headers } from 'next/headers'

import { Container } from '@/components/layout/container'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { auth } from '@/lib/auth'

import EditProfileTab from './_components/edit-profile'
import EditSecuritySettings from './_components/edit-security-settings'

export default async function EditProfile() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  return (
    <Container>
      <Tabs defaultValue="account">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="account">Perfil</TabsTrigger>
          <TabsTrigger value="password">Segurança</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <EditProfileTab userName={session?.user.name ?? ''} />
        </TabsContent>
        <TabsContent value="password">
          <EditSecuritySettings />
        </TabsContent>
      </Tabs>
    </Container>
  )
}
