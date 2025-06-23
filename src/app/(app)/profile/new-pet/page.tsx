/* eslint-disable @next/next/no-img-element */
'use client'

import {
  Bone,
  Camera,
  CircleUserRound,
  Clipboard,
  Dog,
  Loader2,
  X,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'

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
import { useActionForm } from '@/hooks/use-action-form'
import { processImageFiles } from '@/lib/image-utils'

import { addPet } from './actions'

const addPetSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  species: z.string().min(1, 'Espécie é obrigatória'),
  breed: z.string().min(1, 'Raça é obrigatória'),
  features: z.string().optional(),
})

interface PhotoData {
  id: string
  file: string // base64
  filename: string
  mimeType: string
  preview: string
}

export default function AddPetPage() {
  const [photos, setPhotos] = useState<PhotoData[]>([])
  const [photoLoading, setPhotoLoading] = useState(false)
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
      name: '',
      species: '',
      breed: '',
      features: '',
    },
    onSubmitError: (error) => {
      toast.error(error?.message || 'Erro ao adicionar pet')
    },
    onSubmitSuccess: () => {
      toast.success('Pet adicionado com sucesso!')
      router.push('/profile')
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

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-15.5">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Adicionando um pet
          </h1>
          <p className="mt-2 text-slate-600">
            Informe as informações do seu pet para começar a postar com ele.
          </p>
        </div>
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

          <div>
            <FormLabel>Fotos (máximo 5)</FormLabel>
            <div className="mt-2 space-y-4">
              {/* Preview das fotos */}
              {photos.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                  {photos.map((photo, index) => (
                    <div key={photo.id} className="relative">
                      <img
                        src={photo.preview}
                        alt={`Foto ${index + 1}`}
                        className="w-full h-24 object-cover rounded-xl border"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(photo.id)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                      >
                        <X size={12} />
                      </button>
                      <div className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-1 rounded">
                        {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Botão de adicionar fotos */}
              {photos.length < 5 && (
                <label className="w-full h-24 flex items-center justify-center border-2 border-dashed rounded-xl cursor-pointer hover:bg-accent transition">
                  {photoLoading ? (
                    <Loader2 className="animate-spin text-muted" size={32} />
                  ) : (
                    <div className="text-center">
                      <Camera className="text-muted mx-auto mb-2" size={32} />
                      <p className="text-sm text-muted">
                        Adicionar foto {photos.length + 1}
                      </p>
                    </div>
                  )}
                  <input
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
              Suportado: JPEG, PNG, WebP. Máximo 10MB por foto.
            </p>
          </div>

          <FormField
            control={form.control}
            name="species"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Espécie</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Cachorro" icon={Dog} />
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
                  <Input {...field} placeholder="Husky" icon={Bone} />
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
                  <Input
                    {...field}
                    placeholder="Olho azul..."
                    icon={Clipboard}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={form.isPending}>
            {form.isPending ? 'Adicionando...' : 'Adicionar Pet'}
          </Button>
        </Form>
      </div>
    </div>
  )
}
