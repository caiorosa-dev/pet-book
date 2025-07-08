'use client'

import { User } from 'better-auth'
import { GlobeIcon, Home, PlusCircleIcon, SearchIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { getNameInitials } from '@/helpers/get-name-initials'
import { cn } from '@/lib/utils'

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

type MobileNavProps = {
  className?: string
  user: User
}

type MobileNavLinkProps = {
  href: string
  exact?: boolean
  disabled?: boolean
  icon: React.ElementType
}

function MobileNavLink({
  href,
  icon: Icon,
  exact,
  disabled,
}: MobileNavLinkProps) {
  const pathname = usePathname()

  const isActive = exact ? pathname === href : pathname.startsWith(href)

  if (disabled) {
    return (
      <div className="rounded-full size-12 flex justify-center items-center opacity-50">
        <Icon className="h-5 w-5" />
      </div>
    )
  }

  return (
    <Link
      href={href}
      className={cn(
        'group rounded-full size-12 flex justify-center items-center hover:bg-secondary',
        isActive ? 'text-primary' : 'text-muted cursor-pointer',
      )}
    >
      <Icon className="h-5 w-5" />
    </Link>
  )
}

function UserImage({ user }: { user: User }) {
  const pathname = usePathname()

  const isActive = pathname === '/profile'

  return (
    <Link
      href={'/profile'}
      className="rounded-full size-12 flex justify-center items-center hover:bg-secondary"
    >
      <Avatar
        className={cn(
          'rounded-full size-9 bg-secondary transition-all duration-300',
          isActive ? 'border-2 border-primary' : '',
        )}
      >
        <AvatarImage src={user.image ?? ''} />
        <AvatarFallback>{getNameInitials(user.name)}</AvatarFallback>
      </Avatar>
    </Link>
  )
}

export function MobileNav({ className, user }: MobileNavProps) {
  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 w-full bg-background py-1',
        className,
      )}
    >
      <ul className="flex justify-around items-center max-w-xl w-full mx-auto">
        <MobileNavLink href="/" icon={Home} exact />
        <MobileNavLink href="/search" icon={SearchIcon} />
        <MobileNavLink href="/new-post" icon={PlusCircleIcon} />
        <MobileNavLink href="/orgs" icon={GlobeIcon} disabled />
        <UserImage user={user} />
      </ul>
    </nav>
  )
}
