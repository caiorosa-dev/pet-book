'use client'

import { ArrowRightIcon, AtSignIcon, LockIcon } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
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
import { useRegisterStore } from '@/lib/register-store'

const registerSchema = z
  .object({
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
    confirmPassword: z.string().min(6, 'Confirmação de senha é obrigatória'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não conferem',
    path: ['confirmPassword'],
  })

export default function RegisterFinishPage() {
  const router = useRouter()
  const { name, username, phone, email, password, setStep2Data } =
    useRegisterStore()

  useEffect(() => {
    if (!name || !username || !phone) {
      router.push('/register')
    }
  }, [name, username, phone, router])

  const form = useClientForm({
    schema: registerSchema,
    defaultValues: {
      email: email || '',
      password: password || '',
      confirmPassword: password || '',
    },
    handler: async (values) => {
      setStep2Data(values)

      await authClient.signUp.email({
        name,
        username,
        phone,
        ...values,
      })
    },
    onSubmitSuccess: () => {
      router.push('/register/welcome')
    },
    onSubmitError: (error) => {
      console.error(error)
      toast.error(error.message)
    },
  })

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Falta pouco...</h1>
          <p className="mt-6 text-slate-600">
            Para finalizarmos, informe o seu email e a senha para entrar na
            conta.
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
                      placeholder="marty@example.com"
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
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      autoComplete="new-password"
                      placeholder="******"
                      icon={LockIcon}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar senha</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      autoComplete="new-password"
                      placeholder="******"
                      icon={LockIcon}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-4">
              <Button
                type="submit"
                className="w-full"
                disabled={form.isSubmitting}
                size="rounded"
              >
                {form.isSubmitting ? 'Criando conta...' : 'Criar conta'}
                <ButtonIcon
                  icon={ArrowRightIcon}
                  isLoading={form.isSubmitting}
                />
              </Button>
              <Button
                type="button"
                onClick={() => router.push('/register')}
                className="w-full"
                variant="outline"
                size="rounded"
              >
                Voltar
              </Button>
            </div>
          </div>
          {form.error && (
            <div className="text-sm text-red-500 font-medium">{form.error}</div>
          )}
          <div className="text-center text-sm">
            <span className="text-gray-600">Já tem uma conta?</span>{' '}
            <Link
              href="/login"
              className="font-medium text-primary hover:underline"
            >
              Entrar
            </Link>
          </div>
        </Form>
      </div>
    </div>
  )
}
