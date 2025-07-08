import { Container } from '@/components/layout/container'

import PetsList from './_components/pets-list'
import PostsList from './_components/posts-list'
import ProfileHeader from './_components/profile-header'

export default function ProfilePage() {
  return (
    <Container>
      <ProfileHeader />
      <PetsList />
      <PostsList />
    </Container>
  )
}
