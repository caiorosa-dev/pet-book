'use client'

import { PawPrint } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { PostWithRelations } from '@/types/database'

import { dislikePost, likePost } from '../actions'

export function LikeButton({
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
        const res = await dislikePost(post.id, currentUserid)
        if (res.disliked) {
          setLikesCount((prev) => Math.max(prev - 1, 0))
          setHasLiked(false)
        }
      } else {
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
    <Button variant="ghost" size="sm" onClick={handleLike} disabled={isLiking}>
      <PawPrint
        className={`size-5 transition-colors ${hasLiked ? 'text-primary' : 'text-gray-600'}`}
        fill={hasLiked ? 'currentColor' : 'none'}
      />
      <span className="text-sm">{likesCount}</span>
    </Button>
  )
}
