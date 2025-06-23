'use server'

import { headers } from 'next/headers'
import { z } from 'zod'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { uploadPostPhoto } from '@/lib/s3-utils'

import { foundPetSchema, lostPetSchema, type PhotoData } from './schema'

export async function createFoundPetPost(
  formData: z.infer<typeof foundPetSchema>,
  photos: PhotoData[],
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user.id) {
    throw new Error('Usuário não autenticado.')
  }

  if (photos.length === 0) {
    throw new Error('Pelo menos uma foto é obrigatória')
  }

  try {
    // 1. Criar o post no banco
    const post = await prisma.post.create({
      data: {
        type: 'found',
        animalSpecies: formData.animalSpecies,
        animalBreed: formData.animalBreed,
        lastSeenDate: formData.lastSeenDate,
        lastSeenLocation: 'Local não especificado',
        petDescription: formData.petDescription,
        user: {
          connect: {
            id: session?.user.id,
          },
        },
      },
    })

    // 2. Processar e fazer upload das fotos
    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i]

      try {
        // Converter base64 para buffer
        const base64Data = photo.file.split(',')[1]
        if (!base64Data) {
          throw new Error(`Dados de imagem inválidos para foto ${i + 1}`)
        }

        const buffer = Buffer.from(base64Data, 'base64')

        // Upload para S3
        const uploadResult = await uploadPostPhoto(
          buffer,
          photo.filename,
          photo.mimeType,
        )

        // Salvar no banco
        await prisma.postPhoto.create({
          data: {
            id: uploadResult.photoId,
            postId: post.id,
            filename: uploadResult.filename,
            s3Key: uploadResult.s3Key,
            s3Url: uploadResult.s3Url,
            order: i,
          },
        })
      } catch (error) {
        console.error(`Erro ao processar foto ${i + 1}:`, error)
        // Se uma foto falhar, deletar o post e fotos já criadas
        await prisma.post.delete({ where: { id: post.id } })
        throw new Error(
          `Erro ao fazer upload da foto ${i + 1}: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        )
      }
    }

    return { success: true, postId: post.id }
  } catch (error: unknown) {
    console.log(error)
    throw error
  }
}

export async function createLostPetPost(
  formData: z.infer<typeof lostPetSchema>,
  extraPhotos: PhotoData[],
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user.id) {
    throw new Error('Usuário não autenticado.')
  }

  // Busca o pet no banco com suas fotos
  const pet = await prisma.pet.findUnique({
    where: {
      id: formData.pet,
    },
    include: {
      photos: {
        orderBy: { order: 'asc' },
      },
    },
  })

  if (!pet || !pet.species || !pet.breed) {
    throw new Error('Pet não encontrado ou dados incompletos.')
  }

  try {
    // 1. Criar o post no banco
    const post = await prisma.post.create({
      data: {
        type: 'lost',
        lastSeenDate: formData.lastSeenDate,
        lastSeenLocation: 'Local não especificado',
        petDescription: formData.petDescription,
        animalBreed: pet?.breed,
        animalSpecies: pet?.species,
        user: {
          connect: {
            id: session?.user.id,
          },
        },
        pet: {
          connect: {
            id: formData.pet,
          },
        },
      },
    })

    let photoOrder = 0

    // 2. Copiar fotos do pet para o post
    for (const petPhoto of pet.photos) {
      await prisma.postPhoto.create({
        data: {
          postId: post.id,
          filename: petPhoto.filename,
          s3Key: petPhoto.s3Key,
          s3Url: petPhoto.s3Url,
          order: photoOrder++,
        },
      })
    }

    // 3. Processar e fazer upload das fotos extras
    for (let i = 0; i < extraPhotos.length; i++) {
      const photo = extraPhotos[i]

      try {
        // Converter base64 para buffer
        const base64Data = photo.file.split(',')[1]
        if (!base64Data) {
          throw new Error(`Dados de imagem inválidos para foto extra ${i + 1}`)
        }

        const buffer = Buffer.from(base64Data, 'base64')

        // Upload para S3
        const uploadResult = await uploadPostPhoto(
          buffer,
          photo.filename,
          photo.mimeType,
        )

        // Salvar no banco
        await prisma.postPhoto.create({
          data: {
            id: uploadResult.photoId,
            postId: post.id,
            filename: uploadResult.filename,
            s3Key: uploadResult.s3Key,
            s3Url: uploadResult.s3Url,
            order: photoOrder++,
          },
        })
      } catch (error) {
        console.error(`Erro ao processar foto extra ${i + 1}:`, error)
        // Se uma foto falhar, deletar o post e fotos já criadas
        await prisma.post.delete({ where: { id: post.id } })
        throw new Error(
          `Erro ao fazer upload da foto extra ${i + 1}: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        )
      }
    }

    return { success: true, postId: post.id }
  } catch (error: unknown) {
    console.log(error)
    throw error
  }
}
