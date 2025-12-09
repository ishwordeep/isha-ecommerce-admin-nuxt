import AxiosService from './axios.service'

export interface SettingInterface {
  _id: string
  name: string
  email: string
  phone: string
  description: string
  address: string
  city: string
  state: string
  country: string
  postalCode: string
  logoUrl: string
  faviconUrl: string
  facebook: string
  instagram: string
  tiktok: string
  createdAt: string
  updatedAt: string
  sizeGuides: string
  returnAndExchanges: string
  shippingInformations: string
  __v: number
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

  async updateSetting(
    id: string,
    payload: Partial<SettingInterface>
  ): Promise<SettingServiceResponse<SettingResponse>> {
    return await AxiosService.patch(`/setting/${id}`, payload)
  }
}

export default new SettingService()
