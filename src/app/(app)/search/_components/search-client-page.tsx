'use client'

import { useCallback, useState } from 'react'

import OngsList from './ongs-list'
import PeopleList from './people-list'
import PetsList from './pets-list'
import { SearchForm } from './search-form'
import SearchResults from './search-results'

interface SearchClientPageProps {
  currentUserId: string
}

export function SearchClientPage({ currentUserId }: SearchClientPageProps) {
  const [searchResults, setSearchResults] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearchResults = useCallback((results: any, loading: boolean) => {
    setIsLoading(loading)
    if (results !== null) {
      setSearchResults(results)
      setHasSearched(true)
    }
  }, [])

  return (
    <div className="flex flex-col gap-6">
      <div className="sticky top-0 bg-white z-10 pb-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Buscar</h1>
        <SearchForm onSearchResults={handleSearchResults} />
      </div>

      {hasSearched && searchResults ? (
        <SearchResults
          results={searchResults}
          currentUserId={currentUserId}
          isLoading={isLoading}
        />
      ) : (
        !isLoading && (
          <div className="space-y-8">
            <div className="text-center py-8">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Descubra pets, pessoas e comunidades
              </h2>
              <p className="text-gray-500">
                Use a barra de pesquisa acima para encontrar o que procura
              </p>
            </div>

            <div className="space-y-8">
              <PetsList />
              <PeopleList />
              <OngsList />
            </div>
          </div>
        )
      )}

      {isLoading && (
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
      )}
    </div>
  )
}
