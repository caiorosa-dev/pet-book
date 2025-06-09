import { Container } from "@/components/layout/container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EditProfileTab from "./_components/edit-profile";
import EditSecuritySettings from "./_components/edit-security-settings";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function EditProfile() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return (
    <Container>
      <Tabs defaultValue="account" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <EditProfileTab userName={session?.user.name ?? ""} />
        </TabsContent>
        <TabsContent value="password">
          <EditSecuritySettings />
        </TabsContent>
      </Tabs>
    </Container>
  );
}
