import { format } from 'date-fns'
import { Bone, Dog } from 'lucide-react'
import Image from 'next/image'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { capitalizeString } from '@/helpers/capitalize'
import { getNameInitials } from '@/helpers/get-name-initials'
import type { PostWithRelations } from '@/types/database'

import { PostActions } from './post-actions'

interface PostCardProps {
  post: PostWithRelations
  currentUserId: string
}

// Componente do Header do Post
function PostHeader({ post }: { post: PostWithRelations }) {
  return (
    <div className="flex items-center gap-3 p-4">
      <Avatar className="size-10">
        <AvatarImage src={post.user?.image ?? ''} />
        <AvatarFallback>
          {getNameInitials(post.user?.fullName || 'Usuário Anônimo')}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900 text-sm">
          {post.user?.fullName || 'Usuário Anônimo'}
        </h3>
        <p className="text-xs text-gray-500">
          {format(new Date(post.createdAt), 'dd/MM/yyyy')}
        </p>
      </div>
    </div>
  )
}

// Componente da Imagem do Post
function PostImage({ post }: { post: PostWithRelations }) {
  const firstPhoto = post.photos?.[0]?.s3Url
  const totalPhotos = post.photos?.length || 0

  if (!firstPhoto) {
    return (
      <div className="w-full h-64 bg-slate-200 flex items-center justify-center">
        <Dog className="text-slate-400 size-16" />
      </div>
    )
  }

  return (
    <div className="relative">
      <Image
        src={firstPhoto}
        alt={`Foto do ${post.animalSpecies} ${post.animalBreed}`}
        width={400}
        height={300}
        className="w-full h-64 object-cover"
      />
      {totalPhotos > 1 && (
        <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded">
          +{totalPhotos - 1}
        </div>
      )}
    </div>
  )
}

// Componente do Título e Badges
function PostContent({ post }: { post: PostWithRelations }) {
  return (
    <header className="flex items-center justify-between">
      <div className="flex items-start gap-2 mb-2">
        <h2 className="text-lg font-semibold text-gray-900 flex-1">
          {post.type === 'lost' ? `Perdi o ` : `Encontrei o `}
          <span className="text-teal-600">
            {capitalizeString(post.pet?.name ?? post.animalSpecies)}
          </span>
        </h2>
      </div>

      {/* Badges horizontais igual pet-component */}
      <div className="flex gap-4 mb-3">
        <div className="flex gap-1 items-center">
          <Dog className="text-primary size-4" />
          <span className="text-xs">
            {capitalizeString(post.animalSpecies)}
          </span>
        </div>
        <div className="flex gap-1 items-center">
          <Bone className="text-primary size-4" />
          <span className="text-xs">{capitalizeString(post.animalBreed)}</span>
        </div>
      </div>
    </header>
  )
}

// Componente da Descrição
function PostDescription({ description }: { description: string }) {
  if (!description) return null

  return (
    <p className="text-sm text-gray-700 leading-relaxed mb-3">{description}</p>
  )
}

export default async function PostCard({ post, currentUserId }: PostCardProps) {
  return (
    <div className="w-full bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm">
      <PostHeader post={post} />
      <PostImage post={post} />

      <div className="p-4">
        <PostContent post={post} />
        <PostDescription description={post.petDescription} />
        <PostActions post={post} currentUserid={currentUserId} />
      </div>
    </div>
  )
}
