import type { PaginationInterface, QueryInterface } from '~/services/index.interface'
import type { SliderForm } from '~/stores/slider.store'
import AxiosService from './axios.service'

export interface SliderInterface {
  _id: string
  slug?: string
  isActive?: boolean
  image?: string
  displayOrder?: number
  createdAt?: string
  updatedAt?: string
  isButtonEnabled?: boolean
  button?: {
    link: string
    title: string
    textColor: string
    bgColor: string
  }
  __v?: number
}

interface SliderListResponse {
  data: SliderInterface[] | null
  message: string
  success: boolean
  pagination: PaginationInterface | null
}

interface SliderItemResponse {
  data?: SliderInterface | null
  message: string
  success: boolean
}

interface SliderServiceResponse<T> {
  data?: T
  error?: any
}

class SliderService {
  /**
   * Get Sliders
   */
  async fetchSliders({
    page,
    limit,
    search,
  }: QueryInterface): Promise<SliderServiceResponse<SliderListResponse>> {
    let url = `/slider?page=${page}&limit=${limit}`
    if (search) url += `&search=${search}`
    return await AxiosService.get<SliderListResponse>(url)
  }

  /**
   * Get single slider by id
   */
  async getSlider(id: string): Promise<SliderServiceResponse<SliderItemResponse>> {
    return await AxiosService.get<SliderItemResponse>(`/slider/${id}`)
  }

  /**
   * Add Sliders
   */
  async addSlider(payload: SliderForm): Promise<SliderServiceResponse<SliderItemResponse>> {
    const { isButtonEnabled, button, ...rest } = payload
    const formattedPayload = {
      ...rest,
      isButtonEnabled,
      ...(isButtonEnabled && { button }),
    }

    return await AxiosService.post('/slider', formattedPayload)
  }

  /**
   * Update Sliders
   */
  async updateSlider(
    id: string,
    payload: SliderForm
  ): Promise<SliderServiceResponse<SliderItemResponse>> {
    return await AxiosService.put(`/slider/${id}`, payload)
  }

  /**
   * Delete Sliders
   */
  async deleteSlider(id: string): Promise<SliderServiceResponse<SliderItemResponse>> {
    return await AxiosService.delete<SliderItemResponse>(`/slider/${id}`)
  }
}

export default new SliderService()
