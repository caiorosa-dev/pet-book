import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Session } from "better-auth";

function EditSecuritySettings({ session, user }: { session: Session, user : User }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Troca de senha</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="space-y-1">
          <Label htmlFor="current">Senha atual</Label>
          <Input id="current" type="password" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="new">Nova senha</Label>
          <Input id="new" type="password" />
        </div>
      </CardContent>
      <CardFooter>
        <Button>Trocar senha</Button>
      </CardFooter>
    </Card>
  );
}

export default EditSecuritySettings;
