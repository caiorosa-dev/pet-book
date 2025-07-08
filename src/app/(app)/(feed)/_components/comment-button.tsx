'use client'

import { MessageCircle } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { PostWithRelations } from '@/types/database'

import { addComment } from '../actions'

export function CommentButton({
  post,
  currentUserid,
}: {
  post: PostWithRelations
  currentUserid: string
}) {
  const [open, setOpen] = useState(false)
  const [comment, setComment] = useState('')
  const [commentsCount, setCommentsCount] = useState(post.comments.length)

  const handleComment = async () => {
    try {
      const success = await addComment(comment, post.id, currentUserid)

      if (success) {
        toast.success('Comentário salvo com sucesso!')
        setCommentsCount((prev) => prev + 1)
        setComment('')
        setOpen(false)
      } else {
        toast.error('Não foi possível salvar o comentário')
      }
    } catch (error) {
      console.error('Erro ao comentar:', error)
      toast.error('Erro ao comentar')
    }
  }

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
        <MessageCircle className="size-5" />
        <span className="text-sm">{commentsCount}</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar comentário</DialogTitle>
            <DialogDescription>
              Escreva um comentário para este post.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Digite seu comentário..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleComment} disabled={!comment.trim()}>
              Comentar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
