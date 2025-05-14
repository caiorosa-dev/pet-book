'use client'

import { AtSignIcon, PhoneIcon, UserIcon } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { authClient } from '@/lib/auth-client'

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Generate username from name
  useEffect(() => {
    if (name) {
      // Convert name to lowercase, remove special chars, replace spaces with dots
      const generatedUsername = name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove accents
        .replace(/[^\w\s]/gi, '') // Remove special characters
        .replace(/\s+/g, '.') // Replace spaces with dots

      setEmail(generatedUsername)
    }
  }, [name])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    await authClient.signUp.email(
      {
        email,
        password,
        name,
        callbackURL: '/',
      },
      {
        onRequest: () => setIsLoading(true),
        onSuccess: () => {
          setIsLoading(false)
          router.push('/login?registered=true')
        },
        onError: (ctx) => {
          setIsLoading(false)
          setError(
            ctx.error?.message || 'Something went wrong. Please try again.',
          )
        },
      },
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Bem vindo</h1>
          <p className="mt-6 text-slate-600">
            Vamos criar a sua conta do Petbook para começar a usar a nossa rede
            social.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Seu nome completo</Label>
              <Input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Marty McFly"
                icon={UserIcon}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Seu nome de usuário</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="marty.mcfly"
                icon={AtSignIcon}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Esse será seu arroba para a rede social
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Seu telefone</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                icon={PhoneIcon}
                placeholder="(48) 12345-6789"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-500 font-medium">{error}</div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Creating account...' : 'Create account'}
          </Button>

          <div className="text-center text-sm">
            <span className="text-gray-600">Already have an account?</span>{' '}
            <Link
              href="/login"
              className="font-medium text-primary hover:underline"
            >
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
