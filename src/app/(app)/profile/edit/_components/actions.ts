"use server";

import { authClient } from "@/lib/auth-client";
import { prisma } from "@/lib/prisma";

export const saveProfileSettings = async (newName: string, sessionID: string, sessionToken: string) => {
    const session = await prisma.session.findFirst({
        where: {
            token: sessionToken,
            id: sessionID
        }
    })

    if (session == null) {
        throw "Sessão invalida"
    }

    await prisma.user.update({
        data: {
            fullName: newName
        },
        where: {
            id: session.userId
        }
    })
}
