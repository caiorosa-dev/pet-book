'use client'

import { format } from 'date-fns'
import {
  BoneIcon,
  Calendar as CalendarIcon,
  CameraIcon,
  ClipboardIcon,
  DogIcon,
} from 'lucide-react'
import Image from 'next/image'
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
import { Textarea } from '@/components/ui/textarea'
import { useActionForm } from '@/hooks/use-action-form'
import { cn } from '@/lib/utils'

import { createFoundPetPost } from '../actions'
import { foundPetSchema } from '../schema'

export function FoundPetForm() {
  const [previews, setPreviews] = useState<string[]>([])

  const form = useActionForm({
    schema: foundPetSchema,
    action: createFoundPetPost,
    defaultValues: {
      breed: '',
      datetimeLastSeen: new Date(),
      description: '',
      images: [],
      species: '',
    },
  })

  return (
    <Form {...form} className="space-y-6">
      <FormField
        control={form.control}
        name="animalSpecies"
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
        name="animalBreed"
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
        name="lastSeenDate"
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
        name="petDescription"
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
        name="photos"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="!text-black">Selecione fotos</FormLabel>
            <FormControl>
              <div className="flex gap-4 flex-wrap">
                {previews.map((src, idx) => (
                  <Image
                    key={idx}
                    src={src}
                    alt={`Preview ${idx + 1}`}
                    width={24}
                    height={24}
                    className="w-32 h-32 object-cover rounded-xl border"
                  />
                ))}

                <Label className="inline-flex flex-col justify-center items-center border-[3px] border-dashed rounded-2xl p-4 cursor-pointer h-32 w-32">
                  <CameraIcon className="w-8 h-8 text-primary" />
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || [])

                      // create URLs for previews
                      const filePreviews = files.map((file) =>
                        URL.createObjectURL(file),
                      )

                      // Update your previews state with new previews
                      setPreviews((prev) => [...prev, ...filePreviews])

                      // Update form field value with all preview URLs (not the FileList)
                      field.onChange([...previews, ...filePreviews])
                    }}
                  />
                </Label>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button className="w-full" size="rounded" type="submit">
        Criar post
      </Button>
    </Form>
  )
}
