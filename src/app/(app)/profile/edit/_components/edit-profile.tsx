'use client'
import { Upload, UserIcon, X } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { toast } from 'sonner'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { authClient } from '@/lib/auth-client'

import {
  removeUserProfilePhoto,
  saveProfileSettings,
  uploadUserProfilePhoto,
} from './actions'

function EditProfileTab({ userName }: { userName: string }) {
  const [name, setName] = useState(userName)
  const [isUploading, setIsUploading] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null)

  const session = authClient.useSession()

  const currentImageUrl = profileImageUrl || session.data?.user.image || ''

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const result = await uploadUserProfilePhoto(formData)
      setProfileImageUrl(result.imageUrl)
      toast.success('Foto de perfil atualizada com sucesso!')
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Erro ao fazer upload da foto',
      )
    } finally {
      setIsUploading(false)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
    },
    maxFiles: 1,
    multiple: false,
  })

  const handleRemovePhoto = async () => {
    setIsRemoving(true)
    try {
      await removeUserProfilePhoto()
      setProfileImageUrl(null)
      toast.success('Foto de perfil removida com sucesso!')
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Erro ao remover foto',
      )
    } finally {
      setIsRemoving(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await saveProfileSettings(name, profileImageUrl)
      toast.success('Perfil atualizado com sucesso!')
    } catch {
      toast.error('Erro ao salvar alterações')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Opções de conta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage
                  src={currentImageUrl}
                  alt="Avatar"
                  className="object-cover w-full h-full"
                />
                <AvatarFallback>
                  <UserIcon className="size-10" />
                </AvatarFallback>
              </Avatar>

              {currentImageUrl && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute top-1 right-1 h-6 w-6 bg-white/80 backdrop-blur-sm rounded-full shadow-md p-0"
                      disabled={isRemoving}
                    >
                      <X className="h-4 w-4 text-gray-700" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Remover foto de perfil
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-black">
                        Tem certeza que deseja remover sua foto de perfil? Esta
                        ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleRemovePhoto}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        disabled={isRemoving}
                      >
                        {isRemoving ? 'Removendo...' : 'Remover'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>

            <div className="flex gap-2">
              <div
                {...getRootProps()}
                className={`
                  flex items-center gap-2 px-4 py-2 border-2 border-dashed rounded-lg cursor-pointer transition-colors
                  ${isDragActive ? 'border-primary bg-primary/10' : 'border-muted-foreground/25'}
                  ${isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary hover:bg-primary/5'}
                `}
              >
                <input {...getInputProps()} disabled={isUploading} />
                <Upload className="h-4 w-4" />
                <span className="text-sm">
                  {isUploading
                    ? 'Enviando...'
                    : isDragActive
                      ? 'Solte aqui'
                      : 'Escolher foto'}
                </span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              Arraste uma imagem ou clique para selecionar
              <br />
              Formatos aceitos: JPG, PNG, WebP (máx. 10MB)
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              onChange={(e) => setName(e.target.value)}
              id="name"
              value={name}
              placeholder="Seu nome completo"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isUploading || isRemoving}>
            Salvar alterações
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}

export default EditProfileTab
