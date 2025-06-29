/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import {
  Bone,
  CircleUserRound,
  Clipboard,
  Dog,
  Loader2,
  Trash2,
} from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

import { animalSpecies } from '@/app/database/animal-species'
import { breedBySpecies } from '@/app/database/breed-by-species'
import { Button } from '@/components/ui/button'
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
import { PhotoUploadField } from '@/components/ui/photo-upload-field'
import { useActionForm } from '@/hooks/use-action-form'
import { ComboboxOption } from '@/types/combobox-option'
import { PetWithRelations } from '@/types/database'
import { PhotoData } from '@/types/photo-data'

import { deletePetPhotoAction } from '../../../new-pet/actions'
import { updatePet, uploadPetPhotos } from '../actions'
import { updatePetSchema } from '../schema'

export function EditPetForm({
  pet,
  setPet,
}: {
  pet: PetWithRelations
  setPet: React.Dispatch<React.SetStateAction<PetWithRelations | null>>
}) {
  const router = useRouter()

  const [photos, setPhotos] = useState<PhotoData[]>([])
  const [deletingPhotos, setDeletingPhotos] = useState<Set<string>>(new Set())

  const form = useActionForm({
    schema: updatePetSchema,
    action: async (data) => {
      // Primeiro fazer upload das novas fotos
      if (photos.length > 0) {
        await uploadPetPhotos(pet.id, photos)
      }

      // Depois atualizar os dados do pet
      return await updatePet(pet.id, data)
    },
    defaultValues: {
      name: undefined,
      species: undefined,
      breed: undefined,
      features: undefined,
    },
    onSubmitError: (error) => {
      toast.error(error?.message || 'Erro ao atualizar pet')
    },
    onSubmitSuccess: () => {
      toast.success('Pet atualizado com sucesso!')
      setPhotos([]) // Limpar as novas fotos após sucesso
      router.push('/profile')
    },
  })

  // Reset form values when pet data changes
  useEffect(() => {
    if (pet) {
      form.reset({
        name: pet.name,
        species: pet.species,
        breed: pet.breed,
        features: pet.characteristics,
      })
    }
  }, [pet])

  const deleteExistingPhoto = useCallback(
    async (photoId: string) => {
      if (deletingPhotos.has(photoId)) return

      try {
        setDeletingPhotos((prev) => new Set([...prev, photoId]))
        await deletePetPhotoAction(photoId)

        // Atualizar estado local
        setPet((prev) => {
          if (prev == null) {
            return prev // If it's null, just return it as is
          }

          return {
            ...prev,
            photos: prev.photos.filter((photo) => photo.id !== photoId),
          }
        })

        toast.success('Foto removida com sucesso')
      } catch (error) {
        if (error instanceof Error) {
          toast.error('Erro ao remover foto' + error.message)
        } else {
          toast.error('Erro ao remover foto')
        }
      } finally {
        setDeletingPhotos((prev) => {
          const newSet = new Set(prev)
          newSet.delete(photoId)
          return newSet
        })
      }
    },
    [deletingPhotos],
  )

  const selectedSpecies = form.watch('species')

  // Data for combobox
  const animalSpeciesOptions = animalSpecies
  const breedOptionsBySpecies: Record<string, ComboboxOption[]> = breedBySpecies
  const animalBreedOptions = breedOptionsBySpecies[selectedSpecies] ?? []

  return (
    <Form {...form} className="space-y-6">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome do seu pet</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="Pituchinho"
                icon={CircleUserRound}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="species"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Espécie</FormLabel>
            <FormControl>
              <InputCombobox
                icon={Dog}
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
        name="breed"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Raça</FormLabel>
            <FormControl>
              <InputCombobox
                icon={Bone}
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
        name="features"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Características</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Olho azul..." icon={Clipboard} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div>
        <FormLabel>Fotos (máximo 5)</FormLabel>
        <div className="mt-2 space-y-4">
          {/* Fotos existentes */}
          {pet.photos.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-slate-600">Fotos atuais:</p>
              <div className="grid grid-cols-2 gap-4">
                {pet.photos.map((photo, index) => (
                  <div key={photo.id} className="relative">
                    <Image
                      src={photo.s3Url}
                      alt={`Foto ${index + 1}`}
                      width={128}
                      height={128}
                      className="w-full h-24 object-cover rounded-xl border"
                    />
                    <button
                      type="button"
                      onClick={() => deleteExistingPhoto(photo.id)}
                      disabled={deletingPhotos.has(photo.id)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition disabled:opacity-50"
                    >
                      {deletingPhotos.has(photo.id) ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <Trash2 size={12} />
                      )}
                    </button>
                    <div className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-1 rounded">
                      {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <p className="text-sm text-slate-600">Adicione fotos:</p>
          <PhotoUploadField photos={photos || []} setPhotos={setPhotos} />
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Suportado: JPEG, PNG, WebP. Máximo 10MB por foto.
        </p>
      </div>

      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={() => router.push('/profile')}
        >
          Cancelar
        </Button>
        <Button type="submit" className="flex-1" disabled={form.isPending}>
          {form.isPending ? 'Salvando...' : 'Salvar'}
        </Button>
      </div>
    </Form>
  )
}
