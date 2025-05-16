import {
  inferAdditionalFields,
  usernameClient,
} from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'

import { auth } from './auth'

export const authClient = createAuthClient({
  baseURL: 'http://localhost:3000',

  usernameClient,
  plugins: [usernameClient(), inferAdditionalFields<typeof auth>()],
})
