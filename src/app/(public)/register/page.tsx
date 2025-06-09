'use client'

import { ArrowRightIcon, AtSignIcon, PhoneIcon, UserIcon } from 'lucide-react'
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
import { Label } from '@/components/ui/label'
import { PhoneInput } from '@/components/ui/phone-input'
import { useClientForm } from '@/hooks/use-client-form'
import { useRegisterStore } from '@/lib/register-store'

const registerSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  username: z.string().min(1, 'Nome de usuário é obrigatório'),
  phone: z.string().min(1, 'Telefone é obrigatório'),
})

export default function RegisterPage() {
  const router = useRouter()
  const { name, username, phone, setStep1Data } = useRegisterStore()

  const form = useClientForm({
    schema: registerSchema,
    defaultValues: {
      name: name || '',
      username: username || '',
      phone: phone || '',
    },
    handler: async (values) => {
      setStep1Data(values)

      return { success: true }
    },
    onSubmitSuccess: () => {
      router.push('/register/finish')
    },
    onSubmitError: (error) => {
      toast.error(error.message)
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
        <Form {...form} className="mt-8 space-y-6">
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
                    <PhoneInput
                      {...field}
                      type="tel"
                      autoComplete="tel"
                      placeholder="+55 (48) 12345-6789"
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
              {form.isSubmitting ? 'Avançando...' : 'Próximo'}
              <ButtonIcon icon={ArrowRightIcon} isLoading={form.isSubmitting} />
            </Button>
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
