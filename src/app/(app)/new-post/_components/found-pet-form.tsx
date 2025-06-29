'use client'

import { format } from 'date-fns'
import {
  BoneIcon,
  Calendar as CalendarIcon,
  ClipboardIcon,
  DogIcon,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'sonner'

import { animalSpecies } from '@/app/database/animal-species'
import { breedBySpecies } from '@/app/database/breed-by-species'
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
import { InputCombobox } from '@/components/ui/input-combobox'
import { PhotoUploadField } from '@/components/ui/photo-upload-field'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Textarea } from '@/components/ui/textarea'
import { useActionForm } from '@/hooks/use-action-form'
import { cn } from '@/lib/utils'
import { ComboboxOption } from '@/types/combobox-option'
import { PhotoData } from '@/types/photo-data'

import { createFoundPetPost } from '../actions'
import { foundPetSchema } from '../schema'

export function FoundPetForm() {
  const [photos, setPhotos] = useState<PhotoData[]>([])
  const router = useRouter()

  const form = useActionForm({
    schema: foundPetSchema,
    action: async (data) => {
      if (photos.length === 0) {
        toast.error('Adicione pelo menos uma foto do post')
        throw new Error('Pelo menos uma foto é obrigatória')
      }

      return createFoundPetPost(data, photos)
    },
    defaultValues: {
      animalSpecies: undefined,
      animalBreed: undefined,
      lastSeenDate: new Date(),
      petDescription: undefined,
    },
    onSubmitError: (error) => {
      toast.error(error?.message || 'Erro ao criar post')
    },
    onSubmitSuccess: () => {
      toast.success('Post criado com sucesso!')
      router.push('/')
    },
  })

  const selectedSpecies = form.watch('animalSpecies')

  // Data for combobox
  const animalSpeciesOptions = animalSpecies
  const breedOptionsBySpecies: Record<string, ComboboxOption[]> = breedBySpecies
  const animalBreedOptions = breedOptionsBySpecies[selectedSpecies] ?? []

  return (
    <Form {...form} className="flex flex-col gap-4">
      <FormField
        control={form.control}
        name="animalSpecies"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="!text-black">Espécie do animal</FormLabel>
            <FormControl>
              <InputCombobox
                icon={DogIcon}
                options={animalSpeciesOptions}
                placeholder="Selecione a espécie"
                {...field}
              />
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
            <FormLabel className="!text-black">Raça do animal</FormLabel>
            <FormControl>
              <InputCombobox
                icon={BoneIcon}
                options={animalBreedOptions}
                placeholder={animalBreedOptions[0]?.label ?? 'Selecione a raça'}
                {...field}
              />
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
              Quando você encontrou esse pet?
            </FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full pl-3 text-left font-normal',
                      !field.value && 'text-muted-foreground',
                    )}
                  >
                    {field.value ? (
                      format(field.value, 'dd/MM/yyyy')
                    ) : (
                      <span>Selecione uma data</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
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

      <div>
        <FormLabel className="!text-black">Fotos do pet</FormLabel>
        <PhotoUploadField photos={photos || []} setPhotos={setPhotos} />
        <p className="text-xs text-accent-foreground/80 mt-2">
          Suportado: JPEG, PNG, WebP. Máximo 5 fotos, 10MB cada.
        </p>
      </div>

      <Button className="w-full" size="rounded" type="submit">
        Criar post
      </Button>
    </Form>
  )
}
