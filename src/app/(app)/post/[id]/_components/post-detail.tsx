import { format } from 'date-fns'
import { ArrowLeft, Bone, Dog, MapPin } from 'lucide-react'
import Link from 'next/link'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { capitalizeString } from '@/helpers/capitalize'
import { getNameInitials } from '@/helpers/get-name-initials'
import type { PostWithRelations } from '@/types/database'

import { CommentsSection } from './comments-section'
import { PostActions } from './post-actions'
import { PostPhotoGallery } from './post-photo-gallery'

interface PostDetailProps {
  post: PostWithRelations
  currentUserId: string
}

export function PostDetail({ post, currentUserId }: PostDetailProps) {
  return (
    <div className="max-w-2xl mx-auto">
      {/* Header with back button */}
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/">
            <ArrowLeft className="size-4" />
            Voltar
          </Link>
        </Button>
      </div>

      {/* Post container */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Post header */}
        <div className="flex items-center gap-3 p-6">
          <Avatar className="size-12">
            <AvatarImage src={post.user?.image ?? ''} />
            <AvatarFallback>
              {getNameInitials(post.user?.fullName || 'Usuário Anônimo')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-base">
              {post.user?.fullName || 'Usuário Anônimo'}
            </h3>
            <p className="text-sm text-gray-500">
              {format(new Date(post.createdAt), "dd/MM/yyyy 'às' HH:mm")}
            </p>
          </div>
        </div>

        {/* Photo gallery */}
        <PostPhotoGallery photos={post.photos} post={post} />

        {/* Post content */}
        <div className="p-6">
          {/* Title and badges */}
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              {post.type === 'lost' ? `Perdi o ` : `Encontrei o `}
              <span className="text-teal-600">
                {capitalizeString(post.pet?.name ?? post.animalSpecies)}
              </span>
            </h2>

            {/* Animal info badges */}
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex gap-2 items-center">
                <Dog className="text-primary size-4" />
                <span className="text-sm font-medium">
                  {capitalizeString(post.animalSpecies)}
                </span>
              </div>
              <div className="flex gap-2 items-center">
                <Bone className="text-primary size-4" />
                <span className="text-sm font-medium">
                  {capitalizeString(post.animalBreed)}
                </span>
              </div>
              <div className="flex gap-2 items-center">
                <MapPin className="text-primary size-4" />
                <span className="text-sm font-medium">
                  {post.lastSeenLocation}
                </span>
              </div>
            </div>

            {/* Last seen date */}
            <p className="text-sm text-gray-600 mb-3">
              <span className="font-medium">
                {post.type === 'lost'
                  ? 'Visto pela última vez em:'
                  : 'Encontrado em:'}
              </span>{' '}
              {format(new Date(post.lastSeenDate), 'dd/MM/yyyy')}
            </p>
          </div>

          {/* Description */}
          {post.petDescription && (
            <div className="mb-4">
              <h3 className="font-semibold text-gray-900 text-sm mb-2">
                Descrição:
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                {post.petDescription}
              </p>
            </div>
          )}

          {/* Post actions */}
          <PostActions post={post} currentUserId={currentUserId} />
        </div>

        {/* Comments section */}
        <div className="border-t border-gray-100">
          <CommentsSection post={post} currentUserId={currentUserId} />
        </div>
      </div>
    </div>
  )
}
