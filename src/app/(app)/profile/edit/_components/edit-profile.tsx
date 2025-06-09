"use client";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { saveProfileSettings } from "./actions";

function EditProfileTab({ userName }: { userName: string }) {
  const { getRootProps, getInputProps } = useDropzone();
  const [name, setName] = useState(userName);
  return (
    <form
      onClick={(e) => {
        e.preventDefault();
        saveProfileSettings(name)
      }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Opções de conta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-center">
            <Avatar
              {...getRootProps()}
              className="relative w-24 h-24 rounded-full overflow-hidden cursor-pointer group"
            >
              <input {...getInputProps()} />
              <AvatarImage
                src={
                  // user.image ??
                  "https://icons.veryicon.com/png/o/miscellaneous/rookie-official-icon-gallery/225-default-avatar.png"
                }
                alt="Avatar"
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-accent-foreground/70 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Pencil className="text-white" />
              </div>
            </Avatar>
          </div>
          <div className="space-y-1">
            <Label htmlFor="name">Nome</Label>
            <Input
              onChange={(e) => setName(e.target.value)}
              id="name"
              value={name}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit">Salvar alterações</Button>
        </CardFooter>
      </Card>
    </form>
  );
}

export default EditProfileTab;
