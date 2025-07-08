/* eslint-disable @next/next/no-img-element */
import { Bone, Dog, NotebookPen } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { CarouselItem } from '@/components/ui/carousel'
import type { PetWithRelations } from '@/types/database'

interface PetComponentProps {
  pet: PetWithRelations
}

export default function PetComponent({ pet }: PetComponentProps) {
  const mainPhoto = pet.photos?.[0]

  return (
    <CarouselItem className="basis-[60%]">
      <div className="gap-4 w-full rounded-xl">
        {mainPhoto ? (
          <div className="relative">
            <img
              src={mainPhoto.s3Url}
              alt={`Foto de ${pet.name}`}
              className="w-full h-48 object-cover rounded-t-xl"
            />
            {pet.photos.length > 1 && (
              <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                +{pet.photos.length - 1}
              </div>
            )}
          </div>
        ) : (
          <div className="w-full h-48 bg-slate-200 rounded-t-xl flex items-center justify-center">
            <Dog className="text-slate-400 size-16" />
          </div>
        )}
        <div className="w-full bg-secondary p-3 rounded-b-xl">
          <div className="flex justify-between items-center mb-2">
            <p className="text-base text-primary font-medium">{pet.name}</p>
            <Link href={`/profile/edit-pet/${pet.id}`}>
              <Button variant="accent" size="sm">
                Editar <NotebookPen className="size-4" />
              </Button>
            </Link>
          </div>
          <div className="flex gap-4">
            <div className="flex gap-1">
              <Bone className="text-primary size-4" />
              <span className="text-xs">{pet.breed}</span>
            </div>
            <div className="flex gap-1">
              <Dog className="text-primary size-4" />
              <span className="text-xs">{pet.species}</span>
            </div>
          </div>
          {pet.characteristics && (
            <div className="mt-2">
              <p className="text-xs text-slate-600">{pet.characteristics}</p>
            </div>
          )}
        </div>
      </div>
    </CarouselItem>
  )
}
