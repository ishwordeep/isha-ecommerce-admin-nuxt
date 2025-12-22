import type { CategoryInterface } from '~/services/category.service'
import type { PaginationInterface, QueryInterface } from '~/services/index.interface'
import AxiosService from './axios.service'

export type ProductFlag = 'new' | 'featured' | 'trending'

interface UpdateFlagPayload {
  ids: string[]
}

interface ProductFaqInterface {
  question: string
  answer: string
}

export interface ProductFaqResponse {
  data?: ProductFaqInterface[] | null
  message: string
  success: boolean
}

export interface ProductInterface {
  _id: string
  name?: string
  category?: string
  description?: string
  image?: string
  images?: string[]
  price?: number
  discount?: number
  sizes?: string[]
  colors?: string[]
  target_audience?: string[]
  tags?: string[]
  isActive?: boolean
  isFeatured?: boolean
  isNew?: boolean
  isTrending?: boolean
  categoryDetails?: CategoryInterface | null
  faqs?: ProductFaqInterface[] | null
  story?: string
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
    product: Partial<ProductForm>
  ): Promise<ProductServiceResponse<ProductItemResponse>> {
    return await AxiosService.post('/product', product)
  }

  /**
   * Update Categories
   */
  async updateProduct(
    id: string,
    payload: Partial<ProductForm>
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

  /**
   * Update product FAQs
   */

  async updateProductFaqs(
    id: string,
    payload: ProductFaqInterface[]
  ): Promise<ProductServiceResponse<ProductItemResponse>> {
    return await AxiosService.post(`/product/${id}/faqs`, { faqs: payload })
  }

  /**
   * Get product FAQs
   */
  async getProductFaqs(id: string): Promise<ProductServiceResponse<ProductFaqResponse>> {
    console.log({ id })
    return await AxiosService.get<ProductFaqResponse>(`/product/${id}/faqs`)
  }
}

export default new ProductService()
