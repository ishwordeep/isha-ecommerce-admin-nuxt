import { useAuthStore } from '~/stores/auth.store'
import AuthService from '~/services/auth.service'
import type { LoginCredentials, RegisterCredentials } from '~/stores/auth.store'

export const useAuth = () => {
  const authStore = useAuthStore()
  const router = useRouter()

  /**
   * Login user
   */
  const login = async (credentials: LoginCredentials) => {
    authStore.setLoading(true)

    const { data, error } = await AuthService.login(credentials)
    authStore.setLoading(false)

    if (data?.data) {
      const user = data.data.user ?? credentials
      authStore.setAuth(user, data.data.accessToken, data.data.xAccessToken)
      return { success: true, data }
    }

    return { success: false, error }
  }

  /**
   * Register user
   */
  const register = async (credentials: RegisterCredentials) => {
    authStore.setLoading(true)

    const { data, error } = await AuthService.register(credentials)

    authStore.setLoading(false)

    if (data) {
      authStore.setAuth(data.user, data.accessToken, data.xAccessToken)
      return { success: true, data }
    }

    return { success: false, error }
  }

  /**
   * Logout user
   */
  const logout = async () => {
    await AuthService.logout()
    authStore.clearAuth()
    navigateTo('/login')
  }

  /**
   * Fetch current user
   */
  const fetchCurrentUser = async () => {
    const { data, error } = await AuthService.getCurrentUser()

    if (data) {
      authStore.updateUser(data)
      return { success: true, data }
    }

    if (error) {
      authStore.clearAuth()
    }

    return { success: false, error }
  }

  return {
    // Store state
    user: computed(() => authStore.user),
    isAuthenticated: computed(() => authStore.isAuthenticated),
    isLoading: computed(() => authStore.isLoading),

    // Actions
    login,
    register,
    logout,
    fetchCurrentUser,
  }
}
