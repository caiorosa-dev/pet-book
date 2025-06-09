'use server'

import { z } from 'zod'

import { foundPetSchema, lostPetSchema } from './schema'

export async function createFoundPetPost(data: z.infer<typeof foundPetSchema>) {
  console.log(data)
}

export async function createLostPetPost(data: z.infer<typeof lostPetSchema>) {
  console.log(data)
}
