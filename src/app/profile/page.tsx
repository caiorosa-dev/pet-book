import { Container } from "@/components/layout/container";
import ProfileHeader from "./_components/profile-header";
import PetComponent from "./_components/pet-component";
import PetsList from "./_components/pets-list";
import { FullScreenPage } from "@/components/layout/full-screen-page";
import PostsList from "./_components/posts-list";

export default function ProfilePage() {
  return (
    <Container>
      <ProfileHeader />
      <PetsList />
      <PostsList />
    </Container>
  );
}
