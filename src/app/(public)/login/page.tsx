'use client'

import { ArrowRightIcon, AtSignIcon, LockIcon } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button, ButtonIcon } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useClientForm } from '@/hooks/use-client-form'
import { authClient } from '@/lib/auth-client'

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
})

export default function LoginPage() {
  const router = useRouter()

  const form = useClientForm({
    schema: loginSchema,
    defaultValues: {
      email: '',
      password: '',
    },
    handler: async (values) => {
      const result = await authClient.signIn.email({
        email: values.email,
        password: values.password,
      })

      if (result.error) {
        throw new Error(result.error.message)
      }
    },
    onSubmitSuccess: () => {
      router.push('/')
      router.refresh()
    },
    onSubmitError: () => {
      toast.error('Email ou senha inválidos')
    },
  })

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Bem vindo novamente
          </h1>
          <p className="mt-6 text-slate-600">
            Para entrar, nos informe o email e a senha para entrar na conta.
          </p>
        </div>
        <Form {...form} className="mt-8 space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Seu email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      autoComplete="email"
                      placeholder="marty.mcfly@gmail.com"
                      icon={AtSignIcon}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sua senha</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      autoComplete="current-password"
                      icon={LockIcon}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              size="rounded"
              disabled={form.isSubmitting}
            >
              {form.isSubmitting ? 'Entrando...' : 'Entrar no Petbook'}
              <ButtonIcon icon={ArrowRightIcon} isLoading={form.isSubmitting} />
            </Button>
          </div>
          {form.error && (
            <div className="text-sm text-red-500 font-medium">{form.error}</div>
          )}
          <div className="text-center text-sm">
            <span className="text-gray-600">Não tem uma conta?</span>{' '}
            <Link
              href="/register"
              className="font-medium text-primary hover:underline"
            >
              Registrar
            </Link>
          </div>
        </Form>
      </div>
    </div>
  )
}
