import { PropsWithChildren } from 'react'

import { cn } from '@/lib/utils'

export function FullScreenPage({
  children,
  className,
  inApp,
}: PropsWithChildren<{ className?: string; inApp?: boolean }>) {
  return (
    <main
      className={cn(
        'w-full min-h-screen h-full',
        inApp && 'grid grid-rows-[auto_1fr]',
        className,
      )}
    >
      {children}
    </main>
  )
}
