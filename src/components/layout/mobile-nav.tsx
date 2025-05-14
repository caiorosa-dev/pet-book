'use client'

import { GlobeIcon, Home, PlusCircleIcon, SearchIcon, User } from 'lucide-react'
import Link from 'next/link'

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
  const isActive = exact
    ? window.location.pathname === href
    : window.location.pathname.startsWith(href)

  return (
    <li
      className={`group rounded-md w-12 h-12 flex justify-center items-center ${isActive ? 'bg-primary' : 'bg-transparent'}`}
    >
      <Link
        href={href}
        className={`flex items-center justify-center ${isActive ? 'text-primary-foreground' : 'text-muted-foreground hover:text-primary'}`}
      >
        <Icon
          className={`h-5 w-5 ${isActive ? 'text-primary-foreground' : 'group-hover:text-primary'}`}
        />
      </Link>
    </li>
  )
}

export function MobileNav({ className }: MobileNavProps) {
  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 w-full bg-slate-100 dark:bg-slate-900 py-1',
        className,
      )}
    >
      <ul className="flex justify-around items-center max-w-xl w-full mx-auto">
        <MobileNavLink href="/" icon={Home} exact />
        <MobileNavLink href="/" icon={SearchIcon} />
        <MobileNavLink href="/" icon={PlusCircleIcon} />
        <MobileNavLink href="/" icon={GlobeIcon} />
        <MobileNavLink href="/" icon={User} />
      </ul>
    </nav>
  )
}
