import { MapPin, Radar } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export default function CreatePostPage() {
  return (
    <>
      <div className="max-w-xl w-full mx-auto h-full flex flex-col gap-10">
        <h1 className="text-3xl font-bold text-center">Novo conteúdo</h1>
        <p className="text-center text-secondary-foreground">
          Informe as informações de seu pet para começar a posta com ele
        </p>
        <Card className="items-center">
          <CardContent>
            <Image
              src="/images/found-pet-post.svg"
              alt="found-pet-post"
              width={24}
              height={24}
              className="size-96"
            />
          </CardContent>
          <CardFooter>
            <Button className="flex gap-2">
              <MapPin />
              Encontrei um pet
            </Button>
          </CardFooter>
        </Card>
        <Card className="items-center">
          <CardContent>
            <Image
              src="/images/lost-pet-post.svg"
              alt="lost-pet-post"
              width={24}
              height={24}
              className="size-96"
            />
          </CardContent>
          <CardFooter>
            <Button className="flex gap-2">
              <Radar /> Perdi meu pet
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
