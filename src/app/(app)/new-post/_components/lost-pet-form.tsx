'use client'

import { format } from 'date-fns'
import { Calendar as CalendarIcon, ClipboardIcon, DogIcon } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useWatch } from 'react-hook-form'
import { toast } from 'sonner'

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
import { capitalizeString } from '@/helpers/capitalize'
import { useActionForm } from '@/hooks/use-action-form'
import { cn } from '@/lib/utils'
import { ComboboxOption } from '@/types/combobox-option'
import type { PetWithRelations } from '@/types/database'
import { PhotoData } from '@/types/photo-data'

import { createLostPetPost } from '../actions'
import { lostPetSchema } from '../schema'

interface LostPetFormProps {
  userPets: readonly PetWithRelations[]
}

export function LostPetForm({ userPets }: LostPetFormProps) {
  const [photos, setPhotos] = useState<PhotoData[]>([])
  const [selectedPet, setSelectedPet] = useState<PetWithRelations | null>(null)
  const router = useRouter()

  const form = useActionForm({
    schema: lostPetSchema,
    action: async (data) => {
      // Não é obrigatório ter fotos extras se o pet já tem fotos
      return createLostPetPost(data, photos)
    },
    defaultValues: {
      pet: undefined,
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

  // Watch para mudanças no campo pet
  const watchedPetId = useWatch({
    control: form.control,
    name: 'pet',
  })

  // Quando um pet é selecionado, carregamos suas informações
  useEffect(() => {
    if (watchedPetId) {
      const pet = userPets.find((p) => p.id === watchedPetId)
      setSelectedPet(pet || null)
    } else {
      setSelectedPet(null)
    }
  }, [watchedPetId, userPets])

  const userPetsOptions: ComboboxOption[] = userPets.map((pet) => ({
    label: capitalizeString(pet.name),
    value: pet.id,
  }))

  return (
    <Form {...form} className="flex flex-col gap-4">
      <FormField
        control={form.control}
        name="pet"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="!text-black">
              Selecione o pet perdido
            </FormLabel>
            <InputCombobox
              icon={DogIcon}
              options={userPetsOptions}
              placeholder="Selecione seu pet perdido"
              emptyOptionsMessage="Primeiro cadastre seu pet"
              {...field}
            />
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Mostrar fotos do pet selecionado */}
      {selectedPet && selectedPet.photos.length > 0 && (
        <div>
          <FormLabel className="!text-black">
            Fotos do {selectedPet.name}
          </FormLabel>
          <div className="flex gap-4 flex-wrap mt-2">
            {selectedPet.photos.map((photo) => (
              <div key={photo.id} className="relative">
                <Image
                  src={photo.s3Url}
                  alt={photo.filename}
                  width={128}
                  height={128}
                  className="w-32 h-32 object-cover rounded-xl border"
                />
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Estas fotos do {selectedPet.name} serão incluídas automaticamente no
            post.
          </p>
        </div>
      )}

      <FormField
        control={form.control}
        name="lastSeenDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="!text-black">
              Quando foi visto por último?
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
                  initialFocus
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
              Descreva mais detalhes sobre o pet
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="Última localização, comportamento específico, etc."
                icon={ClipboardIcon}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div>
        <FormLabel className="!text-black">Fotos extras (opcional)</FormLabel>
        <PhotoUploadField photos={photos || []} setPhotos={setPhotos} />
        <p className="text-xs text-accent-foreground/80 mt-2">
          Adicione fotos extras se necessário (localização atual, recompensa,
          etc.)
          <br />
          Suportado: JPEG, PNG, WebP. Máximo 5 fotos, 10MB cada.
        </p>
      </div>

      <Button className="w-full" size="rounded" type="submit">
        Criar post
      </Button>
    </Form>
  )
}
