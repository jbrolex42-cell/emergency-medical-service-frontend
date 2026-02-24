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
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      },
      
      clearAuth: () => {
        set({ user: null, token: null, isLoading: false })
        delete api.defaults.headers.common['Authorization']
      },
      
      login: async (email, password) => {
        try {
          const { data } = await api.post('/auth/login', { email, password })
          get().setAuth(data.user, data.token)
          return { success: true }
        } catch (error) {
          return { 
            success: false, 
            error: error.response?.data?.error || 'Login failed' 
          }
        }
      },
      
      register: async (userData) => {
        try {
          const { data } = await api.post('/auth/register', userData)
          get().setAuth(data.user, data.token)
          return { success: true }
        } catch (error) {
          return { 
            success: false, 
            error: error.response?.data?.error || 'Registration failed' 
          }
        }
      },
      
      logout: () => {
        get().clearAuth()
      },
      
      updateProfile: async (updates) => {
        try {
          const { data } = await api.patch('/auth/profile', updates)
          set({ user: data.user })
          return { success: true }
        } catch (error) {
          return { 
            success: false, 
            error: error.response?.data?.error || 'Update failed' 
          }
        }
      },
      
      fetchProfile: async () => {
        try {
          const { data } = await api.get('/auth/profile')
          set({ user: data.user, isLoading: false })
        } catch (error) {
          get().clearAuth()
        }
      },
      
      init: () => {
        const token = get().token
        if (token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`
          get().fetchProfile()
        } else {
          set({ isLoading: false })
        }
      }
    }),
    {
      name: 'ems-auth-storage',
      partialize: (state) => ({ token: state.token })
    }
  )
)