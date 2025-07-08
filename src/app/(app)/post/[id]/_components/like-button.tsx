'use client'

import { PawPrint } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { PostWithRelations } from '@/types/database'

import { dislikePost, likePost } from '../actions'

export function LikeButton({
  post,
  currentUserId,
}: {
  post: PostWithRelations
  currentUserId: string
}) {
  const [likesCount, setLikesCount] = useState(post.likes.length)
  const [hasLiked, setHasLiked] = useState(() =>
    post.likes.some((like) => like.userId === currentUserId),
  )
  const [isLiking, setIsLiking] = useState(false)

  const handleLike = async () => {
    if (isLiking) return
    setIsLiking(true)

    try {
      if (hasLiked) {
        const res = await dislikePost(post.id, currentUserId)
        if (res.disliked) {
          setLikesCount((prev) => Math.max(prev - 1, 0))
          setHasLiked(false)
        }
      } else {
        const res = await likePost(post.id, currentUserId)
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
    <Button variant="ghost" size="sm" onClick={handleLike} disabled={isLiking}>
      <PawPrint
        className={`size-5 ${hasLiked ? 'text-primary fill-current' : ''}`}
      />
      <span className="text-sm">{likesCount}</span>
    </Button>
  )
}
