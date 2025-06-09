import { CircleCheck, Globe, Home, Search, User } from 'lucide-react'

import { Button } from '../ui/button'

export function Navbar({ className }: { className?: string }) {
  return (
    <nav className={className ?? 'flex items-center justify-between p-4'}>
      <li>
        <ul>
          <Button className="bg-transparent hover:bg-accent">
            <Home className="text-primary" />
          </Button>
        </ul>
      </li>
      <li>
        <ul>
          <Button className="bg-transparent hover:bg-accent">
            <Search className="text-primary" />
          </Button>
        </ul>
      </li>
      <li>
        <ul>
          <Button className="bg-transparent hover:bg-accent">
            <CircleCheck className="text-primary" />
          </Button>
        </ul>
      </li>
      <li>
        <ul>
          <Button className="bg-transparent hover:bg-accent">
            <Globe className="text-primary" />
          </Button>
        </ul>
      </li>
      <li>
        <ul>
          <Button className="bg-transparent hover:bg-accent">
            <User className="text-primary" />
          </Button>
        </ul>
      </li>
    </nav>
  )
}
