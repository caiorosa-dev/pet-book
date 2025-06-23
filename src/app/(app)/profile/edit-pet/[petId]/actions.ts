/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { deletePetPhoto, uploadPetPhoto } from '@/lib/s3-utils'

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

export async function getPetById(petId: string) {
  try {
    const session = await getSession()

    if (!session) {
      throw new Error('Usuário não autenticado')
    }

    const pet = await prisma.pet.findFirst({
      where: {
        id: petId,
        userId: session.user.id,
      },
      include: {
        photos: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    })

    return pet
  } catch (error) {
    console.error('Erro ao buscar pet:', error)
    return null
  }
}

export async function updatePet(
  petId: string,
  data: z.infer<typeof updatePetSchema>,
) {
  try {
    const session = await getSession()

    if (!session) {
      throw new Error('Usuário não autenticado')
    }

    const validatedData = updatePetSchema.parse(data)

    // Verificar se o pet pertence ao usuário
    const existingPet = await prisma.pet.findFirst({
      where: {
        id: petId,
        userId: session.user.id,
      },
    })

    if (!existingPet) {
      throw new Error('Pet não encontrado ou você não tem permissão')
    }

    const updatedPet = await prisma.pet.update({
      where: {
        id: petId,
      },
      data: {
        name: validatedData.name,
        species: validatedData.species,
        breed: validatedData.breed,
        characteristics: validatedData.features || '',
      },
    })

    revalidatePath('/profile')
    return updatedPet
  } catch (error) {
    console.error('Erro ao atualizar pet:', error)

    throw new Error(
      error instanceof Error ? error.message : 'Erro ao atualizar pet',
    )
  }
}

export async function uploadPetPhotos(petId: string, photos: PhotoData[]) {
  try {
    const session = await getSession()

    if (!session) {
      throw new Error('Usuário não autenticado')
    }

    // Verificar se o pet pertence ao usuário
    const pet = await prisma.pet.findFirst({
      where: {
        id: petId,
        userId: session.user.id,
      },
      include: {
        photos: true,
      },
    })

    if (!pet) {
      throw new Error('Pet não encontrado ou você não tem permissão')
    }

    // Calcular a próxima ordem das fotos
    const maxOrder =
      pet.photos.length > 0 ? Math.max(...pet.photos.map((p) => p.order)) : -1

    // Processar e fazer upload das fotos
    const uploadPromises = photos.map(async (photo, index) => {
      try {
        // Converter base64 para buffer
        const base64Data = photo.file.split(',')[1]
        const buffer = Buffer.from(base64Data, 'base64')

        // Upload para S3
        const uploadResult = await uploadPetPhoto(
          buffer,
          photo.filename,
          photo.mimeType,
        )

        // Salvar no banco
        return prisma.petPhoto.create({
          data: {
            id: uploadResult.photoId,
            petId: petId,
            filename: uploadResult.filename,
            s3Key: uploadResult.s3Key,
            s3Url: uploadResult.s3Url,
            order: maxOrder + 1 + index,
          },
        })
      } catch (error) {
        console.error('Erro ao fazer upload da foto:', error)
        throw new Error('Erro ao fazer upload das fotos')
      }
    })

    await Promise.all(uploadPromises)

    revalidatePath('/profile')
    revalidatePath(`/profile/edit-pet/${petId}`)
  } catch (error) {
    console.error('Erro ao fazer upload das fotos:', error)
    throw new Error(
      error instanceof Error ? error.message : 'Erro ao fazer upload das fotos',
    )
  }
}

export async function deletePet(petId: string) {
  try {
    const session = await getSession()

    if (!session) {
      throw new Error('Usuário não autenticado')
    }

    // Buscar o pet com suas fotos
    const pet = await prisma.pet.findFirst({
      where: {
        id: petId,
        userId: session.user.id,
      },
      include: {
        photos: true,
      },
    })

    if (!pet) {
      throw new Error('Pet não encontrado ou você não tem permissão')
    }

    // Deletar todas as fotos do S3
    for (const photo of pet.photos) {
      try {
        await deletePetPhoto(photo.s3Key)
      } catch (error) {
        console.error(`Erro ao deletar foto ${photo.s3Key} do S3:`, error)
        // Continua mesmo se falhar ao deletar uma foto do S3
      }
    }

    // Deletar o pet do banco (isso vai deletar as fotos em cascata)
    await prisma.pet.delete({
      where: {
        id: petId,
      },
    })

    revalidatePath('/profile')
    return { success: true }
  } catch (error) {
    console.error('Erro ao deletar pet:', error)

    throw new Error(
      error instanceof Error ? error.message : 'Erro ao deletar pet',
    )
  }
}
