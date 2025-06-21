import { MapPin, Radar } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { Button, ButtonIcon } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'

export default function CreatePostPage() {
  return (
    <>
      <div className="max-w-xl w-full mx-auto h-full flex flex-col gap-10 items-center">
        <h1 className="text-3xl font-bold text-center">Novo conteúdo</h1>
        <p className="text-center text-secondary-foreground">
          Informe as informações de seu pet para começar a postar com ele.
        </p>

        <Card className="items-center">
          <CardContent>
            <Image
              src="/images/found-pet-post.svg"
              alt="found-pet-post"
              width={24}
              height={24}
              className="size-48"
            />
          </CardContent>
          <CardFooter>
            <Link href="/new-post/found-pet">
              <Button>
                <ButtonIcon icon={MapPin} />
                Encontrei um pet
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="items-center">
          <CardContent>
            <Image
              src="/images/lost-pet-post.svg"
              alt="lost-pet-post"
              width={24}
              height={24}
              className="size-48"
            />
          </CardContent>
          <CardFooter>
            <Link href="/new-post/lost-pet">
              <Button>
                <ButtonIcon icon={Radar} />
                Perdi meu pet
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </>
  )
}
