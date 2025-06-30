import { MapPin } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { PostWithRelations } from '@/types/database'

import { LikeButton } from './like-button'
import { ShareButton } from './share-button'

export function PostActions({
  post,
  currentUserId,
}: {
  post: PostWithRelations
  currentUserId: string
}) {
  return (
    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
      <div className="flex items-center gap-4">
        <LikeButton post={post} currentUserId={currentUserId} />
        <ShareButton post={post} />
      </div>

      <Button variant="accent" size="sm">
        <MapPin className="size-4 mr-1" />
        {post.type === 'lost' ? 'Encontrei' : 'É meu'}
      </Button>
    </div>
  )
}
