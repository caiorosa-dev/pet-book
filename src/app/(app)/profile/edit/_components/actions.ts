"use server";

import { authClient } from "@/lib/auth-client";
import { prisma } from "@/lib/prisma";

export const saveProfileSettings = async (id: string, newName: string) => {
    await prisma.user.update({
        data: {
            fullName: newName
        },
        where: {
            id: id
        }
    })
}
