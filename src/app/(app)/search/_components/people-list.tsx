import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { getNameInitials } from '@/helpers/get-name-initials'

interface User {
  id: string
  fullName: string
  userName: string
  image: string | null
  createdAt: Date
  _count: {
    pets: number
    posts: number
  }
}

interface PeopleListProps {
  users?: User[]
}

export default function PeopleList({ users = [] }: PeopleListProps) {
  if (users.length === 0) {
    return (
      <>
        <h2 className="pb-3">Pessoas</h2>
        <div className="text-center py-8">
          <p className="text-slate-500">Nenhuma pessoa encontrada</p>
        </div>
      </>
    )
  }

  return (
    <>
      <h2 className="pb-3">Pessoas</h2>
      <div className="grid grid-cols-2 gap-4">
        {users.map((user) => (
          <Card key={user.id}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="size-16">
                  <AvatarImage src={user.image ?? ''} />
                  <AvatarFallback className="text-lg">
                    {getNameInitials(user.fullName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h6 className="text-lg font-semibold text-slate-900 truncate">
                    {user.fullName}
                  </h6>
                  <p className="text-sm text-slate-600 truncate">
                    @{user.userName}
                  </p>
                </div>
              </div>

              <div className="flex gap-6 mb-4">
                <div className="text-center flex-1">
                  <p className="text-xl font-bold text-teal-600">
                    {user._count.pets}
                  </p>
                  <p className="text-xs text-slate-500">Pets</p>
                </div>
                <div className="text-center flex-1">
                  <p className="text-xl font-bold text-teal-600">
                    {user._count.posts}
                  </p>
                  <p className="text-xs text-slate-500">Posts</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <p className="text-xs text-slate-500">
                  Membro desde{' '}
                  {new Date(user.createdAt).toLocaleDateString('pt-BR', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  )
}
