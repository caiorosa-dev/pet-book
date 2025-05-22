import { Container } from "@/components/layout/container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EditSecuritySettings from "./_components/editSecuritySettings";
import EditProfileTab from "./_components/editProfile";

export default function EditProfile() {
  return (
    <Container>
      <Tabs defaultValue="account" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <EditProfileTab />
        </TabsContent>
        <TabsContent value="password">
          <EditSecuritySettings />
        </TabsContent>
      </Tabs>
    </Container>
  );
}
