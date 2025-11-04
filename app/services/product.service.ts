import AxiosService from './axios.service'
import type { PaginationInterface } from '~/services/index.interface'
import type { CategoryInterface } from '~/services/category.service'

export interface ProductInterface {
  _id?: string
  name?: string
  category?: string
  description?: string
  image?: string
  images?: string[]
  price?: number
  discount?: number
  sizes?: string[]
  colors?: string[]
  tags?: string[]
  isActive?: boolean
  isFeatured?: boolean
  isNew?: boolean
  isTrending?: boolean
  categoryDetails?: CategoryInterface | null
}

interface ProductListResponse {
  data: ProductInterface[] | null
  message: string
  success: boolean
  pagination: PaginationInterface
}

interface ProductItemResponse {
  data?: ProductInterface | null
  message: string
  success: boolean
}

interface ProductServiceResponse<T> {
  data?: T
  error?: any
}

class ProductService {
  /**
   * Get Categories
   */
  async fetchProducts({
    page,
    limit,
    query,
  }: {
    page: number
    limit: number
    query?: string
  }): Promise<ProductServiceResponse<ProductListResponse>> {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) })
    if (query) params.append('query', query)
    const url = `/product?${params.toString()}`
    return await AxiosService.get<ProductListResponse>(url)
  }

  /**
   * Get single product by id
   */
  async getProduct(id: string): Promise<ProductServiceResponse<ProductItemResponse>> {
    return await AxiosService.get<ProductItemResponse>(`/product/${id}`)
  }

  /**
   * Add Categories
   */
  async addProduct(
    product: ProductInterface
  ): Promise<ProductServiceResponse<ProductItemResponse>> {
    return await AxiosService.post('/product', product)
  }

  /**
   * Update Categories
   */
  async updateProduct(
    id: string,
    payload: ProductInterface
  ): Promise<ProductServiceResponse<ProductItemResponse>> {
    return await AxiosService.put(`/product/${id}`, payload)
  }

  /**
   * Delete Categories
   */
  async deleteProduct(id: string): Promise<ProductServiceResponse<ProductItemResponse>> {
    return await AxiosService.delete<ProductItemResponse>(`/product/${id}`)
  }
}

export default new ProductService()
