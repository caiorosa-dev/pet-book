import { Plus } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'

import { getUserPosts } from '../new-pet/actions'
import PostItem from './post-item'

export default async function PostsList() {
  const posts = await getUserPosts()

  const lostPosts = posts.filter((post) => post.type === 'lost')
  const foundPosts = posts.filter((post) => post.type === 'found')

  return (
    <div className="flex flex-col gap-6 mt-12">
      {/* Header com estatísticas */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Seus Posts</h1>
          <p className="text-sm text-gray-600">
            {posts.length} {posts.length === 1 ? 'post' : 'posts'} •{' '}
            {lostPosts.length} perdidos • {foundPosts.length} encontrados
          </p>
        </div>
        <Link href="/new-post">
          <Button size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            Novo Post
          </Button>
        </Link>
      </div>

      {/* Lista de Posts */}
      {posts.length > 0 ? (
        <div className="flex flex-col gap-4 max-w-md mx-auto w-full">
          {posts.map((post) => (
            <PostItem key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum post ainda
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Comece criando seu primeiro post sobre um pet perdido ou encontrado
            para ajudar a comunidade!
          </p>
          <Link href="/new-post">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Criar Primeiro Post
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
