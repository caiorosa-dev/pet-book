import { headers } from 'next/headers'

import { Container } from '@/components/layout/container'
import { auth } from '@/lib/auth'
import { getAllPosts, getFeedStats } from '@/lib/feed-actions'

import Feed from './_components/feed'

export default async function AppPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    return (
      <Container>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Bem-vindo ao PetBook
          </h1>
          <p className="text-gray-600">
            Faça login para ver o feed da comunidade
          </p>
        </div>
      </Container>
    )
  }

  // Buscar posts e estatísticas em paralelo
  const [posts, stats] = await Promise.all([
    getAllPosts({ limit: 50 }),
    getFeedStats(),
  ])

  return (
    <Container>
      <Feed
        posts={posts}
        currentUserId={session.user.id}
        title="Feed da Comunidade"
        stats={stats}
        showCreateButton={true}
        emptyStateConfig={{
          emoji: '🐾',
          title: 'Comunidade vazia',
          description:
            'Seja o primeiro a compartilhar sobre um pet perdido ou encontrado para ajudar a comunidade!',
          actionText: 'Criar Primeiro Post',
          actionHref: '/new-post',
        }}
      />
    </Container>
  )
}
