import { Button } from '@/components/ui/button'
import { Carousel, CarouselContent } from '@/components/ui/carousel'

import PetComponent from './pet-component'

export default function PetsList() {
  return (
    <div className="flex flex-col gap-4 mt-12">
      <h1 className="text-x1">Seus Pets</h1>
      <Carousel className="w-full">
        <CarouselContent>
          <PetComponent />
          <PetComponent />
          <PetComponent />
          <PetComponent />
          <PetComponent />
          <PetComponent />
        </CarouselContent>
      </Carousel>
      <Button className="w-1/2">Adicionar novo pet</Button>
    </div>
  )
}
