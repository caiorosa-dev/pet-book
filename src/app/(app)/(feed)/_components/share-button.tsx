'use client'

import { Share2 } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { generatePostShareData, sharePost } from '@/lib/share-utils'
import { PostWithRelations } from '@/types/database'

export function ShareButton({ post }: { post: PostWithRelations }) {
  const handleShare = async () => {
    try {
      const shareData = generatePostShareData(post)
      const success = await sharePost(shareData)

      if (success) {
        toast.success('Post compartilhado com sucesso!')
      } else {
        toast.error('Não foi possível compartilhar o post')
      }
    } catch (error) {
      console.error('Erro ao compartilhar o post:', error)
      toast.error('Erro ao compartilhar')
    }
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleShare}>
      <Share2 className="size-5" />
    </Button>
  )
}
