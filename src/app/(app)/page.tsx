import { headers } from 'next/headers'

import { Container } from '@/components/layout/container'
import { auth } from '@/lib/auth'

export default async function AppPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  return (
    <Container>
      <pre className="break-all">{JSON.stringify(session?.user, null, 2)}</pre>
    </Container>
  )
}
