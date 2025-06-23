import { Heart, MessageCircle } from 'lucide-react'

import type { PostWithRelations } from '@/types/database'

interface PostItemProps {
  post: PostWithRelations
}

export default function PostItem({ post }: PostItemProps) {
  return (
    <div className="w-full bg-secondary rounded-xl relative">
      <div className="absolute inset-0 flex items-center justify-center text-secondary gap-8 bg-accent-foreground/40 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-xl z-10">
        <div className="flex items-center gap-2">
          <Heart />
          {post.likes.length}
        </div>
        <div className="flex items-center gap-2">
          <MessageCircle />
          {post.comments.length}
        </div>
      </div>
      {post.photos && post.photos.length > 0 ? (
        <img
          className="rounded-xl w-full h-48 object-cover"
          src={post.photos[0]}
          alt={`Foto do ${post.animalSpecies} ${post.animalBreed}`}
        />
      ) : (
        <div className="rounded-xl w-full h-48 bg-slate-200 flex items-center justify-center">
          <p className="text-slate-500 text-sm">Sem foto</p>
        </div>
      )}
    </div>
  )
}
