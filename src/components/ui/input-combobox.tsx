import { Check, ChevronsUpDown, LucideIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

type Option = {
  label: string
  value: string
}

type InputComboboxProps = {
  options: readonly Option[]
  value: string
  onChange: (value: string) => void
  icon?: LucideIcon
  placeholder?: string
  emptyOptionsMessage?: string
  className?: string
}

export function InputCombobox({
  options,
  value,
  onChange,
  icon: InputIcon,
  placeholder = 'Select an option',
  emptyOptionsMessage = 'Nenhuma opção encontrada.',
  className,
}: InputComboboxProps) {
  const selectedLabel = options.find((opt) => opt.value === value)?.label

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn(
            'relative flex w-full justify-between',
            !value && 'text-accent-foreground/80',
            InputIcon && 'pl-8',
            className,
          )}
        >
          {InputIcon && (
            <InputIcon className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-primary h-4 w-4" />
          )}
          {selectedLabel ?? placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn(className, 'p-0')}>
        <Command>
          <CommandInput placeholder="Buscar..." className="h-9" />
          <CommandList>
            <CommandEmpty>{emptyOptionsMessage}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  onSelect={() => onChange(option.value)}
                >
                  {option.label}
                  <Check
                    className={cn(
                      'ml-auto h-4 w-4 text-black',
                      value === option.value ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
