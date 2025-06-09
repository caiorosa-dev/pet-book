import z from 'zod'

export const lostPetSchema = z.object({
  pet: z.string(),
  datetimeLastSeen: z.date(),
  lastTimeSeenDescription: z.string(),
  images: z.array(z.string()).optional(),
})

export const foundPetSchema = z.object({
  species: z.string(),
  breed: z.string(),
  datetimeLastSeen: z.date(),
  description: z.string(),
  images: z.array(z.string()).optional(),
})
