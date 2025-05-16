import { MapPin, MessagesSquare } from 'lucide-react'

import { Logo } from '@/components/misc/logo'
import { Button } from '@/components/ui/button'

export function Header({ currentLocation }: { currentLocation: string }) {
  return (
    <header className="max-w-xl w-full mx-auto flex items-center justify-between p-4">
      <Logo />
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm">
          <MapPin className="size-5 text-primary" />
          <span className="mx-4">{currentLocation}</span>
        </Button>
        <Button variant="secondary" size="icon" className="text-primary">
          <MessagesSquare className="size-5" />
        </Button>
      </div>
    </header>
  )
}
