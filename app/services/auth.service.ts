import AxiosService from './axios.service'
import type { LoginCredentials, RegisterCredentials, User } from '~/stores/auth.store'

interface LoginResponse {
  data: {
    user: User
    accessToken: string
    xAccessToken?: string
  }
}

interface RegisterResponse {
  user: User
  accessToken: string
  xAccessToken?: string
}

interface AuthServiceResponse<T> {
  data?: T
  error?: any
}

class AuthService {
  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<AuthServiceResponse<LoginResponse>> {
    return await AxiosService.post<LoginResponse, LoginCredentials>('/auth/login', credentials)
  }

  /**
   * Register new user
   */
  async register(credentials: RegisterCredentials): Promise<AuthServiceResponse<RegisterResponse>> {
    return await AxiosService.post<RegisterResponse, RegisterCredentials>(
      '/auth/register',
      credentials
    )
  }

  /**
   * Logout user
   */
  async logout(): Promise<AuthServiceResponse<void>> {
    return await AxiosService.post<void, {}>('/auth/logout', {})
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<AuthServiceResponse<User>> {
    return await AxiosService.get<User>('/auth/me')
  }

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<AuthServiceResponse<{ accessToken: string }>> {
    return await AxiosService.post<{ accessToken: string }, {}>('/auth/refresh', {})
  }

  /**
   * Forgot password
   */
  async forgotPassword(email: string): Promise<AuthServiceResponse<{ message: string }>> {
    return await AxiosService.post<{ message: string }, { email: string }>(
      '/auth/forgot-password',
      { email }
    )
  }

  /**
   * Reset password
   */
  async resetPassword(
    token: string,
    password: string
  ): Promise<AuthServiceResponse<{ message: string }>> {
    return await AxiosService.post<{ message: string }, { token: string; password: string }>(
      '/auth/reset-password',
      { token, password }
    )
  }

  /**
   * Change password
   */
  async changePassword(
    oldPassword: string,
    newPassword: string
  ): Promise<AuthServiceResponse<{ message: string }>> {
    return await AxiosService.post<
      { message: string },
      { oldPassword: string; newPassword: string }
    >('/auth/change-password', { oldPassword, newPassword })
  }
}

export default new AuthService()
