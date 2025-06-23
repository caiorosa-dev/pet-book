import { LucideIcon } from 'lucide-react'
import * as React from 'react'

import { cn } from '@/lib/utils'

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  icon?: LucideIcon
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, icon: TextareaIcon, ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full">
        {TextareaIcon && (
          <TextareaIcon className="absolute left-3 top-3 flex items-center pointer-events-none text-primary h-4 w-4" />
        )}
        <textarea
          data-slot="textarea"
          className={cn(
            'border-input placeholder:text-accent-foreground/80 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
            TextareaIcon && 'pl-8',
            className,
          )}
          ref={ref}
          {...props}
        />
      </div>
    )
  },
)
Textarea.displayName = 'Textarea'

export { Textarea }
