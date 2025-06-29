import { CameraIcon, Loader2, X } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { processImageFiles } from '@/lib/image-utils'
import { PhotoData } from '@/types/photo-data'

type PhotoUploadFieldProps = {
  photos: PhotoData[]
  setPhotos: React.Dispatch<React.SetStateAction<PhotoData[]>>
  maxNumberOfPhotos?: number
}

export function PhotoUploadField({
  photos,
  setPhotos,
  maxNumberOfPhotos = 5,
}: PhotoUploadFieldProps) {
  const [photoLoading, setPhotoLoading] = useState(false)

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])

    if (files.length === 0) return

    // Verificar se não excede o limite de maxNumberOfPhotos fotos
    if (photos.length + files.length > maxNumberOfPhotos) {
      toast.error(`Você pode adicionar no máximo ${maxNumberOfPhotos} fotos`)
      return
    }

    setPhotoLoading(true)

    try {
      const processedPhotos = await processImageFiles(files)
      setPhotos((prev) => [...prev, ...processedPhotos])
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Erro ao processar imagens')
      }
    } finally {
      setPhotoLoading(false)
    }

    // Limpar o input
    e.target.value = ''
  }

  function removePhoto(photoId: string) {
    setPhotos((prev) => prev.filter((photo) => photo.id !== photoId))
  }

  return (
    <div className="flex gap-4 flex-wrap mt-2">
      {photos.map((photo) => (
        <div key={photo.id} className="relative">
          <Image
            src={photo.preview}
            alt={photo.filename}
            width={128}
            height={128}
            className="w-32 h-32 object-cover rounded-xl border"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute top-1 right-1 h-6 w-6 bg-white/80 backdrop-blur-sm rounded-full shadow-md text-gray-700 hover:text-red-400"
            onClick={() => removePhoto(photo.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}

      {photos.length < maxNumberOfPhotos && (
        <label className="w-32 h-32 flex flex-col items-center justify-center border-[3px] border-dashed rounded-2xl cursor-pointer hover:bg-accent transition">
          {photoLoading ? (
            <Loader2 className="animate-spin text-muted" size={32} />
          ) : (
            <>
              <CameraIcon className="w-8 h-8 text-primary" />
              <p className="text-xs text-muted mt-1">
                Foto {photos.length + 1}
              </p>
            </>
          )}
          <Input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handlePhotoChange}
            disabled={photoLoading}
          />
        </label>
      )}
    </div>
  )
}
