'use server'

import { z } from 'zod'

import { prisma } from '@/lib/prisma'

import { searchSchema } from './schema'

export async function getPets() {
  try {
    prisma.pet.findMany({
      select: {
        name: true,
        breed: true,
        species: true,
      },
      take: 10,
    })
  } catch (error: unknown) {
    console.log(error)
  }
}

export async function getUsers() {
  try {
    prisma.user.findMany({
      select: {
        userName: true,
      },
      take: 10,
    })
  } catch (error: unknown) {
    console.log(error)
  }
}

export async function getOngs() {
  try {
    prisma.user.findMany({
      select: {
        userName: true,
      },
      take: 10,
    })
  } catch (error: unknown) {
    console.log(error)
  }
}

export async function search(formData: z.infer<typeof searchSchema>) {
  const query: string = formData.query

  const posts = await prisma.post.findMany({
    where: {
      OR: [
        {
          animalBreed: {
            contains: query,
            mode: 'insensitive', // case-insensitive
          },
        },
        {
          animalSpecies: {
            contains: query,
            mode: 'insensitive',
          },
        },
        {
          petDescription: {
            contains: query,
            mode: 'insensitive',
          },
        },
      ],
    },
    take: 10, // optional: limit results
  })

  return posts
}
