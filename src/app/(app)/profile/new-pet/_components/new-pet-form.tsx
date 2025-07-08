import { Bone, CircleUserRound, Clipboard, Dog } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
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

import { addPet } from '../actions'
import { addPetSchema, PhotoData } from '../schema'

export function NewPetForm() {
  const [photos, setPhotos] = useState<PhotoData[]>([])
  const router = useRouter()

  const form = useActionForm({
    schema: addPetSchema,
    action: async (data) => {
      if (photos.length === 0) {
        toast.error('Adicione pelo menos uma foto do pet')
        throw new Error('Pelo menos uma foto é obrigatória')
      }

      return addPet(data, photos)
    },
    defaultValues: {
      name: undefined,
      species: undefined,
      breed: undefined,
      features: undefined,
    },
    onSubmitError: (error) => {
      toast.error(error?.message || 'Erro ao adicionar pet')
    },
    onSubmitSuccess: () => {
      toast.success('Pet adicionado com sucesso!')
      router.push('/profile')
    },
  })

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
        <PhotoUploadField photos={photos || []} setPhotos={setPhotos} />
        <p className="text-xs text-accent-foreground/80 mt-2">
          Suportado: JPEG, PNG, WebP. Máximo 10MB por foto.
        </p>
      </div>

      <Button type="submit" className="w-full" disabled={form.isPending}>
        {form.isPending ? 'Adicionando...' : 'Adicionar Pet'}
      </Button>
    </Form>
  )
}
