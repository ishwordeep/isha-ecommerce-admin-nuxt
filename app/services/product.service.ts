import AxiosService from './axios.service'

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
}

interface ProductListResponse {
  data: ProductInterface[] | null
  message: string
  success: boolean
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
  async fetchCategories(): Promise<ProductServiceResponse<ProductListResponse>> {
    return await AxiosService.get<ProductListResponse>('/product')
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
    return await AxiosService.patch(`/product/${id}`, payload)
  }

  /**
   * Delete Categories
   */
  async deleteProduct(id: string): Promise<ProductServiceResponse<ProductItemResponse>> {
    return await AxiosService.delete<ProductItemResponse>(`/product/${id}`)
  }
}

export default new ProductService()
