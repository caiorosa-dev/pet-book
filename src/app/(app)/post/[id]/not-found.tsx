import { ArrowLeft, SearchX } from 'lucide-react'
import Link from 'next/link'

import { Container } from '@/components/layout/container'
import { Button } from '@/components/ui/button'

export default function PostNotFound() {
  return (
    <Container>
      <div className="max-w-2xl mx-auto">
        <div className="text-center py-16">
          <SearchX className="size-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Post não encontrado
          </h1>
          <p className="text-gray-600 mb-6">
            O post que você está procurando não existe ou foi removido.
          </p>
          <Button asChild>
            <Link href="/">
              <ArrowLeft className="size-4 mr-2" />
              Voltar ao Feed
            </Link>
          </Button>
        </div>
      </div>
    </Container>
  )
}
