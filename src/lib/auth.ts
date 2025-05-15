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
    modelName: 'users',
    fields: {
      name: 'full_name',
      emailVerified: 'email_verified',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
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
            displayUsername: 'full_name',
            username: 'username',
          },
        },
      },
    }),
  ],
})
