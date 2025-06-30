'use client'

import { format } from 'date-fns'
import { MessageCircle, Send } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import type { Comment, User } from '@/generated'
import { getNameInitials } from '@/helpers/get-name-initials'
import type { PostWithRelations } from '@/types/database'

import { addComment } from '../actions'

interface CommentWithAuthor extends Comment {
  author: User
}

interface CommentsSectionProps {
  post: PostWithRelations
  currentUserId: string
}

export function CommentsSection({ post, currentUserId }: CommentsSectionProps) {
  const [comments, setComments] = useState<CommentWithAuthor[]>(
    post.comments as CommentWithAuthor[],
  )
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAddComment = async () => {
    if (!newComment.trim()) return

    setIsSubmitting(true)
    try {
      const result = await addComment(newComment.trim(), post.id, currentUserId)

      if (result.success && result.comment) {
        setComments((prev) => [result.comment!, ...prev])
        setNewComment('')
        toast.success('Comentário adicionado!')
      } else {
        toast.error('Erro ao adicionar comentário')
      }
    } catch (error) {
      console.error('Erro ao comentar:', error)
      toast.error('Erro ao comentar')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <MessageCircle className="size-5 text-gray-600" />
        <h3 className="font-semibold text-gray-900">
          Comentários ({comments.length})
        </h3>
      </div>

      {/* Comment form */}
      <div className="mb-6">
        <Textarea
          placeholder="Escreva um comentário..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="mb-3"
          rows={3}
        />
        <div className="flex justify-end">
          <Button
            onClick={handleAddComment}
            disabled={!newComment.trim() || isSubmitting}
            size="sm"
          >
            <Send className="size-4 mr-1" />
            {isSubmitting ? 'Enviando...' : 'Comentar'}
          </Button>
        </div>
      </div>

      {/* Comments list */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageCircle className="size-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">Seja o primeiro a comentar!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <Avatar className="size-8 flex-shrink-0">
                <AvatarImage src={comment.author.image ?? ''} />
                <AvatarFallback className="text-xs">
                  {getNameInitials(comment.author.fullName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm text-gray-900">
                      {comment.author.fullName}
                    </span>
                    <span className="text-xs text-gray-500">
                      {format(new Date(comment.timestamp), 'dd/MM/yyyy HH:mm')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {comment.content}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
