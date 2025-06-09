'use client'

import { z } from 'zod'

import { formSchema, LostPetForm } from '../_components/lost-pet-form'

export default function CreatePostPage() {
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    try {
      // axios({
      //   method: 'post',
      //   url: '/post/lost-pet/new',
      //   data: {
      //     ...values,
      //   },
      // })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <div className="max-w-xl w-full mx-auto h-full flex flex-col gap-10">
        <h1 className="text-3xl font-bold text-center">
          Informe o pet perdido
        </h1>
        <p className="text-center text-secondary-foreground">
          Passe as informações como onde viu por último e quando, para ajudar a
          comunidade a encontrar seu pet.
        </p>
        <div className="py-4">
          <LostPetForm onSubmit={onSubmit} />
        </div>
      </div>
    </>
  )
}
