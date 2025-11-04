import AxiosService from './axios.service'
import type { PaginationInterface } from '~/services/index.interface'

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
  __v?: number
}

interface CategoryListResponse {
  data: CategoryInterface[] | null
  message: string
  success: boolean
  pagination: PaginationInterface | null
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
   * Get Categories List Only
   */

  async fetchCategoryList(): Promise<CategoryServiceResponse<CategoryListResponse>> {
    return await AxiosService.get<CategoryListResponse>('/category/listOnly')
  }

  /**
   * Get Categories
   */
  async fetchCategories({
    page,
    limit,
    query,
  }: {
    page: number
    limit: number
    query: string
  }): Promise<CategoryServiceResponse<CategoryListResponse>> {
    let url = `/category?page=${page}&limit=${limit}`
    if (query) url += `&query=${query}`
    return await AxiosService.get<CategoryListResponse>(url)
  }

  /**
   * Get single category by id
   */
  async getCategory(id: string): Promise<CategoryServiceResponse<CategoryItemResponse>> {
    return await AxiosService.get<CategoryItemResponse>(`/category/${id}`)
  }

  /**
   * Add Categories
   */
  async addCategory(payload: CategoryForm): Promise<CategoryServiceResponse<CategoryItemResponse>> {
    return await AxiosService.post('/category', payload)
  }

  /**
   * Update Categories
   */
  async updateCategory(
    id: string,
    payload: CategoryForm
  ): Promise<CategoryServiceResponse<CategoryItemResponse>> {
    return await AxiosService.put(`/category/${id}`, payload)
  }

  /**
   * Delete Categories
   */
  async deleteCategory(id: string): Promise<CategoryServiceResponse<CategoryItemResponse>> {
    return await AxiosService.delete<CategoryItemResponse>(`/category/${id}`)
  }
}

export default new CategoryService()
