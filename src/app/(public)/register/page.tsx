'use client'

import { AtSignIcon, PhoneIcon, UserIcon } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useClientForm } from '@/hooks/use-client-form'
import { authClient } from '@/lib/auth-client'

const registerSchema = z
  .object({
    name: z.string().min(1, 'Nome é obrigatório'),
    username: z.string().min(1, 'Nome de usuário é obrigatório'),
    phone: z.string().min(1, 'Telefone é obrigatório'),
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
    confirmPassword: z.string().min(6, 'Confirmação de senha é obrigatória'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não conferem',
    path: ['confirmPassword'],
  })

export default function RegisterPage() {
  const [step, setStep] = useState(1)

  const form = useClientForm({
    schema: registerSchema,
    defaultValues: {
      name: '',
      username: '',
      phone: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    handler: async (values) => {
      await authClient.signUp.email({
        ...values,
        callbackURL: '/',
      })
      return { success: true }
    },
  })

  // Generate username from name while typing
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'name') {
        const generatedUsername =
          value.name?.toLowerCase().replace(/\s+/g, '.') || ''
        form.setValue('username', generatedUsername)
      }
    })
    return () => subscription.unsubscribe()
  }, [form])

  const nextStep = () => {
    setStep(2)
  }

  const prevStep = () => {
    setStep(1)
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            {step === 1 ? 'Bem vindo' : 'Falta pouco...'}
          </h1>
          <p className="mt-6 text-slate-600">
            {step === 1
              ? 'Vamos criar a sua conta do Petbook para começar a usar a nossa rede social.'
              : 'Para finalizarmos, informe o seu email e a senha para entrar na conta.'}
          </p>
        </div>
        <Form {...form} className="mt-8 space-y-6">
          {step === 1 ? (
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Seu nome completo</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        autoComplete="name"
                        placeholder="Marty McFly"
                        icon={UserIcon}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Seu nome de usuário</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        autoComplete="username"
                        placeholder="marty.mcfly"
                        icon={AtSignIcon}
                      />
                    </FormControl>
                    <FormMessage />
                    <Label className="text-xs text-muted opacity-60">
                      Este será seu arroba para a rede social.
                    </Label>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Seu telefone</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="tel"
                        autoComplete="tel"
                        placeholder="(48) 12345-6789"
                        icon={PhoneIcon}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="button" onClick={nextStep} className="w-full">
                Próximo
              </Button>
            </div>
          ) : (
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
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex space-x-4">
                <Button type="button" onClick={prevStep} className="w-full">
                  Voltar
                </Button>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={form.isSubmitting}
                >
                  {form.isSubmitting ? 'Criando conta...' : 'Criar conta'}
                </Button>
              </div>
            </div>
          )}
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
