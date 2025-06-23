'use client'

import { Search } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useClientForm } from '@/hooks/use-client-form'

import { search } from '../actions'
import { searchSchema } from '../schema'

interface SearchFormProps {
  onSearchResults?: (results: any, isLoading: boolean) => void
}

export function SearchForm({ onSearchResults }: SearchFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useClientForm({
    schema: searchSchema,
    defaultValues: {
      query: '',
    },
  })

  const query = form.watch('query')

  const performSearch = useCallback(
    async (searchQuery: string) => {
      if (searchQuery.trim()) {
        setIsLoading(true)
        onSearchResults?.(null, true)

        try {
          const results = await search({ query: searchQuery.trim() })
          onSearchResults?.(results, false)
        } catch (error) {
          console.error('Search error:', error)
          onSearchResults?.(
            {
              posts: [],
              pets: [],
              users: [],
              ongs: [],
            },
            false,
          )
        } finally {
          setIsLoading(false)
        }
      } else {
        // Clear results when query is empty
        onSearchResults?.(
          {
            posts: [],
            pets: [],
            users: [],
            ongs: [],
          },
          false,
        )
      }
    },
    [onSearchResults],
  )

  // Debounced search effect
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      performSearch(query)
    }, 300) // 300ms debounce

    return () => clearTimeout(delayedSearch)
  }, [query, performSearch])

  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="query"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input
                {...field}
                icon={Search}
                placeholder="Procure por pets, pessoas, posts ou ONGs..."
                className="w-full"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </Form>
  )
}
