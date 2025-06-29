import { UserIcon } from 'lucide-react'
import { headers } from 'next/headers'
import Link from 'next/link'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { auth } from '@/lib/auth'

import { getUserStats } from '../new-pet/actions'
import { SignOutButton } from './sign-out'

export default async function ProfileHeader() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  const stats = await getUserStats()

  return (
    <header className="space-y-4">
      <div className="flex w-full justify-between gap-4 items-center">
        <div className="flex flex-col items-center justify-center">
          <Avatar className="w-24 h-24">
            <AvatarImage src={session?.user.image ?? ''} />
            <AvatarFallback>
              <UserIcon className="size-10" />
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex gap-4 justify-center w-full text-center">
          <div>
            <h1 className="text-2xl">{stats.pets}</h1>
            <p className="text-muted text-base">pets</p>
          </div>
          <div>
            <h1 className="text-2xl">{stats.found}</h1>
            <h2 className="text-muted text-base">Encontrados</h2>
          </div>
          <div>
            <h1 className="text-2xl">{stats.posts}</h1>
            <h2 className="text-muted text-base">Posts</h2>
          </div>
        </div>
      </div>
      <div className="flex justify-between">
        <h1 className="text-xl">{session?.user.name}</h1>
        <a className="text-primary">@{session?.user.username}</a>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <SignOutButton />
        <Link href={'profile/edit'} className="flex-1">
          <Button variant="accent" size="sm" className="w-full">
            Editar perfil
          </Button>
        </Link>
        <Button variant="accent" size="sm" className="flex-1">
          Compartilhar Perfil
        </Button>
      </div>
    </header>
  )
}
