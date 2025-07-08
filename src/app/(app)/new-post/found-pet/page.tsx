'use client'

import { FoundPetForm } from '../_components/found-pet-form'

export default function CreateFoundPetPostPage() {
  return (
    <>
      <div className="max-w-xl w-full mx-auto h-full flex flex-col gap-10">
        <h1 className="text-3xl font-bold text-center">
          Informe o pet encontrado
        </h1>
        <p className="text-center text-secondary-foreground">
          Passe as informações como onde viu por último e quando, para ajudar a
          comunidade a encontrar seu pet.
        </p>
        <div className="py-4">
          <FoundPetForm />
        </div>
      </div>
    </>
  )
}
