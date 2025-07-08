'use server'

import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export interface FeedFilters {
  type?: 'lost' | 'found'
  userId?: string
  limit?: number
  offset?: number
}

export async function getAllPosts(filters: FeedFilters = {}) {
  try {
    const { type, userId, limit = 20, offset = 0 } = filters

    const whereClause: any = {}

    if (type) {
      whereClause.type = type
    }

    if (userId) {
      whereClause.userId = userId
    }

    const posts = await prisma.post.findMany({
      where: whereClause,
      include: {
        user: true,
        likes: true,
        comments: {
          include: {
            author: true,
          },
        },
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
      take: limit,
      skip: offset,
    })

    return posts
  } catch (error) {
    console.error('Erro ao buscar posts:', error)
    return []
  }
}

export async function getUserPosts(userId?: string) {
  try {
    const session = await getSession()
    const targetUserId = userId || session?.user.id

    if (!targetUserId) {
      return []
    }

    return getAllPosts({ userId: targetUserId })
  } catch (error) {
    console.error('Erro ao buscar posts do usuário:', error)
    return []
  }
}

export async function getPostById(postId: string) {
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        user: true,
        likes: true,
        comments: {
          include: {
            author: true,
          },
          orderBy: {
            timestamp: 'desc',
          },
        },
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
            },
          },
        },
      },
    })

    return post
  } catch (error) {
    console.error('Erro ao buscar post:', error)
    return null
  }
}

export async function getFeedStats() {
  try {
    const [totalPosts, lostPosts, foundPosts] = await Promise.all([
      prisma.post.count(),
      prisma.post.count({
        where: { type: 'lost' },
      }),
      prisma.post.count({
        where: { type: 'found' },
      }),
    ])

    return {
      total: totalPosts,
      lost: lostPosts,
      found: foundPosts,
    }
  } catch (error) {
    console.error('Erro ao buscar estatísticas do feed:', error)
    return {
      total: 0,
      lost: 0,
      found: 0,
    }
  }
}
