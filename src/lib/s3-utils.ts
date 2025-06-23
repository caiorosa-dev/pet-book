'use server'

import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import { v4 as uuidv4 } from 'uuid'

import { S3_BUCKET_NAME, s3Client } from './s3'

interface UploadPhotoResult {
  photoId: string
  s3Key: string
  s3Url: string
  filename: string
}

export async function uploadPetPhoto(
  file: Buffer,
  originalFilename: string,
  mimeType: string,
): Promise<UploadPhotoResult> {
  const photoId = uuidv4()
  const fileExtension = getFileExtension(originalFilename, mimeType)
  const filename = `${photoId}.${fileExtension}`
  const s3Key = `pets/${filename}`

  const command = new PutObjectCommand({
    Bucket: S3_BUCKET_NAME,
    Key: s3Key,
    Body: file,
    ContentType: mimeType,
    Metadata: {
      originalFilename,
      photoId,
    },
  })

  await s3Client.send(command)

  const s3Url = `${process.env.S3_ENDPOINT}/${S3_BUCKET_NAME}/${s3Key}`

  return {
    photoId,
    s3Key,
    s3Url,
    filename,
  }
}

export async function deletePetPhoto(s3Key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: S3_BUCKET_NAME,
    Key: s3Key,
  })

  await s3Client.send(command)
}

export async function uploadProfilePhoto(
  file: Buffer,
  originalFilename: string,
  mimeType: string,
  userId: string,
): Promise<UploadPhotoResult> {
  const photoId = uuidv4()
  const fileExtension = getFileExtension(originalFilename, mimeType)
  const filename = `${photoId}.${fileExtension}`
  const s3Key = `profiles/${userId}/${filename}`

  const command = new PutObjectCommand({
    Bucket: S3_BUCKET_NAME,
    Key: s3Key,
    Body: file,
    ContentType: mimeType,
    Metadata: {
      originalFilename,
      photoId,
      userId,
    },
  })

  await s3Client.send(command)

  const s3Url = `${process.env.S3_ENDPOINT}/${S3_BUCKET_NAME}/${s3Key}`

  return {
    photoId,
    s3Key,
    s3Url,
    filename,
  }
}

export async function deleteProfilePhoto(s3Key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: S3_BUCKET_NAME,
    Key: s3Key,
  })

  await s3Client.send(command)
}

function getFileExtension(filename: string, mimeType: string): string {
  // Primeiro tenta extrair a extensão do nome do arquivo
  const extensionFromFilename = filename.split('.').pop()?.toLowerCase()

  if (
    extensionFromFilename &&
    ['jpg', 'jpeg', 'png', 'webp'].includes(extensionFromFilename)
  ) {
    return extensionFromFilename
  }

  // Se não conseguir, usa o MIME type
  switch (mimeType) {
    case 'image/jpeg':
      return 'jpg'
    case 'image/png':
      return 'png'
    case 'image/webp':
      return 'webp'
    default:
      return 'jpg' // fallback
  }
}

export async function validateImageFile(file: File): Promise<{
  valid: boolean
  error?: string
}> {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Apenas imagens JPEG, PNG e WebP são permitidas.',
    }
  }

  const maxSizeInBytes = 10 * 1024 * 1024
  if (file.size > maxSizeInBytes) {
    return {
      valid: false,
      error: 'A imagem deve ter no máximo 10MB.',
    }
  }

  return { valid: true }
}
