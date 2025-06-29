'use client'

import { useEffect, useState } from 'react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { PetWithRelations, PostWithRelations } from '@/types/database'

import PostCard from '../../(feed)/_components/post-card'
import OngsList from './ongs-list'
import PeopleList from './people-list'
import PetsList from './pets-list'

interface SearchResultsProps {
  results: {
    posts: PostWithRelations[]
    pets: PetWithRelations[]
    users: Array<{
      id: string
      fullName: string
      userName: string
      image: string | null
      createdAt: Date
      _count: {
        pets: number
        posts: number
      }
    }>
    ongs: Array<{
      id: string
      fullName: string
      userName: string
      image: string | null
      createdAt: Date
      _count: {
        pets: number
        posts: number
      }
    }>
  }
  isLoading?: boolean
}

export default function SearchResults({
  results,
  isLoading,
}: SearchResultsProps) {
  const [activeTab, setActiveTab] = useState('posts')

  // Auto-switch to the tab with results
  useEffect(() => {
    if (results.posts.length > 0) {
      setActiveTab('posts')
    } else if (results.pets.length > 0) {
      setActiveTab('pets')
    } else if (results.users.length > 0) {
      setActiveTab('users')
    } else if (results.ongs.length > 0) {
      setActiveTab('ongs')
    }
  }, [results])

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-200 rounded-xl h-64"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const totalResults =
    results.posts.length +
    results.pets.length +
    results.users.length +
    results.ongs.length

  if (totalResults === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Nenhum resultado encontrado</p>
      </div>
    )
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="posts" className="text-xs">
          Posts ({results.posts.length})
        </TabsTrigger>
        <TabsTrigger value="pets" className="text-xs">
          Pets ({results.pets.length})
        </TabsTrigger>
        <TabsTrigger value="users" className="text-xs">
          Pessoas ({results.users.length})
        </TabsTrigger>
        <TabsTrigger value="ongs" className="text-xs">
          ONGs ({results.ongs.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="posts" className="space-y-4 mt-4">
        {results.posts.length > 0 ? (
          <div className="space-y-4">
            {results.posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">Nenhum post encontrado</p>
          </div>
        )}
      </TabsContent>

      <TabsContent value="pets" className="mt-4">
        <PetsList pets={results.pets} />
      </TabsContent>

      <TabsContent value="users" className="mt-4">
        <PeopleList users={results.users} />
      </TabsContent>

      <TabsContent value="ongs" className="mt-4">
        <OngsList ongs={results.ongs} />
      </TabsContent>
    </Tabs>
  )
}
