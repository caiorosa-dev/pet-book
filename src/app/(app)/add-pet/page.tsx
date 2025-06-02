'use client'

import { Dog, Bone, Clipboard, Camera, CircleUserRound } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useClientForm } from '@/hooks/use-client-form'
import { z } from 'zod'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'

const addPetSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  species: z.string().min(1, 'Espécie é obrigatória'),
  breed: z.string().min(1, 'Raça é obrigatória'),
  features: z.string().optional(),
  // as fotos podem ser tratadas separadamente
})

export default function AddPetPage() {
  const [photo, setPhoto] = useState<string | null>(null)
  const [photoLoading, setPhotoLoading] = useState(false)
  const [photoError, setPhotoError] = useState<string | null>(null)
  const [photoSuccess, setPhotoSuccess] = useState(false)

  const form = useClientForm({
    schema: addPetSchema,
    defaultValues: {
      name: '',
      species: '',
      breed: '',
      features: '',
    },
    handler: async (values) => {
      // Apenas validação local, sem chamada ao backend
      if (!photo) {
        setPhotoError('Adicione uma foto do pet.')
        return { success: false }
      }
      setPhotoSuccess(true)
      return { success: true }
    },
  })

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPhotoError(null)
    setPhotoSuccess(false)
    const file = e.target.files?.[0]
    if (!file) return

    // Validação de tipo e tamanho da imagem
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setPhotoError('Apenas imagens JPEG ou PNG são permitidas.')
      return
    }
    if (file.size > 7 * 1024 * 1024) {
      setPhotoError('A imagem deve ter no máximo 7MB.')
      return
    }

    setPhotoLoading(true)
    const reader = new FileReader()
    reader.onload = (ev) => {
      setPhoto(ev.target?.result as string)
      setPhotoLoading(false)
      setPhotoSuccess(true)
    }
    reader.onerror = () => {
      setPhotoError('Erro ao carregar a imagem.')
      setPhotoLoading(false)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-15.5">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Adicionando um pet</h1>
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
            <FormLabel>Fotos</FormLabel>
            <div className="flex gap-4 mt-2">
              {photo && (
                <img
                  src={photo}
                  alt="Foto do pet"
                  className="w-24 h-24 object-cover rounded-xl border"
                />
              )}
              <label className="w-24 h-24 flex items-center justify-center border-2 border-dashed rounded-xl cursor-pointer hover:bg-accent transition relative">
                {photoLoading ? (
                  <Loader2 className="animate-spin text-muted" size={32} />
                ) : (
                  <Camera className="text-muted" size={32} />
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                  disabled={photoLoading}
                />
              </label>
            </div>
            {photoError && (
              <p className="text-sm text-red-500 mt-2">{photoError}</p>
            )}
            {photoSuccess && (
              <p className="text-sm text-green-600 mt-2">Foto enviada com sucesso!</p>
            )}
          </div>

          <FormField
            control={form.control}
            name="species"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Espécie</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Cachorro"
                    icon={Dog}
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
                  <Input
                    {...field}
                    placeholder="Husky"
                    icon={Bone}
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

          <Button
            type="submit"
            className="w-full"
            disabled={form.isSubmitting}
          >
            {form.isSubmitting ? 'Adicionando...' : 'Adicionar Pet'}
          </Button>
        </Form>
      </div>
    </div>
  )
}

