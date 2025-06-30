'use client'

import { ChevronLeft, ChevronRight, Dog } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import type { PostPhoto } from '@/generated'
import type { PostWithRelations } from '@/types/database'

interface PostPhotoGalleryProps {
  photos: PostPhoto[]
  post: PostWithRelations
}

export function PostPhotoGallery({ photos, post }: PostPhotoGalleryProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)

  if (!photos || photos.length === 0) {
    return (
      <div className="w-full h-80 bg-slate-200 flex items-center justify-center">
        <div className="text-center">
          <Dog className="text-slate-400 size-16 mx-auto mb-2" />
          <p className="text-slate-500 text-sm">Nenhuma foto disponível</p>
        </div>
      </div>
    )
  }

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length)
  }

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length)
  }

  return (
    <div className="relative">
      {/* Main photo */}
      <div className="relative w-full h-80 bg-gray-100">
        <Image
          src={photos[currentPhotoIndex].s3Url}
          alt={`Foto ${currentPhotoIndex + 1} do ${post.animalSpecies} ${post.animalBreed}`}
          fill
          className="object-cover"
          priority={currentPhotoIndex === 0}
        />

        {/* Navigation arrows */}
        {photos.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="sm"
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white"
              onClick={prevPhoto}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white"
              onClick={nextPhoto}
            >
              <ChevronRight className="size-4" />
            </Button>
          </>
        )}

        {/* Photo counter */}
        {photos.length > 1 && (
          <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded">
            {currentPhotoIndex + 1} / {photos.length}
          </div>
        )}
      </div>

      {/* Thumbnail strip */}
      {photos.length > 1 && (
        <div className="flex gap-2 p-4 overflow-x-auto">
          {photos.map((photo, index) => (
            <button
              key={photo.id}
              onClick={() => setCurrentPhotoIndex(index)}
              className={`relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                index === currentPhotoIndex
                  ? 'border-teal-500'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Image
                src={photo.s3Url}
                alt={`Miniatura ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
