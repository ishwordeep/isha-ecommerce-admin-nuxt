import AxiosService from './axios.service'
import type { LoginCredentials, RegisterCredentials, User } from '~/stores/auth.store'

export interface SettingInterface {
  name?: string
  email?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  country?: string
  postalCode?: string
  logoUrl?: string
  faviconUrl?: string
  facebook?: string
  instagram?: string
  tiktok?: string
}

interface SettingResponse {
  data: SettingInterface | null
  message: string
  success: boolean
}

interface SettingServiceResponse<T> {
  data?: T
  error?: any
}

class SettingService {
  /**
   * Get Settings
   */
  async fetchSetting(): Promise<SettingServiceResponse<SettingResponse>> {
    return await AxiosService.get<SettingResponse>('/setting')
  }

  async updateSetting(payload: SettingInterface): Promise<SettingServiceResponse<SettingResponse>> {
    return await AxiosService.patch('/setting', payload)
  }
}

export default new SettingService()
