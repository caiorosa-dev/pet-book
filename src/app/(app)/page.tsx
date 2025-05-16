import { headers } from 'next/headers'

import { auth } from '@/lib/auth'

export default async function AppPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  return <div>{JSON.stringify(session?.user)}</div>
}
