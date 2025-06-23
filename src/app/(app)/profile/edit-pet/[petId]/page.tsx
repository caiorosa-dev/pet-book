/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
'use client'

import {
  Bone,
  Camera,
  CircleUserRound,
  Clipboard,
  Dog,
  Loader2,
  Trash2,
  X,
} from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
import type { PetWithRelations } from '@/types/database'

import { deletePetPhotoAction } from '../../new-pet/actions'
import { deletePet, getPetById, updatePet, uploadPetPhotos } from './actions'

const updatePetSchema = z.object({
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

export default function EditPetPage() {
  const params = useParams()
  const router = useRouter()
  const petId = params.petId as string

  const [pet, setPet] = useState<PetWithRelations | null>(null)
  const [loading, setLoading] = useState(true)
  const [newPhotos, setNewPhotos] = useState<PhotoData[]>([])
  const [photoLoading, setPhotoLoading] = useState(false)
  const [deletingPhotos, setDeletingPhotos] = useState<Set<string>>(new Set())
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const form = useActionForm({
    schema: updatePetSchema,
    action: (data) => updatePet(petId, data),
    defaultValues: {
      name: '',
      species: '',
      breed: '',
      features: '',
    },
    onSubmitError: (error) => {
      toast.error(error?.message || 'Erro ao atualizar pet')
    },
    onSubmitSuccess: () => {
      toast.success('Pet atualizado com sucesso!')
      router.push('/profile')
    },
  })

  useEffect(() => {
    if (!petId) return

    const loadPet = async () => {
      try {
        setLoading(true)
        const petData = await getPetById(petId)
        if (!petData) {
          toast.error('Pet não encontrado')
          router.push('/profile')
          return
        }

        setPet(petData)
        form.reset({
          name: petData.name,
          species: petData.species,
          breed: petData.breed,
          features: petData.characteristics,
        })
      } catch (error) {
        toast.error('Erro ao carregar pet')
        router.push('/profile')
      } finally {
        setLoading(false)
      }
    }

    loadPet()
  }, [petId]) // Apenas petId como dependência

  const handlePhotoChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || [])

      if (files.length === 0) return

      const currentPhotoCount = (pet?.photos.length || 0) + newPhotos.length

      // Verificar se não excede o limite de 5 fotos
      if (currentPhotoCount + files.length > 5) {
        toast.error('Você pode ter no máximo 5 fotos')
        return
      }

      setPhotoLoading(true)

      processImageFiles(files)
        .then((processedPhotos) => {
          setNewPhotos((prev) => [...prev, ...processedPhotos])
        })
        .catch((error) => {
          if (error instanceof Error) {
            toast.error(error.message)
          } else {
            toast.error('Erro ao processar imagens')
          }
        })
        .finally(() => {
          setPhotoLoading(false)
        })

      // Limpar o input
      e.target.value = ''
    },
    [pet?.photos.length, newPhotos.length],
  )

  const removeNewPhoto = useCallback((photoId: string) => {
    setNewPhotos((prev) => prev.filter((photo) => photo.id !== photoId))
  }, [])

  const deleteExistingPhoto = useCallback(
    async (photoId: string) => {
      if (deletingPhotos.has(photoId)) return

      try {
        setDeletingPhotos((prev) => new Set([...prev, photoId]))
        await deletePetPhotoAction(photoId)

        // Atualizar estado local
        setPet((prev) =>
          prev
            ? {
                ...prev,
                photos: prev.photos.filter((photo) => photo.id !== photoId),
              }
            : null,
        )

        toast.success('Foto removida com sucesso')
      } catch (error) {
        toast.error('Erro ao remover foto')
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

  const handleSubmit = useCallback(
    async (data: z.infer<typeof updatePetSchema>) => {
      // Primeiro fazer upload das novas fotos
      if (newPhotos.length > 0) {
        await uploadPetPhotos(petId, newPhotos)
      }

      // Depois atualizar os dados do pet
      return await updatePet(petId, data)
    },
    [petId, newPhotos],
  )

  const handleDeletePet = useCallback(async () => {
    try {
      setIsDeleting(true)
      await deletePet(petId)
      toast.success('Pet deletado com sucesso')
      router.push('/profile')
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Erro ao deletar pet',
      )
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }, [petId, router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="animate-spin size-8" />
      </div>
    )
  }

  if (!pet) {
    return null
  }

  const currentPhotoCount = pet.photos.length + newPhotos.length

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-15.5">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Editando {pet.name}
          </h1>
          <p className="mt-2 text-slate-600">
            Atualize as informações do seu pet.
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
              {/* Fotos existentes */}
              {pet.photos.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-slate-600">Fotos atuais:</p>
                  <div className="grid grid-cols-2 gap-4">
                    {pet.photos.map((photo, index) => (
                      <div key={photo.id} className="relative">
                        <img
                          src={photo.s3Url}
                          alt={`Foto ${index + 1}`}
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

              {/* Novas fotos */}
              {newPhotos.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-slate-600">Novas fotos:</p>
                  <div className="grid grid-cols-2 gap-4">
                    {newPhotos.map((photo, index) => (
                      <div key={photo.id} className="relative">
                        <img
                          src={photo.preview}
                          alt={`Nova foto ${index + 1}`}
                          className="w-full h-24 object-cover rounded-xl border"
                        />
                        <button
                          type="button"
                          onClick={() => removeNewPhoto(photo.id)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                        >
                          <X size={12} />
                        </button>
                        <div className="absolute bottom-1 left-1 bg-green-500/80 text-white text-xs px-1 rounded">
                          Nova
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Botão de adicionar fotos */}
              {currentPhotoCount < 5 && (
                <label className="w-full h-24 flex items-center justify-center border-2 border-dashed rounded-xl cursor-pointer hover:bg-accent transition">
                  {photoLoading ? (
                    <Loader2 className="animate-spin text-muted" size={32} />
                  ) : (
                    <div className="text-center">
                      <Camera className="text-muted mx-auto mb-2" size={32} />
                      <p className="text-sm text-muted">
                        Adicionar foto {currentPhotoCount + 1}
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

          {/* Seção perigosa - Deletar pet */}
          <div className="border border-red-200 rounded-lg p-4 bg-red-50">
            <h3 className="text-sm font-medium text-red-800 mb-2">
              Zona perigosa
            </h3>
            <p className="text-xs text-red-600 mb-3">
              Esta ação não pode ser desfeita. Isso deletará permanentemente
              {pet.name} e todas as suas fotos.
            </p>
            <Button
              type="button"
              variant="outline"
              className="text-red-600 border-red-300 hover:bg-red-100 hover:border-red-400"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <Trash2 className="mr-2" size={16} />
              Deletar {pet.name}
            </Button>
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
      </div>

      {/* Modal de confirmação para deletar */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deletar {pet?.name}?</DialogTitle>
            <DialogDescription>
              Esta ação não pode ser desfeita. Isso deletará permanentemente
              {pet?.name} e todas as suas fotos do sistema.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowDeleteConfirm(false)}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeletePet}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 animate-spin" size={16} />
                  Deletando...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2" size={16} />
                  Sim, deletar
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
