import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface RegisterStore {
  name: string
  username: string
  phone: string
  email: string
  password: string
  setStep1Data: (data: {
    name: string
    username: string
    phone: string
  }) => void
  setStep2Data: (data: { email: string; password: string }) => void
  clearStore: () => void
}

export const useRegisterStore = create<RegisterStore>()(
  persist(
    (set) => ({
      name: '',
      username: '',
      phone: '',
      email: '',
      password: '',
      setStep1Data: (data) =>
        set({
          name: data.name,
          username: data.username,
          phone: data.phone,
        }),
      setStep2Data: (data) =>
        set({
          email: data.email,
          password: data.password,
        }),
      clearStore: () =>
        set({
          name: '',
          username: '',
          phone: '',
          email: '',
          password: '',
        }),
    }),
    {
      name: 'register-store',
    },
  ),
)
