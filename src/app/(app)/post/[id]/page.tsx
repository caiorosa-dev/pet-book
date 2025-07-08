import { headers } from 'next/headers'
import { notFound } from 'next/navigation'

import { Container } from '@/components/layout/container'
import { auth } from '@/lib/auth'
import { getPostById } from '@/lib/feed-actions'

import { PostDetail } from './_components/post-detail'

interface PostPageProps {
  params: Promise<{ id: string }>
}

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params

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
          <p className="text-gray-600">Faça login para ver este post</p>
        </div>
      </Container>
    )
  }

  const post = await getPostById(id)

  if (!post) {
    notFound()
  }

  return (
    <Container>
      <PostDetail post={post} currentUserId={session.user.id} />
    </Container>
  )
}
