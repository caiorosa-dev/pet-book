import { S3Client } from '@aws-sdk/client-s3'

if (!process.env.S3_ENDPOINT) {
  throw new Error('S3_ENDPOINT environment variable is required')
}

if (!process.env.S3_ACCESS_KEY) {
  throw new Error('S3_ACCESS_KEY environment variable is required')
}

if (!process.env.S3_SECRET_KEY) {
  throw new Error('S3_SECRET_KEY environment variable is required')
}

if (!process.env.S3_BUCKET_NAME) {
  throw new Error('S3_BUCKET_NAME environment variable is required')
}

export const s3Client = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  },
  forcePathStyle: true, // Necessário para MinIO
})

export const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME
export const S3_REGION = process.env.S3_REGION || 'us-east-1'
