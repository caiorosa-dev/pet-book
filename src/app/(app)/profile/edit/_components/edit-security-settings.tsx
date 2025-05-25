"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";

function EditSecuritySettings() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  function changePassword() {
    authClient.changePassword({
      currentPassword: oldPassword,
      newPassword: newPassword,
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Troca de senha</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="space-y-1">
          <Label htmlFor="current">Senha atual</Label>
          <Input
            onChange={(e) => setOldPassword(e.target.value)}
            id="current"
            type="password"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="new">Nova senha</Label>
          <Input
            onChange={(e) => setNewPassword(e.target.value)}
            id="new"
            type="password"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={() => changePassword()}
        >
          Trocar senha
        </Button>
      </CardFooter>
    </Card>
  );
}

export default EditSecuritySettings;
