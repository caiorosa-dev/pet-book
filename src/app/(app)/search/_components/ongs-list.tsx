import { Building2Icon } from 'lucide-react'
import Image from 'next/image'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { getNameInitials } from '@/helpers/get-name-initials'

interface Ong {
  id: string
  fullName: string
  userName: string
  image: string | null
  createdAt: Date
  _count: {
    pets: number
    posts: number
  }
}

interface OngsListProps {
  ongs?: Ong[]
}

export default function OngsList({ ongs = [] }: OngsListProps) {
  if (ongs.length === 0) {
    return (
      <>
        <h2 className="pb-3">ONGs e Comunidades</h2>
        <div className="text-center py-8">
          <p className="text-gray-500">Nenhuma ONG ou comunidade encontrada</p>
        </div>
      </>
    )
  }

  return (
    <>
      <h2 className="pb-3">ONGs e Comunidades</h2>
      <ScrollArea className="whitespace-nowrap scroll-smooth">
        <div className="flex gap-6">
          {ongs.map((ong) => (
            <Card key={ong.id} className="w-64 p-0 gap-2 !border-0 flex-shrink-0">
              <CardHeader className="relative w-64 h-64 overflow-hidden rounded">
                <div className="w-full h-full bg-gradient-to-br from-green-100 to-teal-100 flex items-center justify-center">
                  <Avatar className="size-24">
                    <AvatarImage src={ong.image ?? ''} />
                    <AvatarFallback className="text-2xl">
                      {getNameInitials(ong.fullName)}
                    </AvatarFallback>
                  </Avatar>
                  <Building2Icon className="absolute bottom-2 right-2 size-6 text-green-600 bg-white rounded-full p-1" />
                </div>
              </CardHeader>
              <CardContent className="pb-4">
                <h6 className="pb-1 text-xl font-semibold text-primary">
                  {ong.fullName}
                </h6>
                <p className="text-sm text-gray-600 mb-3">@{ong.userName}</p>

                <div className="flex gap-4 text-sm">
                  <div className="text-center">
                    <p className="font-semibold text-primary">{ong._count.pets}</p>
                    <p className="text-xs text-gray-500">Pets</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-primary">{ong._count.posts}</p>
                    <p className="text-xs text-gray-500">Posts</p>
                  </div>
                </div>

                <div className="mt-3 bg-green-50 rounded-lg p-2">
                  <p className="text-xs text-green-700 font-medium">
                    Organização ativa
                  </p>
                  <p className="text-xs text-gray-500">
                    Ajudando animais desde {new Date(ong.createdAt).toLocaleDateString('pt-BR', {
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </>
  )
}
