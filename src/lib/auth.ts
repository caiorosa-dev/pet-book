import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { username } from 'better-auth/plugins'

import { prisma } from './prisma'

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),

  emailAndPassword: {
    enabled: true,
  },

  user: {
    fields: {
      name: 'fullName',
      emailVerified: 'emailVerified',
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },

    additionalFields: {
      phone: { type: 'string', required: true },
    },
  },

  plugins: [
    username({
      schema: {
        user: {
          fields: {
            displayUsername: 'fullName',
            username: 'userName',
          },
        },
      },
    }),
  ],
})
