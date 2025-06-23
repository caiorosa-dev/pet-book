import { getUserPosts } from '../new-pet/actions'
import PostItem from './post-item'

export default async function PostsList() {
  const posts = await getUserPosts()

  return (
    <div className="flex flex-col gap-4 mt-12">
      <h1 className="text-x1">Seus Posts</h1>
      {posts.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {posts.map((post) => (
            <PostItem key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-slate-600">Você ainda não fez nenhum post.</p>
          <p className="text-slate-500 text-sm">
            Comece criando seu primeiro post sobre um pet perdido ou encontrado!
          </p>
        </div>
      )}
    </div>
  )
}
