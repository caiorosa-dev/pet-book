import Image from 'next/image'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

export default function OngsList() {
  return (
    <>
      <h2 className="pb-3">ONGs e Comunidades</h2>
      <ScrollArea className="whitespace-nowrap scroll-smooth">
        <div className="flex gap-6">
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
                Marty McFly
              </h6>
              <p className="text-sm text-wrap">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.{' '}
              </p>
            </CardContent>
          </Card>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </>
  )
}
