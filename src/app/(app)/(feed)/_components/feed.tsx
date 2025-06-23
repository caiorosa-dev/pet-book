import { Plus } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import type { PostWithRelations } from '@/types/database'

import PostCard from './post-card'

interface FeedProps {
  posts: PostWithRelations[]
  title?: string
  stats?: {
    total: number
    lost: number
    found: number
  }
  showCreateButton?: boolean
  emptyStateConfig?: {
    emoji: string
    title: string
    description: string
    actionText: string
    actionHref: string
  }
}

export default function Feed({
  posts,
  title = 'Feed',
  stats,
  showCreateButton = true,
  emptyStateConfig,
}: FeedProps) {
  const defaultEmptyState = {
    emoji: '📱',
    title: 'Nenhum post ainda',
    description:
      'Seja o primeiro a compartilhar sobre um pet perdido ou encontrado para ajudar a comunidade!',
    actionText: 'Criar Primeiro Post',
    actionHref: '/new-post',
  }

  const emptyState = emptyStateConfig || defaultEmptyState

  return (
    <div className="flex flex-col gap-6">
      {/* Header com estatísticas */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
          {stats && (
            <p className="text-sm text-gray-600">
              {stats.total} {stats.total === 1 ? 'post' : 'posts'} •{' '}
              {stats.lost} perdidos • {stats.found} encontrados
            </p>
          )}
        </div>
        {showCreateButton && (
          <Link href="/new-post">
            <Button size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Novo Post
            </Button>
          </Link>
        )}
      </div>

      {/* Lista de Posts */}
      {posts.length > 0 ? (
        <div className="flex flex-col gap-4 max-w-md mx-auto w-full">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <div className="text-6xl mb-4">{emptyState.emoji}</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {emptyState.title}
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            {emptyState.description}
          </p>
          <Link href={emptyState.actionHref}>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              {emptyState.actionText}
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
