import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Carousel, CarouselContent } from '@/components/ui/carousel'

import { getUserPets } from '../new-pet/actions'
import PetComponent from './pet-component'

export default async function PetsList() {
  const pets = await getUserPets()

  return (
    <div className="flex flex-col gap-4 mt-12 items-center">
      <h1 className="text-x1">Seus Pets</h1>
      {pets.length > 0 ? (
        <Carousel className="w-full">
          <CarouselContent>
            {pets.map((pet) => (
              <PetComponent key={pet.id} pet={pet} />
            ))}
          </CarouselContent>
        </Carousel>
      ) : (
        <div className="text-center py-8">
          <p className="text-slate-600">Você ainda não adicionou nenhum pet.</p>
          <p className="text-slate-500 text-sm">
            Adicione seu primeiro pet para começar a postar!
          </p>
        </div>
      )}
      <Link href="/profile/new-pet">
        <Button>Adicionar novo pet</Button>
      </Link>
    </div>
  )
}
