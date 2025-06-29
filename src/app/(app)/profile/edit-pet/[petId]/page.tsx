/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { Loader2, Trash2 } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { PetWithRelations } from '@/types/database'

import { EditPetForm } from './_components/edit-pet-form'
import { deletePet, getPetById } from './actions'

export default function EditPetPage() {
  const params = useParams()
  const router = useRouter()
  const petId = params.petId as string

  const [pet, setPet] = useState<PetWithRelations | null>(null)
  const [loading, setLoading] = useState(true)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

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
      } catch (error) {
        if (error instanceof Error) {
          toast.error('Erro ao carregar pet: ' + error.message)
        } else {
          toast.error('Erro ao carregar pet')
        }

        router.push('/profile')
      } finally {
        setLoading(false)
      }
    }

    loadPet()
  }, [petId]) // Apenas petId como dependência

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

  return (
    <div className="max-w-xl w-full mx-auto h-full flex flex-col gap-10">
      <h1 className="text-3xl font-bold tracking-tight">Editando {pet.name}</h1>
      <p className="mt-2 text-slate-600">Atualize as informações do seu pet.</p>
      <EditPetForm pet={pet} setPet={setPet} />

      {/* Seção perigosa - Deletar pet */}
      <div className="border border-red-200 rounded-lg p-4 bg-red-50">
        <h3 className="text-sm font-medium text-red-800 mb-2">Zona perigosa</h3>
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
