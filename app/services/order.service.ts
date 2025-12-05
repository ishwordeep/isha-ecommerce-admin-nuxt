import AxiosService from './axios.service'
import type { PaginationInterface, QueryInterface } from './index.interface'

export enum OrderStatus {
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  PAID = 'PAID',
  SHIPPED = 'SHIPPED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface OrderInterface {
  _id: string
  userId: string
  name?: string
  email?: string
  phone?: string
  orderNumber: string
  items: Item[]
  subtotal: number
  discountTotal: number
  shippingFee: number
  grandTotal: number
  shippingAddress: ShippingAddress
  status: string
  paymentMethod: string
  paymentStatus: string
  notes: string
  isDeleted: boolean
  createdAt: string
  updatedAt: string
  __v: number
  id: string
}

export interface ShippingAddress {
  street: string
  apartment: string
  city: string
  state: string
  zipCode: string
  country: string
  isDefault: boolean
}

export interface Item {
  productId: string
  name: string
  price: number
  quantity: number
  size: string
  color: string
  image: string
}

interface OrderListResponse {
  data: OrderInterface[] | null
  message: string
  success: boolean
  pagination: PaginationInterface
}

interface OrderServiceResponse<T> {
  data?: T
  error?: any
}

class OrderService {
  async fetchOrders({
    page,
    limit,
    search,
  }: QueryInterface): Promise<OrderServiceResponse<OrderListResponse>> {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) })
    if (search) params.append('search', search)
    // const url = `/order/admin?${params.toString()}`
    const url = `/order/admin`
    return await AxiosService.get<OrderListResponse>(url)
  }
}

export default new OrderService()
