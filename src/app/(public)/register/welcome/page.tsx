/* eslint-disable @next/next/no-img-element */
'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { Button } from '@/components/ui/button'
import { useRegisterStore } from '@/lib/register-store'

export default function RegisterWelcomePage() {
  const router = useRouter()
  const { name, clearStore } = useRegisterStore()

  useEffect(() => {
    // Clear the store after 5 minutes
    const timeout = setTimeout(
      () => {
        clearStore()
      },
      5 * 60 * 1000,
    )

    return () => clearTimeout(timeout)
  }, [clearStore])

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 text-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Bem vindo, <span className="text-primary">{name}</span>!
          </h1>
          <p className="mt-6 text-slate-600">
            Sua conta já está criada, você já tem acesso ao Petbook a partir de
            agora, seja bem vindo!
          </p>
        </div>

        <div className="flex justify-center">
          <img src="/images/welcome.svg" alt="Welcome" className="h-[400px]" />
        </div>

        <div className="space-y-4">
          <Button
            onClick={() => router.push('/')}
            className="w-full"
            size="rounded"
          >
            Visualizar o feed
          </Button>
          <Button
            onClick={() => router.push('/profile/new-pet')}
            className="w-full"
            variant="muted"
            size="rounded"
          >
            Cadastrar meu pet
          </Button>
        </div>
      </div>
    </div>
  )
}
