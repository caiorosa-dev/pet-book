import { BoneIcon, DogIcon } from 'lucide-react'
import Image from 'next/image'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

export default function PetsList() {
  return (
    <>
      <h2 className="pb-3">Animais</h2>
      <ScrollArea className="whitespace-nowrap scroll-smooth">
        <div className="flex gap-6 ">
          <Card className="w-64 p-0 gap-2 !border-0">
            <CardHeader className="relative w-64 h-64 overflow-hidden rounded">
              <Image
                src="/images/pets/happy-puppy.jpg"
                alt="Foto de uma cachorro feliz"
                fill
                className="object-cover rounded"
              />
            </CardHeader>
            <CardContent className="pb-4">
              <h6 className="pb-3 text-xl font-semibold text-primary">
                Cleiton
              </h6>
              <div className="flex gap-4">
                <div className="flex gap-2">
                  <BoneIcon className="text-primary" />
                  <p className="text-sm">Viralata</p>
                </div>
                <div className="flex gap-2">
                  <DogIcon className="text-primary" />
                  <p className="text-sm">Cachorro</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="w-64 p-0 gap-2 !border-0">
            <CardHeader className="relative w-64 h-64 overflow-hidden rounded">
              <Image
                src="/images/pets/happy-puppy.jpg"
                alt="Foto de uma cachorro feliz"
                fill
                className="object-cover rounded"
              />
            </CardHeader>
            <CardContent className="pb-4">
              <h6 className="pb-3 text-xl font-semibold text-primary">
                Cleiton
              </h6>
              <div className="flex gap-4">
                <div className="flex gap-2">
                  <BoneIcon className="text-primary" />
                  <p className="text-sm">Viralata</p>
                </div>
                <div className="flex gap-2">
                  <DogIcon className="text-primary" />
                  <p className="text-sm">Cachorro</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="w-64 p-0 gap-2 !border-0">
            <CardHeader className="relative w-64 h-64 overflow-hidden rounded">
              <Image
                src="/images/pets/happy-puppy.jpg"
                alt="Foto de uma cachorro feliz"
                fill
                className="object-cover rounded"
              />
            </CardHeader>
            <CardContent className="pb-4">
              <h6 className="pb-3 text-xl font-semibold text-primary">
                Cleiton
              </h6>
              <div className="flex gap-4">
                <div className="flex gap-2">
                  <BoneIcon className="text-primary" />
                  <p className="text-sm">Viralata</p>
                </div>
                <div className="flex gap-2">
                  <DogIcon className="text-primary" />
                  <p className="text-sm">Cachorro</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="w-64 p-0 gap-2 !border-0">
            <CardHeader className="relative w-64 h-64 overflow-hidden rounded">
              <Image
                src="/images/pets/happy-puppy.jpg"
                alt="Foto de uma cachorro feliz"
                fill
                className="object-cover rounded"
              />
            </CardHeader>
            <CardContent className="pb-4">
              <h6 className="pb-3 text-xl font-semibold text-primary">
                Cleiton
              </h6>
              <div className="flex gap-4">
                <div className="flex gap-2">
                  <BoneIcon className="text-primary" />
                  <p className="text-sm">Viralata</p>
                </div>
                <div className="flex gap-2">
                  <DogIcon className="text-primary" />
                  <p className="text-sm">Cachorro</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="w-64 p-0 gap-2 !border-0">
            <CardHeader className="relative w-64 h-64 overflow-hidden rounded">
              <Image
                src="/images/pets/happy-puppy.jpg"
                alt="Foto de uma cachorro feliz"
                fill
                className="object-cover rounded"
              />
            </CardHeader>
            <CardContent className="pb-4">
              <h6 className="pb-3 text-xl font-semibold text-primary">
                Cleiton
              </h6>
              <div className="flex gap-4">
                <div className="flex gap-2">
                  <BoneIcon className="text-primary" />
                  <p className="text-sm">Viralata</p>
                </div>
                <div className="flex gap-2">
                  <DogIcon className="text-primary" />
                  <p className="text-sm">Cachorro</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </>
  )
}
