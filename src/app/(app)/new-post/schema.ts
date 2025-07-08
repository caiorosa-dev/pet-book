import z from 'zod'

export const lostPetSchema = z.object({
  pet: z.string(),
  lastSeenDate: z.date(),
  petDescription: z.string(),
})

export const foundPetSchema = z.object({
  animalSpecies: z.string(),
  animalBreed: z.string(),
  lastSeenDate: z.date(),
  petDescription: z.string(),
})

// Schema para dados de foto
export const photoDataSchema = z.object({
  id: z.string(),
  file: z.string(), // base64
  filename: z.string(),
  mimeType: z.string(),
  preview: z.string(),
})
