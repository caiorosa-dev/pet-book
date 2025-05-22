import { Avatar, AvatarImage } from "@/components/ui/avatar";
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
import { Pencil } from "lucide-react";

function EditProfileTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-center">
          <Avatar className="w-24 h-24 relative">
            <AvatarImage
              src={"https://randomuser.me/api/portraits/men/69.jpg"}
            />
            <div className="opacity-0 hover:opacity-100 absolute flex justify-center items-center bg-accent-foreground/70 transition-all cursor-pointer w-full h-full">
              <Pencil />
            </div>
          </Avatar>
        </div>
        <div className="space-y-1">
          <Label htmlFor="name">Name</Label>
          <Input id="name" defaultValue="Pedro Duarte" />
        </div>
      </CardContent>
      <CardFooter>
        <Button>Save changes</Button>
      </CardFooter>
    </Card>
  );
}

export default EditProfileTab;
