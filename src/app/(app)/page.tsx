import { prisma } from '@/lib/prisma'

export default async function AppPage() {
  return <div>{JSON.stringify(await prisma.user.findFirst())}</div>
}
