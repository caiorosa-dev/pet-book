import Link from 'next/link'

import { Button } from '@/components/ui/button'
import {
  Carousel,
  CarouselContent,
  CarouselControlledShowComponent,
  CarouselIndicator,
  CarouselNext,
} from '@/components/ui/carousel'

import WelcomeCarouselItem from './_components/welcome-carousel-item'

export default function Home() {
  return (
    <>
      <div className="max-w-xl w-full py-12 px-4 mt-4">
        <Carousel>
          <CarouselContent>
            <WelcomeCarouselItem
              imgSrc="/images/step-one.svg"
              title="O lugar para quem perdeu seu pet"
              description="Poste o seu animal na nossa rede social dedicada a procurar o seu pet."
              maxHeight="240px"
            />
            <WelcomeCarouselItem
              imgSrc="/images/step-two.svg"
              title="Para quem achou um pet"
              description="Na nossa plataforma você também pode postar se achou algum animal de alguém e compartilhar a localização e fotos."
              maxHeight="220px"
            />
            <WelcomeCarouselItem
              imgSrc="/images/step-three.svg"
              title="Comunidades & ONGs"
              description="Além disso tudo, ainda permitimos que ONGs criem comunidades com os membros da Petbook."
              maxHeight="230px"
            />
          </CarouselContent>
          <div className="mt-6 flex justify-center items-center">
            <CarouselIndicator />
          </div>
          <footer className="flex justify-center items-center mt-16 px-8 gap-4 flex-col">
            <CarouselControlledShowComponent last={true}>
              <Link href="/register" className="w-full">
                <Button variant="default" className="w-full" size="rounded">
                  Criar sua conta
                </Button>
              </Link>
            </CarouselControlledShowComponent>
            <CarouselControlledShowComponent last={false}>
              <CarouselNext size="rounded" className="w-full" variant="default">
                Próximo
              </CarouselNext>
            </CarouselControlledShowComponent>
            <CarouselControlledShowComponent last={true}>
              <Link href="/login" className="w-full">
                <Button variant="muted" className="w-full" size="rounded">
                  Já tenho uma conta
                </Button>
              </Link>
            </CarouselControlledShowComponent>
          </footer>
        </Carousel>
      </div>
    </>
  )
}
