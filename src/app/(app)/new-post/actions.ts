'use server'

import { headers } from 'next/headers'
import { z } from 'zod'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

import { foundPetSchema, lostPetSchema } from './schema'

export async function createFoundPetPost(
  formData: z.infer<typeof foundPetSchema>,
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user.id) {
    throw new Error('Usuário não autenticado.')
  }

  console.log(formData)
  try {
    prisma.post.create({
      data: {
        type: 'found',
        animalSpecies: formData.animalSpecies,
        animalBreed: formData.animalBreed,
        lastSeenDate: formData.lastSeenDate,
        lastSeenLocation: 'Local não especificado',
        petDescription: formData.petDescription,
        photos: formData.photos,
        user: {
          connect: {
            id: session?.user.id,
          },
        },
      },
    })
  } catch (error: unknown) {
    console.log(error)
  }
}

export async function createLostPetPost(
  formData: z.infer<typeof lostPetSchema>,
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user.id) {
    throw new Error('Usuário não autenticado.')
  }

  // Busca o pet no banco
  const pet = await prisma.pet.findUnique({
    where: {
      id: formData.pet,
    },
    select: {
      species: true,
      breed: true,
    },
  })

  if (!pet || !pet.species || !pet.breed) {
    throw new Error('Espécie ou raça do pet não encontrada.')
  }

  console.log(formData)
  try {
    prisma.post.create({
      data: {
        type: 'lost',
        lastSeenDate: formData.lastSeenDate,
        lastSeenLocation: 'Local não especificado',
        petDescription: formData.petDescription,
        photos: formData.photos,
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
  } catch (error: unknown) {
    console.log(error)
  }
}
