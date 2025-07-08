'use server'

import { z } from 'zod'

import { prisma } from '@/lib/prisma'

import { searchSchema } from './schema'

export async function getPets(query?: string) {
  try {
    const pets = await prisma.pet.findMany({
      where: query
        ? {
            OR: [
              {
                name: {
                  contains: query,
                  mode: 'insensitive',
                },
              },
              {
                breed: {
                  contains: query,
                  mode: 'insensitive',
                },
              },
              {
                species: {
                  contains: query,
                  mode: 'insensitive',
                },
              },
              {
                characteristics: {
                  contains: query,
                  mode: 'insensitive',
                },
              },
            ],
          }
        : {},
      include: {
        owner: true,
        photos: {
          orderBy: {
            order: 'asc',
          },
        },
      },
      take: 10,
    })
    return pets
  } catch (error: unknown) {
    console.log(error)
    return []
  }
}

export async function getUsers(query?: string) {
  try {
    const users = await prisma.user.findMany({
      where: query
        ? {
            OR: [
              {
                fullName: {
                  contains: query,
                  mode: 'insensitive',
                },
              },
              {
                userName: {
                  contains: query,
                  mode: 'insensitive',
                },
              },
            ],
          }
        : {},
      select: {
        id: true,
        fullName: true,
        userName: true,
        image: true,
        createdAt: true,
        _count: {
          select: {
            pets: true,
            posts: true,
          },
        },
      },
      take: 10,
    })
    return users
  } catch (error: unknown) {
    console.log(error)
    return []
  }
}

export async function getOngs(query?: string) {
  try {
    // Since there's no specific "ong" type in the database,
    // we'll filter users who have more posts or pets (indicating they might be organizations)
    const ongs = await prisma.user.findMany({
      where: query
        ? {
            OR: [
              {
                fullName: {
                  contains: query,
                  mode: 'insensitive',
                },
              },
              {
                userName: {
                  contains: query,
                  mode: 'insensitive',
                },
              },
            ],
          }
        : {},
      select: {
        id: true,
        fullName: true,
        userName: true,
        image: true,
        createdAt: true,
        _count: {
          select: {
            pets: true,
            posts: true,
          },
        },
      },
      take: 10,
    })

    // Filter in memory for organizations (users with 3+ posts)
    return ongs.filter((user) => user._count.posts >= 3)
  } catch (error: unknown) {
    console.log(error)
    return []
  }
}

export async function searchPosts(formData: z.infer<typeof searchSchema>) {
  try {
    const query: string = formData.query

    const posts = await prisma.post.findMany({
      where: {
        OR: [
          {
            animalBreed: {
              contains: query,
              mode: 'insensitive',
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
          {
            lastSeenLocation: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            pet: {
              name: {
                contains: query,
                mode: 'insensitive',
              },
            },
          },
        ],
      },
      include: {
        user: true,
        pet: true,
        photos: {
          orderBy: {
            order: 'asc',
          },
        },
        comments: true,
        likes: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    })

    return posts
  } catch (error: unknown) {
    console.log(error)
    return []
  }
}

export async function search(formData: z.infer<typeof searchSchema>) {
  const query = formData.query.trim()

  if (!query) {
    return {
      posts: [],
      pets: [],
      users: [],
      ongs: [],
    }
  }

  try {
    const [posts, pets, users, ongs] = await Promise.all([
      searchPosts(formData),
      getPets(query),
      getUsers(query),
      getOngs(query),
    ])

    return {
      posts,
      pets,
      users,
      ongs,
    }
  } catch (error: unknown) {
    console.log(error)
    return {
      posts: [],
      pets: [],
      users: [],
      ongs: [],
    }
  }
}
