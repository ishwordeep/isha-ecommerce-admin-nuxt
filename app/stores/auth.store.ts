// ============================================
// FILE: stores/auth.ts
// ============================================
import { defineStore } from 'pinia'

export interface User {
  id: number
  email: string
  name: string
  role?: string
  [key: string]: any
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials extends LoginCredentials {
  name: string
}

export interface AuthState {
  user: User | null
  accessToken: string | null
  xAccessToken: string | null
  isAuthenticated: boolean
  loading: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => {
    // Initialize from localStorage immediately if on client
    let initialState: AuthState = {
      user: null,
      accessToken: null,
      xAccessToken: null,
      isAuthenticated: false,
      loading: false,
    }

    if (typeof window !== 'undefined') {
      const accessToken = localStorage.getItem('accessToken')
      const user = localStorage.getItem('user')

      if (accessToken && user) {
        initialState = {
          ...initialState,
          accessToken,
          xAccessToken: localStorage.getItem('xAccessToken'),
          user: JSON.parse(user),
          isAuthenticated: true,
        }
      }
    }

    return initialState
  },

  getters: {
    getUser: (state): User | null => state.user,
    isLoggedIn: (state): boolean => state.isAuthenticated,
    isLoading: (state): boolean => state.loading,
  },

  actions: {
    /**
     * Initialize auth state from localStorage
     */
    initAuth() {
      if (typeof window !== 'undefined') {
        const accessToken = localStorage.getItem('accessToken')
        const xAccessToken = localStorage.getItem('xAccessToken')
        const user = localStorage.getItem('user')

        if (accessToken && user) {
          this.accessToken = accessToken
          this.xAccessToken = xAccessToken
          this.user = JSON.parse(user)
          this.isAuthenticated = true
        }
      }
    },

    /**
     * Set user and tokens after successful login
     */
    setAuth(user: User, accessToken: string, xAccessToken?: string) {
      this.user = user
      this.accessToken = accessToken
      this.xAccessToken = xAccessToken || null
      this.isAuthenticated = true

      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', accessToken)
        if (xAccessToken) {
          localStorage.setItem('xAccessToken', xAccessToken)
        }
        localStorage.setItem('user', JSON.stringify(user))
      }
    },

    /**
     * Clear auth state and logout
     */
    clearAuth() {
      this.user = null
      this.accessToken = null
      this.xAccessToken = null
      this.isAuthenticated = false

      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('xAccessToken')
        localStorage.removeItem('user')
      }
      navigateTo('/login')
    },

    /**
     * Set loading state
     */
    setLoading(loading: boolean) {
      this.loading = loading
    },

    /**
     * Update user information
     */
    updateUser(userData: Partial<User>) {
      if (this.user) {
        this.user = { ...this.user, ...userData }

        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(this.user))
        }
      }
    },
  },
})
