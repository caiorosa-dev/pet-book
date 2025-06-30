import { MapPin } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { PostWithRelations } from '@/types/database'

import { CommentButton } from './comment-button'
import { LikeButton } from './like-button'
import { ShareButton } from './share-button'

export function PostActions({
  post,
  currentUserid,
}: {
  post: PostWithRelations
  currentUserid: string
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <LikeButton post={post} currentUserid={currentUserid} />
        <CommentButton post={post} currentUserid={currentUserid} />
        <ShareButton post={post} />
      </div>

      <Button variant="accent" size="sm">
        <MapPin className="size-4 mr-1" />
        {post.type === 'lost' ? 'Encontrei' : 'É meu'}
      </Button>
    </div>
  )
}
