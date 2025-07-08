import { z } from 'zod'

export const addPetSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  species: z.string().min(1, 'Espécie é obrigatória'),
  breed: z.string().min(1, 'Raça é obrigatória'),
  features: z.string().optional(),
})

export const photoDataSchema = z.object({
  id: z.string(),
  file: z.string(), // base64
  filename: z.string(),
  mimeType: z.string(),
  preview: z.string(),
})
