import z from 'zod'

export const lostPetSchema = z.object({
  pet: z.string(),
  lastSeenDate: z.date(),
  petDescription: z.string(),
  photos: z.array(z.string()).optional(),
})

export const foundPetSchema = z.object({
  animalSpecies: z.string(),
  animalBreed: z.string(),
  lastSeenDate: z.date(),
  petDescription: z.string(),
  photos: z.array(z.string()).optional(),
})
