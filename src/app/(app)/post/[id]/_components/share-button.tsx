'use client'

import { Share2 } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { PostWithRelations } from '@/types/database'

export function ShareButton({ post }: { post: PostWithRelations }) {
  const handleShare = async () => {
    const url = `${window.location.origin}/post/${post.id}`
    const title = `${post.type === 'lost' ? 'Pet Perdido' : 'Pet Encontrado'}: ${post.animalSpecies} ${post.animalBreed}`

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: post.petDescription,
          url,
        })
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback to copying URL
      try {
        await navigator.clipboard.writeText(url)
        toast.success('Link copiado para a área de transferência!')
      } catch (error) {
        toast.error('Erro ao compartilhar')
      }
    }
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleShare}>
      <Share2 className="size-5" />
      <span className="text-sm">Compartilhar</span>
    </Button>
  )
}
