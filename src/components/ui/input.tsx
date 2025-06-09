import React from 'react'

import { cn } from '@/lib/utils'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.FC<React.SVGProps<SVGSVGElement>>
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon: InputIcon, ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full">
        {InputIcon && (
          <InputIcon className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-primary h-4 w-4" />
        )}
        <input
          type={type}
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-accent-foreground/80 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
            InputIcon && 'pl-8',
            className,
          )}
          ref={ref}
          {...props}
        />
      </div>
    )
  },
)
Input.displayName = 'Input'

export { Input }
