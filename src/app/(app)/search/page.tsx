import { headers } from 'next/headers'

import { Container } from '@/components/layout/container'
import { auth } from '@/lib/auth'

import { SearchClientPage } from './_components/search-client-page'

export default async function SearchPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    return (
      <Container>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Acesso Negado
          </h1>
          <p className="text-gray-600">Faça login para buscar</p>
        </div>
      </Container>
    )
  }
  return (
    <Container>
      <SearchClientPage currentUserId={session.user.id} />
    </Container>
  )
}
