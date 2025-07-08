import { BoneIcon, DogIcon } from 'lucide-react'
import Image from 'next/image'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import type { PetWithRelations } from '@/types/database'

interface PetsListProps {
  pets?: PetWithRelations[]
}

export default function PetsList({ pets = [] }: PetsListProps) {
  if (pets.length === 0) {
    return (
      <>
        <h2 className="pb-3">Animais</h2>
        <div className="text-center py-8">
          <p className="text-gray-500">Nenhum animal encontrado</p>
        </div>
      </>
    )
  }

  return (
    <>
      <h2 className="pb-3">Animais</h2>
      <ScrollArea className="whitespace-nowrap scroll-smooth">
        <div className="flex gap-6">
          {pets.map((pet) => {
            const mainPhoto = pet.photos?.[0]
            return (
              <Card
                key={pet.id}
                className="w-64 p-0 gap-2 !border-0 flex-shrink-0"
              >
                <CardHeader className="relative w-64 h-64 overflow-hidden rounded">
                  {mainPhoto ? (
                    <>
                      <Image
                        src={mainPhoto.s3Url}
                        alt={`Foto de ${pet.name}`}
                        fill
                        className="object-cover rounded"
                      />
                      {pet.photos.length > 1 && (
                        <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                          +{pet.photos.length - 1}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full bg-slate-200 rounded flex items-center justify-center">
                      <DogIcon className="text-slate-400 size-16" />
                    </div>
                  )}
                </CardHeader>
                <CardContent className="pb-4">
                  <h6 className="pb-3 text-xl font-semibold text-primary">
                    {pet.name}
                  </h6>
                  <div className="flex gap-4">
                    <div className="flex gap-2">
                      <BoneIcon className="text-primary" />
                      <p className="text-sm">{pet.breed}</p>
                    </div>
                    <div className="flex gap-2">
                      <DogIcon className="text-primary" />
                      <p className="text-sm">{pet.species}</p>
                    </div>
                  </div>
                  {pet.characteristics && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {pet.characteristics}
                      </p>
                    </div>
                  )}
                  {pet.owner && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-500">
                        Dono: {pet.owner.fullName}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </>
  )
}
