'use client'

import { MapPin, MessageCircle, PawPrint, Share2 } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { PostWithRelations } from '@/types/database'

import { dislikePost, likePost } from '../actions'

export function PostActions({
  post,
  currentUserid,
}: {
  post: PostWithRelations
  currentUserid: string
}) {
  const [likesCount, setLikesCount] = useState(post.likes.length)
  const [hasLiked, setHasLiked] = useState(() =>
    post.likes.some((like) => like.userId === currentUserid),
  )
  const [isLiking, setIsLiking] = useState(false)

  const handleLike = async () => {
    if (isLiking) return

    setIsLiking(true)

    try {
      if (hasLiked) {
        // Dislike
        const res = await dislikePost(post.id, currentUserid)
        if (res.disliked) {
          setLikesCount((prev) => Math.max(prev - 1, 0)) // não deixa count negativo
          setHasLiked(false)
        }
      } else {
        // Like
        const res = await likePost(post.id, currentUserid)
        if (res.liked) {
          setLikesCount((prev) => prev + 1)
          setHasLiked(true)
        }
      }
    } catch (err) {
      console.error('Erro ao curtir/descurtir post', err)
    } finally {
      setIsLiking(false)
    }
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={handleLike}>
          <PawPrint className={`size-5 ${hasLiked ? 'text-primary' : ''}`} />
          <span className="text-sm">{likesCount}</span>
        </Button>
        <Button variant="ghost" size="sm">
          <MessageCircle className="size-5" />
          <span className="text-sm">{post.comments.length}</span>
        </Button>
        <Button variant="ghost" size="sm">
          <Share2 className="size-5" />
        </Button>
      </div>

      <Button variant="accent" size="sm">
        <MapPin className="size-4 mr-1" />
        {post.type === 'lost' ? 'Encontrei' : 'É meu'}
      </Button>
    </div>
  )
}
