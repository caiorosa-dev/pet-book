import type { Comment, Like, Pet, PetPhoto, Post, User } from '@/generated'

export interface PetWithRelations extends Omit<Pet, 'photos'> {
  owner?: User
  photos: PetPhoto[]
}

export interface PostWithRelations extends Post {
  likes: Like[]
  comments: Comment[]
  pet?: Pet | null
  user?: User | null
}

export interface UserWithRelations extends User {
  pets: Pet[]
  posts: Post[]
}

export interface PetPhotoWithRelations extends PetPhoto {
  pet?: Pet
}

export interface UserStats {
  pets: number
  posts: number
  found: number
}
