'use client'

import { format } from 'date-fns'
import {
  Calendar as CalendarIcon,
  CameraIcon,
  ClipboardIcon,
  DogIcon,
  Loader2,
  X,
} from 'lucide-react'
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
import { Input } from '@/components/ui/input'
import { InputCombobox } from '@/components/ui/input-combobox'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Textarea } from '@/components/ui/textarea'
import { capitalizeString } from '@/helpers/capitalize'
import { useActionForm } from '@/hooks/use-action-form'
import { processImageFiles } from '@/lib/image-utils'
import { cn } from '@/lib/utils'
import type { PetWithRelations } from '@/types/database'

import { createLostPetPost } from '../actions'
import { lostPetSchema, type PhotoData } from '../schema'

interface LostPetFormProps {
  userPets: readonly PetWithRelations[]
}

export function LostPetForm({ userPets }: LostPetFormProps) {
  const [extraPhotos, setExtraPhotos] = useState<PhotoData[]>([])
  const [photoLoading, setPhotoLoading] = useState(false)
  const [selectedPet, setSelectedPet] = useState<PetWithRelations | null>(null)
  const router = useRouter()

  const form = useActionForm({
    schema: lostPetSchema,
    action: async (data) => {
      // Não é obrigatório ter fotos extras se o pet já tem fotos
      return createLostPetPost(data, extraPhotos)
    },
    defaultValues: {
      pet: '',
      lastSeenDate: new Date(),
      petDescription: '',
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

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])

    if (files.length === 0) return

    // Verificar se não excede o limite de 5 fotos extras
    if (extraPhotos.length + files.length > 5) {
      toast.error('Você pode adicionar no máximo 5 fotos extras')
      return
    }

    setPhotoLoading(true)

    try {
      const processedPhotos = await processImageFiles(files)
      setExtraPhotos((prev) => [...prev, ...processedPhotos])
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Erro ao processar imagens')
      }
    } finally {
      setPhotoLoading(false)
    }

    // Limpar o input
    e.target.value = ''
  }

  function removeExtraPhoto(photoId: string) {
    setExtraPhotos((prev) => prev.filter((photo) => photo.id !== photoId))
  }

  type Option = {
    label: string
    value: string
  }

  const userPetsOptions: Option[] = userPets.map((pet) => ({
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

      {/* Fotos extras */}
      <div>
        <FormLabel className="!text-black">Fotos extras (opcional)</FormLabel>
        <div className="flex gap-4 flex-wrap mt-2">
          {extraPhotos.map((photo) => (
            <div key={photo.id} className="relative">
              <Image
                src={photo.preview}
                alt={photo.filename}
                width={128}
                height={128}
                className="w-32 h-32 object-cover rounded-xl border"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6 bg-white/80 backdrop-blur-sm rounded-full shadow-md"
                onClick={() => removeExtraPhoto(photo.id)}
              >
                <X className="h-4 w-4 text-gray-700" />
              </Button>
            </div>
          ))}

          {extraPhotos.length < 5 && (
            <label className="w-32 h-32 flex flex-col items-center justify-center border-[3px] border-dashed rounded-2xl cursor-pointer hover:bg-accent transition">
              {photoLoading ? (
                <Loader2 className="animate-spin text-muted" size={32} />
              ) : (
                <>
                  <CameraIcon className="w-8 h-8 text-primary" />
                  <p className="text-xs text-muted mt-1">
                    Foto extra {extraPhotos.length + 1}
                  </p>
                </>
              )}
              <Input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handlePhotoChange}
                disabled={photoLoading}
              />
            </label>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Adicione fotos extras se necessário (localização atual, recompensa,
          etc.)
        </p>
      </div>

      <Button className="w-full" size="rounded" type="submit">
        Criar post
      </Button>
    </Form>
  )
}
