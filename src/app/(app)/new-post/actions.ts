'use server'

import { z } from 'zod'

import { foundPetSchema, lostPetSchema } from './schema'

export async function createFoundPetPost(data: z.infer<typeof foundPetSchema>) {
  try {
    fetch('/api/post/new-found-pet-post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
  } catch (error: any) {
    console.log(error)
  }
}

export async function createLostPetPost(data: z.infer<typeof lostPetSchema>) {
  try {
    fetch('/api/post/new-lost-pet-post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
  } catch (error: any) {
    console.log(error)
  }
}
