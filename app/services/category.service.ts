import AxiosService from './axios.service'

export interface CategoryInterface {
  _id: string
  name?: string
  slug?: string
  description?: string
  isActive?: boolean
  image?: string
  displayOrder?: number
  createdAt?: string
  updatedAt?: string
  __v: number
}

interface CategoryListResponse {
  data: CategoryInterface[] | null
  message: string
  success: boolean
}

interface CategoryItemResponse {
  data?: CategoryInterface | null
  message: string
  success: boolean
}

interface CategoryServiceResponse<T> {
  data?: T
  error?: any
}

class CategoryService {
  /**
   * Get Categories
   */
  async fetchCategories(): Promise<CategoryServiceResponse<CategoryListResponse>> {
    return await AxiosService.get<CategoryListResponse>('/category')
  }

  /**
   * Add Categories
   */
  async addCategory(
    category: CategoryInterface
  ): Promise<CategoryServiceResponse<CategoryItemResponse>> {
    return await AxiosService.post('/category', category)
  }

  /**
   * Update Categories
   */
  async updateCategory(
    id: string,
    payload: CategoryInterface
  ): Promise<CategoryServiceResponse<CategoryItemResponse>> {
    return await AxiosService.patch(`/category/${id}`, payload)
  }

  /**
   * Delete Categories
   */
  async deleteCategory(id: string): Promise<CategoryServiceResponse<CategoryItemResponse>> {
    return await AxiosService.delete<CategoryItemResponse>(`/category/${id}`)
  }
}

export default new CategoryService()
