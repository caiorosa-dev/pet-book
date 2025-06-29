'use client'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'

export function SignOutButton() {
  const router = useRouter()

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/login')
        },
        onError: (err) => {
          console.error('Logout error:', err)
          toast.error('Erro ao sair do perfil')
        },
      },
    })
  }

  return (
    <Button
      variant="accent"
      size="sm"
      className="flex-1 text-red-400"
      onClick={handleSignOut}
    >
      Sair do perfil
    </Button>
  )
}
