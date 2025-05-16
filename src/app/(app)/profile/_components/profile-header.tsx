import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

export default function ProfileHeader() {
  return (
    <header className="space-y-4">
      <div className="flex w-full justify-between gap-4 items-center">
        <div className="flex flex-col items-center justify-center">
          <Avatar className="w-24 h-24">
            <AvatarImage
              src={'https://randomuser.me/api/portraits/men/69.jpg'}
            />
          </Avatar>
        </div>
        <div className="flex gap-4 justify-center w-full text-center">
          <div>
            <h1 className="text-2xl">3</h1>
            <p className="text-muted text-base">pets</p>
          </div>
          <div>
            <h1 className="text-2xl">17</h1>
            <h2 className="text-muted text-base">Encontrados</h2>
          </div>
          <div>
            <h1 className="text-2xl">10</h1>
            <h2 className="text-muted text-base">Posts</h2>
          </div>
        </div>
      </div>
      <div className="flex justify-between">
        <h1 className="text-xl">Marty McFly</h1>
        <a className="text-primary">@marty_mcfly</a>
      </div>

      <div className="flex gap-4">
        <Button variant="accent" size="sm" className="flex-1">
          Editar perfil
        </Button>
        <Button variant="accent" size="sm" className="flex-1">
          Compartilhar Perfil
        </Button>
      </div>
    </header>
  )
}
