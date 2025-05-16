'use client'

import { GlobeIcon, Home, PlusCircleIcon, SearchIcon, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'

type MobileNavProps = {
  className?: string
}

type MobileNavLinkProps = {
  href: string
  exact?: boolean
  icon: React.ElementType
}

function MobileNavLink({ href, icon: Icon, exact }: MobileNavLinkProps) {
  const pathname = usePathname()

  const isActive = exact ? pathname === href : pathname.startsWith(href)

  return (
    <li
      className={cn(
        'group rounded-full w-12 h-12 flex justify-center items-center hover:bg-secondary',
        isActive ? 'text-primary' : 'text-muted  cursor-pointer',
      )}
    >
      <Link href={href} className={`flex items-center justify-center `}>
        <Icon className={`h-5 w-5`} />
      </Link>
    </li>
  )
}

export function MobileNav({ className }: MobileNavProps) {
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
        <MobileNavLink href="/orgs" icon={GlobeIcon} />
        <MobileNavLink href="/profile" icon={User} />
      </ul>
    </nav>
  )
}
