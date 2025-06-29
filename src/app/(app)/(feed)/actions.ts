'use server'

import { prisma } from '@/lib/prisma'

export async function hasLikedPost(
  postId: string,
  userId: string,
): Promise<boolean> {
  const like = await prisma.like.findFirst({
    where: { postId, userId },
  })

  return !!like
}

export async function likePost(postId: string, userId: string) {
  // Verifica se o usuário já curtiu o post
  const existingLike: boolean = await hasLikedPost(postId, userId)
  if (existingLike) {
    return { liked: false, message: 'Usuário já curtiu o post.' }
  }

  // Cria o like
  await prisma.like.create({
    data: {
      userId,
      postId,
    },
  })

  return { liked: true, message: 'Post curtido com sucesso!' }
}

export async function dislikePost(postId: string, userId: string) {
  // Verifica se o usuário curtiu o post
  const existingLike = await prisma.like.findFirst({
    where: {
      userId,
      postId,
    },
  })

  if (!existingLike) {
    return { disliked: false, message: 'Usuário ainda não curtiu o post.' }
  }

  // Remove o like com base no ID único
  await prisma.like.delete({
    where: {
      id: existingLike.id,
    },
  })

  return { disliked: true, message: 'Like removido com sucesso.' }
}
