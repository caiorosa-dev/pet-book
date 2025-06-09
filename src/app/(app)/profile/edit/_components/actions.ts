"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export const saveProfileSettings = async (newName: string) => {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (session == null) {
        throw "Sessão invalida"
    }

    await prisma.user.update({
        data: {
            fullName: newName
        },
        where: {
            id: session.user.id
        }
    })

}
