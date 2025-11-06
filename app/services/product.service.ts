import AxiosService from './axios.service'
import type { PaginationInterface, QueryInterface } from '~/services/index.interface'
import type { CategoryInterface } from '~/services/category.service'

export type ProductFlag = 'new' | 'featured' | 'trending'

interface UpdateFlagPayload {
  ids: string[]
}

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
    search,
    category,
  }: QueryInterface): Promise<ProductServiceResponse<ProductListResponse>> {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) })
    if (search) params.append('search', search)
    if (category) params.append('category', category)
    const url = `/product?${params.toString()}`
    return await AxiosService.get<ProductListResponse>(url)
  }

  /**
   * Get single product by id
   */
  async getProduct(id: string): Promise<ProductServiceResponse<ProductItemResponse>> {
    return await AxiosService.get<ProductItemResponse>(`/product/${id}`)
  }

  async getProductsByCategory(
    categoryId: string,
    search: string
  ): Promise<ProductServiceResponse<ProductListResponse>> {
    let url = `/product/category/${categoryId}`
    if (search) url += `?search=${search}`
    return await AxiosService.get<ProductListResponse>(url)
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

  /**
   * Save products under a specific flag (new, featured, trending)
   */
  async saveProductsByFlag(
    flag: ProductFlag,
    { ids }: UpdateFlagPayload
  ): Promise<ProductServiceResponse<ProductListResponse>> {
    return await AxiosService.patch<ProductListResponse>(`/product/update/${flag}`, { ids })
  }

  /**
   * Get products by flag
   */
  async getProductsByFlag(flag: ProductFlag): Promise<ProductServiceResponse<ProductListResponse>> {
    return await AxiosService.get<ProductListResponse>(`/product/flag/${flag}`)
  }
}

export default new ProductService()
