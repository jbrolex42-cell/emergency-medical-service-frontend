import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../services/api'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: true,

      setAuth: (user, token) => {
        set({ user, token, isLoading: false })

        if (token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        }
      },

      clearAuth: () => {
        set({ user: null, token: null, isLoading: false })
        delete api.defaults.headers.common['Authorization']
      },

      login: async (email, password) => {
        try {
          const response = await api.post('/auth/login', {
            email,
            password
          })

          const payload = response.data?.data || response.data

          if (!payload?.user || !payload?.token) {
            throw new Error('Invalid server response')
          }

          get().setAuth(payload.user, payload.token)

          return { success: true }
        } catch (error) {
          return {
            success: false,
            error:
              error.response?.data?.error ||
              error.message ||
              'Login failed'
          }
        }
      },

      register: async (userData) => {
        try {
          const response = await api.post('/auth/register', userData)

          console.log('REGISTER RESPONSE:', response.data)

          const payload = response.data?.data || response.data

          if (!payload?.user || !payload?.token) {
            throw new Error('Invalid server response from backend')
          }

          get().setAuth(payload.user, payload.token)

          return { success: true }
        } catch (error) {
          console.log(error)

          return {
            success: false,
            error:
              error.response?.data?.error ||
              error.message ||
              'Registration failed'
          }
        }
      },

      logout: () => {
        get().clearAuth()
      },

      updateProfile: async (updates) => {
        try {
          const response = await api.put('/auth/profile', updates)

          const payload = response.data?.data || response.data

          set({ user: payload.user || payload })

          return { success: true }
        } catch (error) {
          return {
            success: false,
            error:
              error.response?.data?.error ||
              'Update failed'
          }
        }
      },

      fetchProfile: async () => {
        try {
          const response = await api.get('/auth/me')

          const payload = response.data?.data || response.data

          set({
            user: payload.user || payload,
            isLoading: false
          })
        } catch (error) {
          get().clearAuth()
        }
      },

      init: () => {
        const token = get().token

        if (token) {
          api.defaults.headers.common['Authorization'] =
            `Bearer ${token}`

          get().fetchProfile()
        } else {
          set({ isLoading: false })
        }
      }
    }),
    {
      name: 'ems-auth-storage',
      partialize: state => ({
        token: state.token
      })
    }
  )
)