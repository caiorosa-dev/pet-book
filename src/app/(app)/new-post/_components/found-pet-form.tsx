'use client'

import { format } from 'date-fns'
import {
  BoneIcon,
  Calendar as CalendarIcon,
  CameraIcon,
  ClipboardIcon,
  DogIcon,
  Loader2,
  X,
} from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
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
import { useActionForm } from '@/hooks/use-action-form'
import { processImageFiles } from '@/lib/image-utils'
import { cn } from '@/lib/utils'

import { createFoundPetPost } from '../actions'
import { foundPetSchema, type PhotoData } from '../schema'

export function FoundPetForm() {
  const [photos, setPhotos] = useState<PhotoData[]>([])
  const [photoLoading, setPhotoLoading] = useState(false)
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

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])

    if (files.length === 0) return

    // Verificar se não excede o limite de 5 fotos
    if (photos.length + files.length > 5) {
      toast.error('Você pode adicionar no máximo 5 fotos')
      return
    }

    setPhotoLoading(true)

    try {
      const processedPhotos = await processImageFiles(files)
      setPhotos((prev) => [...prev, ...processedPhotos])
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

  function removePhoto(photoId: string) {
    setPhotos((prev) => prev.filter((photo) => photo.id !== photoId))
  }

  const animalSpeciesOptions = [
    { label: 'Cachorro', value: 'cachorro' },
    { label: 'Gato', value: 'gato' },
    { label: 'Peixe', value: 'peixe' },
    { label: 'Pássaro', value: 'passaro' },
    { label: 'Coelho', value: 'coelho' },
    { label: 'Hamster', value: 'hamster' },
    { label: 'Porquinho-da-índia', value: 'porquinho-da-india' },
    { label: 'Tartaruga', value: 'tartaruga' },
    { label: 'Cobra', value: 'cobra' },
    { label: 'Lagarto', value: 'lagarto' },
    { label: 'Furão', value: 'furao' },
    { label: 'Cavalo', value: 'cavalo' },
  ] as const

  const breedOptionsBySpecies: Record<
    string,
    { label: string; value: string }[]
  > = {
    cachorro: [
      { label: 'Husky Siberiano', value: 'husky siberiano' },
      { label: 'Labrador Retriever', value: 'labrador retriever' },
      { label: 'Poodle', value: 'poodle' },
      { label: 'Bulldog', value: 'bulldog' },
      { label: 'Golden Retriever', value: 'golden retriever' },
      { label: 'Shih Tzu', value: 'shih tzu' },
      { label: 'Beagle', value: 'beagle' },
      { label: 'Yorkshire Terrier', value: 'yorkshire terrier' },
    ],
    gato: [
      { label: 'Persa', value: 'persa' },
      { label: 'Siamês', value: 'siames' },
      { label: 'Maine Coon', value: 'maine coon' },
      { label: 'Ragdoll', value: 'ragdoll' },
      { label: 'Bengal', value: 'bengal' },
      { label: 'Sphynx (Sem pelo)', value: 'sphynx' },
      { label: 'British Shorthair', value: 'british shorthair' },
    ],
    peixe: [
      { label: 'Betta', value: 'betta' },
      { label: 'Tetra Neon', value: 'tetra neon' },
      { label: 'Guppy', value: 'guppy' },
      { label: 'Molly', value: 'molly' },
      { label: 'Peixe Dourado', value: 'peixe dourado' },
    ],
    passaro: [
      { label: 'Calopsita', value: 'calopsita' },
      { label: 'Periquito', value: 'periquito' },
      { label: 'Papagaio', value: 'papagaio' },
      { label: 'Canário', value: 'canario' },
    ],
    coelho: [
      { label: 'Cabeça de Leão (Lionhead)', value: 'cabeca de leao' },
      { label: 'Mini Lop', value: 'mini lop' },
      { label: 'Angorá', value: 'angora' },
      { label: 'Rex', value: 'rex' },
    ],
    hamster: [
      { label: 'Sírio', value: 'sirio' },
      { label: 'Anão Russo', value: 'anao russo' },
      { label: 'Campbell', value: 'campbell' },
      { label: 'Roborovski', value: 'roborovski' },
    ],
    'porquinho-da-india': [
      { label: 'Peruano', value: 'peruano' },
      { label: 'Teddy', value: 'teddy' },
      { label: 'Texel', value: 'texel' },
      { label: 'Abissínio', value: 'abissinio' },
    ],
    tartaruga: [
      {
        label: 'Tartaruga de Orelha Vermelha',
        value: 'tartaruga de orelha vermelha',
      },
      { label: 'Tartaruga de Galápagos', value: 'tartaruga de galapagos' },
      { label: 'Tartaruga Leopardo', value: 'tartaruga leopardo' },
    ],
    cobra: [
      { label: 'Píton Real', value: 'piton real' },
      { label: 'Cobra do Milho', value: 'cobra do milho' },
      { label: 'Jiboia', value: 'jiboia' },
    ],
    lagarto: [
      { label: 'Dragão Barbudo', value: 'dragao barbudo' },
      { label: 'Gecko Leachianus', value: 'gecko leachianus' },
      { label: 'Gecko Leopardo', value: 'gecko leopardo' },
    ],
    furao: [{ label: 'Furão Comum', value: 'furao comum' }],
    cavalo: [
      { label: 'Quarto de Milha', value: 'quarto de milha' },
      { label: 'Puro Sangue Inglês', value: 'puro sangue ingles' },
      { label: 'Mangalarga Marchador', value: 'mangalarga marchador' },
    ],
  }

  const selectedSpecies = form.watch('animalSpecies')
  const animalBreedOptions = breedOptionsBySpecies[selectedSpecies] ?? []

  // Clear animalBreed when animalSpecies changes
  // useEffect(() => {
  //   form.setValue('animalBreed', '') // reset breed on species change
  // }, [selectedSpecies, form])

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
        <div className="flex gap-4 flex-wrap mt-2">
          {photos.map((photo) => (
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
                variant="ghost"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6 bg-white/80 backdrop-blur-sm rounded-full shadow-md"
                onClick={() => removePhoto(photo.id)}
              >
                <X className="h-4 w-4 text-gray-700" />
              </Button>
            </div>
          ))}

          {photos.length < 5 && (
            <label className="w-32 h-32 flex flex-col items-center justify-center border-[3px] border-dashed rounded-2xl cursor-pointer hover:bg-accent transition">
              {photoLoading ? (
                <Loader2 className="animate-spin text-muted" size={32} />
              ) : (
                <>
                  <CameraIcon className="w-8 h-8 text-primary" />
                  <p className="text-xs text-muted mt-1">
                    Foto {photos.length + 1}
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
          Suportado: JPEG, PNG, WebP. Máximo 5 fotos, 10MB cada.
        </p>
      </div>

      <Button className="w-full" size="rounded" type="submit">
        Criar post
      </Button>
    </Form>
  )
}
