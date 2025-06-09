'use client'

import { format } from 'date-fns'
import {
  BoneIcon,
  Calendar as CalendarIcon,
  CameraIcon,
  ClipboardIcon,
  DogIcon,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Textarea } from '@/components/ui/textarea'
import { useClientForm } from '@/hooks/use-client-form'
import { cn } from '@/lib/utils'

import { foundPetSchema } from '../schema'

export function FoundPetForm() {
  const [previews, setPreviews] = useState<string[]>([])

  const form = useClientForm({
    schema: foundPetSchema,
    handler: (data) => {
      console.log(data)
    },
  })

  return (
    <Form {...form} className="space-y-6">
      <FormField
        control={form.control}
        name="species"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="!text-black">
              Qual a espécie encontrada?
            </FormLabel>
            <FormControl>
              <Input {...field} placeholder="Cachorro" icon={DogIcon} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="breed"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="!text-black">
              Qual a raça do pet encontrado?
            </FormLabel>
            <FormControl>
              <Input placeholder="Husky" {...field} icon={BoneIcon} />
            </FormControl>
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
              Aonde foi visto por último?
            </FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full text-left font-normal justify-start gap-2',
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
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="!text-black">
              Descreva o pet encontrado
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="É um husky que tem os olhos azuis e coloração branca com preto."
                icon={ClipboardIcon}
                {...field}
              />
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
              <Input
                type="file"
                accept="image/*"
                multiple
                icon={CameraIcon}
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
