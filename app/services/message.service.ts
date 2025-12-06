import AxiosService from './axios.service'
import type { PaginationInterface, QueryInterface } from './index.interface'

export interface MessageInterface {
  _id: string
  name: string
  email: string
  phone: string
  subject: string
  message: string
  status: string
  createdAt: string
  updatedAt: string
  adminNotes?: string
  __v: number
}

interface MessageListResponse {
  data: MessageInterface[] | null
  message: string
  success: boolean
  pagination: PaginationInterface
}

interface MessageServiceResponse<T> {
  data?: T
  error?: any
}

interface MessageItemResponse {
  data: MessageInterface
  message: string
  success: boolean
}

class MessageService {
  async fetchMessages({
    page,
    limit,
    search,
    status,
  }: QueryInterface): Promise<MessageServiceResponse<MessageListResponse>> {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    })
    if (status) params.append('status', status)
    if (search) params.append('search', search)
    const url = `/admin/contact-messages?${params.toString()}`

    return await AxiosService.get<MessageListResponse>(url)
  }

  async deleteMessage(id: string): Promise<MessageServiceResponse<MessageItemResponse>> {
    return await AxiosService.delete<MessageItemResponse>(`/admin/contact-messages/${id}`)
  }

  async updateMessageStatus(
    id: string,
    payload: { status: string; adminNotes?: string }
  ): Promise<MessageServiceResponse<MessageItemResponse>> {
    return await AxiosService.patch<MessageItemResponse>(`/admin/contact-messages/${id}`, payload)
  }
}

export default new MessageService()
