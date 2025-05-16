import { Bone, Dog, NotebookPen } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { CarouselItem } from '@/components/ui/carousel'

export default function PetComponent() {
  return (
    <CarouselItem className="basis-[60%]">
      <div className="gap-4 w-full rounded-xl">
        <img src="https://www.shutterstock.com/image-photo/happy-puppy-welsh-corgi-14-600nw-2270841247.jpg" />
        {/* <img src="https://hips.hearstapps.com/hmg-prod/images/golden-retriever-dog-royalty-free-image-505534037-1565105327.jpg?crop=0.760xw:1.00xh;0.204xw,0&resize=980:*" className="rounded-t-xl" /> */}
        <div className="w-full bg-secondary p-3 rounded-b-xl">
          <div className="flex justify-between items-center mb-2">
            <p className="text-base text-primary font-medium">Cleiton</p>
            <Button variant="accent" size="sm">
              Editar <NotebookPen className="size-4" />
            </Button>
          </div>
          <div className="flex gap-4">
            <div className="flex gap-1">
              <Bone className="text-primary size-4" />
              <span className="text-xs">Viralata</span>
            </div>
            <div className="flex gap-1">
              <Dog className="text-primary size-4" />
              <span className="text-xs">Cachorro</span>
            </div>
          </div>
        </div>
      </div>
    </CarouselItem>
  )
}
