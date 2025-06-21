import OngsList from './_components/ongs-list'
import PeopleList from './_components/people-list'
import PetsList from './_components/pets-list'
import { SearchForm } from './_components/search-form'

export default function SearchPage() {
  // const pets: Pet[] = []
  // const people: User[] = []
  // const ongs: User[] = []
  return (
    <>
      <div className="max-w-xl w-full mx-auto h-full flex flex-col gap-4">
        <SearchForm />
        <PetsList />
        <PeopleList />
        <OngsList />
      </div>
    </>
  )
}
