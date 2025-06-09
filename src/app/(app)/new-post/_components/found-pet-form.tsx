'use client'

import { format } from 'date-fns'
import {
  BoneIcon,
  Calendar as CalendarIcon,
  Camera,
  Clipboard,
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
    <Form {...form}>
      <FormField
        control={form.control}
        name="species"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="!text-black">
              Qual a espécie encontrada?
            </FormLabel>
            <FormControl>
              <div className="relative">
                <Dog className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary w-5 h-5" />
                <Input {...field} placeholder="Cachorro" className="pl-10" />
              </div>
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
              <div className="relative">
                <BoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary w-5 h-5" />
                <Input placeholder="Husky" {...field} className="pl-10" />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="datetimeLastSeen"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel className="!text-black">
              Aonde foi visto por último?
            </FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full text-left font-normal justify-start gap-2', // <-- ajuste aqui
                      !field.value && 'text-muted-foreground',
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
              <div className="relative">
                <Clipboard className="absolute left-3 top-3 text-primary w-5 h-5" />
                <Textarea
                  placeholder="É um husky que tem os olhos azuis e coloração branca com preto."
                  className="resize-none pl-10"
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
              <label className="w-40 h-40 rounded-md border-[3px] border-dashed flex items-center justify-center cursor-pointer hover:bg-muted/50">
                <Camera className="w-6 h-6 text-muted-foreground" />
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
              </label>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {previews}
      <Button className="w-full" type="submit">
        Criar post
      </Button>
    </Form>
  )
}
