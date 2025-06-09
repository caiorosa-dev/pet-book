'use client'

import { format } from 'date-fns'
import {
  Calendar as CalendarIcon,
  CameraIcon,
  ClipboardIcon,
  Dog,
} from 'lucide-react'
import React, { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useActionForm } from '@/hooks/use-action-form'
import { cn } from '@/lib/utils'

import { createLostPetPost } from '../actions'
import { lostPetSchema } from '../schema'

export type LostPetFormProps = {
  userPets: {
    id: string
    name: string
  }[]
}

export function LostPetForm({ userPets }: LostPetFormProps) {
  const [previews, setPreviews] = useState<string[]>([])

  const form = useActionForm({
    schema: lostPetSchema,
    action: createLostPetPost,
  })

  return (
    <Form {...form} className="space-y-6">
      <FormField
        control={form.control}
        name="pet"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="!text-black">Qual pet você perdeu</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="w-full">
                  <div className="flex items-center gap-2 w-full">
                    <Dog className="w-4 h-4 text-primary" />
                    <SelectValue placeholder="Selecione seu pet" />
                  </div>
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="pretinha">Pretinha</SelectItem>
                {userPets.map((pet) => (
                  <SelectItem key={pet.id} value={pet.id}>
                    {pet.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="datetimeLastSeen"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="!text-black">
              Quando foi visto por último
            </FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full text-left font-normal justify-start gap-2', // <-- ajuste aqui
                      !field.value && 'text-muted',
                    )}
                  >
                    <CalendarIcon className="h-4 w-4 text-primary" />
                    {field.value ? (
                      format(field.value, 'PPP')
                    ) : (
                      <span>Selecione uma data</span>
                    )}
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  disabled={(date) =>
                    date > new Date() || date < new Date('1900-01-01')
                  }
                  captionLayout="dropdown"
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="lastTimeSeenDescription"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="!text-black">
              Aonde foi visto por último?
            </FormLabel>
            <FormControl>
              <div className="relative">
                <Textarea
                  icon={ClipboardIcon}
                  placeholder="Eu vi ele por último na Rua Graça N 295, quem ver ele por favor me chama aqui pela plataforma 😫"
                  {...field}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="images"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="!text-black">Selecione fotos</FormLabel>
            <FormControl>
              <Label className="inline-flex flex-col justify-center items-center border-[3px] border-dashed rounded-2xl p-4 cursor-pointer h-32 w-32">
                <CameraIcon className="w-8 h-8 text-primary" />
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || [])
                    field.onChange(e.target.files)

                    const filePreviews = files.map((file) =>
                      URL.createObjectURL(file),
                    )
                    setPreviews(filePreviews)
                  }}
                />
              </Label>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {previews}
      <Button className="w-full" size="rounded" type="submit">
        Criar post
      </Button>
    </Form>
  )
}
