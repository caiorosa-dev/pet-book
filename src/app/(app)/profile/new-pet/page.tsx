'use client'

import { NewPetForm } from './_components/new-pet-form'

export default function AddPetPage() {
  return (
    <div className="max-w-xl w-full mx-auto h-full flex flex-col gap-10">
      <h1 className="text-3xl font-bold tracking-tight">Adicionando um pet</h1>
      <p className="mt-2 text-slate-600">
        Informe as informações do seu pet para começar a postar com ele.
      </p>
      <NewPetForm />
    </div>
  )
}
