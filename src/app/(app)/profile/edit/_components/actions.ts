'use server'

import { headers } from 'next/headers'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import {
  deleteProfilePhoto,
  uploadProfilePhoto,
  validateImageFile,
} from '@/lib/s3-utils'

export const saveProfileSettings = async (
  newName: string,
  profileImageUrl?: string | null,
) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (session == null) {
    throw 'Sessão invalida'
  }

  await prisma.user.update({
    data: {
      fullName: newName,
      ...(profileImageUrl !== undefined && { image: profileImageUrl }),
    },
    where: {
      id: session.user.id,
    },
  })
}

export const uploadUserProfilePhoto = async (formData: FormData) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (session == null) {
    throw new Error('Sessão invalida')
  }

  const file = formData.get('file') as File
  if (!file) {
    throw new Error('Nenhum arquivo foi enviado')
  }

  // Validar o arquivo
  const validation = await validateImageFile(file)
  if (!validation.valid) {
    throw new Error(validation.error)
  }

  // Converter File para Buffer
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  try {
    // Delete a foto anterior se existir
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { image: true },
    })

    if (currentUser?.image) {
      const currentImageKey = extractS3KeyFromUrl(currentUser.image)
      if (currentImageKey) {
        await deleteProfilePhoto(currentImageKey)
      }
    }

    // Upload da nova foto
    const uploadResult = await uploadProfilePhoto(
      buffer,
      file.name,
      file.type,
      session.user.id,
    )

    // Atualizar o banco de dados
    await prisma.user.update({
      data: {
        image: uploadResult.s3Url,
      },
      where: {
        id: session.user.id,
      },
    })

    return { success: true, imageUrl: uploadResult.s3Url }
  } catch (error) {
    console.error('Erro ao fazer upload da foto:', error)
    throw new Error('Erro ao fazer upload da foto de perfil')
  }
}

export const removeUserProfilePhoto = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (session == null) {
    throw new Error('Sessão invalida')
  }

  try {
    // Buscar a foto atual do usuário
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { image: true },
    })

    if (currentUser?.image) {
      const currentImageKey = extractS3KeyFromUrl(currentUser.image)
      if (currentImageKey) {
        await deleteProfilePhoto(currentImageKey)
      }
    }

    // Remover a referência no banco de dados
    await prisma.user.update({
      data: {
        image: null,
      },
      where: {
        id: session.user.id,
      },
    })

    return { success: true }
  } catch (error) {
    console.error('Erro ao remover foto:', error)
    throw new Error('Erro ao remover foto de perfil')
  }
}

// Função helper para extrair a chave S3 da URL
function extractS3KeyFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url)
    const pathname = urlObj.pathname
    // Remove a primeira barra e o nome do bucket
    const pathParts = pathname.split('/').slice(2) // Remove '', 'bucket-name'
    return pathParts.join('/')
  } catch {
    return null
  }
}
