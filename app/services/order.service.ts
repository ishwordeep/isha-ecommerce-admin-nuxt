import AxiosService from './axios.service'
import type { PaginationInterface, QueryInterface, StatusCountInterface } from './index.interface'

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
  statusCounts: StatusCountInterface
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
    status,
  }: QueryInterface): Promise<OrderServiceResponse<OrderListResponse>> {
    let url = `/order/admin?page=${page}&limit=${limit}`
    if (search) url += `&search=${search}`
    // const url = `/order/admin?${params.toString()}`
    if (status) {
      url += `&status=${status}`
    }
    return await AxiosService.get<OrderListResponse>(url)
  }

  async updateOrderStatus(
    orderId: string,
    status: string
  ): Promise<OrderServiceResponse<{ success: boolean; message: string }>> {
    const url = `/order/${orderId}/status`
    return await AxiosService.patch<{ success: boolean; message: string }>(url, { status })
  }
}

export default new OrderService()
