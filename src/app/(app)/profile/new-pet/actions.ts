'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { deletePetPhoto, uploadPetPhoto } from '@/lib/s3-utils'

const addPetSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  species: z.string().min(1, 'Espécie é obrigatória'),
  breed: z.string().min(1, 'Raça é obrigatória'),
  features: z.string().optional(),
})

interface PhotoData {
  file: string // base64
  filename: string
  mimeType: string
}

export async function addPet(
  data: z.infer<typeof addPetSchema>,
  photos: PhotoData[],
) {
  try {
    console.log('Iniciando addPet:', { data, photosCount: photos.length })

    const session = await getSession()

    if (!session) {
      throw new Error('Usuário não autenticado')
    }

    if (photos.length === 0) {
      throw new Error('Pelo menos uma foto é obrigatória')
    }

    const validatedData = addPetSchema.parse(data)
    console.log('Dados validados:', validatedData)

    // 1. Primeiro criar o pet no banco
    const pet = await prisma.pet.create({
      data: {
        name: validatedData.name,
        species: validatedData.species,
        breed: validatedData.breed,
        characteristics: validatedData.features || '',
        userId: session.user.id,
      },
    })

    console.log('Pet criado:', pet.id)

    // 2. Processar e fazer upload das fotos
    const uploadResults = []

    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i]
      console.log(`Processando foto ${i + 1}/${photos.length}`)

      try {
        // Converter base64 para buffer
        const base64Data = photo.file.split(',')[1]
        if (!base64Data) {
          throw new Error(`Dados de imagem inválidos para foto ${i + 1}`)
        }

        const buffer = Buffer.from(base64Data, 'base64')
        console.log(
          `Buffer criado para foto ${i + 1}, tamanho: ${buffer.length} bytes`,
        )

        // Upload para S3
        const uploadResult = await uploadPetPhoto(
          buffer,
          photo.filename,
          photo.mimeType,
        )
        console.log(
          `Upload S3 concluído para foto ${i + 1}:`,
          uploadResult.s3Key,
        )

        // Salvar no banco
        const savedPhoto = await prisma.petPhoto.create({
          data: {
            id: uploadResult.photoId,
            petId: pet.id,
            filename: uploadResult.filename,
            s3Key: uploadResult.s3Key,
            s3Url: uploadResult.s3Url,
            order: i,
          },
        })

        uploadResults.push(savedPhoto)
        console.log(`Foto ${i + 1} salva no banco:`, savedPhoto.id)
      } catch (error) {
        console.error(`Erro ao processar foto ${i + 1}:`, error)
        // Se uma foto falhar, deletar o pet e fotos já criadas
        await prisma.pet.delete({ where: { id: pet.id } })
        throw new Error(
          `Erro ao fazer upload da foto ${i + 1}: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        )
      }
    }

    console.log(`Upload concluído. ${uploadResults.length} fotos salvas`)

    revalidatePath('/profile')
  } catch (error) {
    console.error('Erro completo em addPet:', error)

    if (error instanceof z.ZodError) {
      throw new Error('Dados de entrada inválidos')
    }

    if (error instanceof Error) {
      throw new Error(error.message)
    }

    throw new Error('Erro interno do servidor')
  }
}

export async function getUserPets() {
  try {
    const session = await getSession()

    if (!session) {
      return []
    }

    const pets = await prisma.pet.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        photos: {
          orderBy: {
            order: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return pets
  } catch (error) {
    console.error('Erro ao buscar pets:', error)
    return []
  }
}

export async function getUserPosts() {
  try {
    const session = await getSession()

    if (!session) {
      return []
    }

    const posts = await prisma.post.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        user: true,
        likes: true,
        comments: true,
        photos: {
          orderBy: {
            order: 'asc',
          },
        },
        pet: {
          include: {
            photos: {
              orderBy: {
                order: 'asc',
              },
              take: 1,
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return posts
  } catch (error) {
    console.error('Erro ao buscar posts:', error)
    return []
  }
}

export async function getUserStats() {
  try {
    const session = await getSession()

    if (!session) {
      return {
        pets: 0,
        posts: 0,
        found: 0,
      }
    }

    const [pets, posts, foundPosts] = await Promise.all([
      prisma.pet.count({
        where: {
          userId: session.user.id,
        },
      }),
      prisma.post.count({
        where: {
          userId: session.user.id,
        },
      }),
      prisma.post.count({
        where: {
          userId: session.user.id,
          type: 'found',
        },
      }),
    ])

    return {
      pets,
      posts,
      found: foundPosts,
    }
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error)
    return {
      pets: 0,
      posts: 0,
      found: 0,
    }
  }
}

export async function deletePetPhotoAction(photoId: string) {
  try {
    const session = await getSession()

    if (!session) {
      throw new Error('Usuário não autenticado')
    }

    // Buscar a foto para verificar se pertence ao usuário
    const photo = await prisma.petPhoto.findFirst({
      where: {
        id: photoId,
        pet: {
          userId: session.user.id,
        },
      },
    })

    if (!photo) {
      throw new Error('Foto não encontrada ou você não tem permissão')
    }

    // Deletar do S3
    await deletePetPhoto(photo.s3Key)

    // Deletar do banco
    await prisma.petPhoto.delete({
      where: {
        id: photoId,
      },
    })

    revalidatePath('/profile')
  } catch (error) {
    console.error('Erro ao deletar foto:', error)
    throw new Error(
      error instanceof Error ? error.message : 'Erro ao deletar foto',
    )
  }
}

export async function updatePetPhotoOrder(
  petId: string,
  photoOrders: { id: string; order: number }[],
) {
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
    })

    if (!pet) {
      throw new Error('Pet não encontrado ou você não tem permissão')
    }

    // Atualizar a ordem das fotos
    const updatePromises = photoOrders.map(({ id, order }) =>
      prisma.petPhoto.update({
        where: { id },
        data: { order },
      }),
    )

    await Promise.all(updatePromises)

    revalidatePath('/profile')
  } catch (error) {
    console.error('Erro ao atualizar ordem das fotos:', error)
    throw new Error('Erro ao atualizar ordem das fotos')
  }
}
