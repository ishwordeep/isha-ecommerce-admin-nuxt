import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { PaginationInterface, QueryInterface } from '~/services/index.interface'
import type { OrderInterface } from '~/services/order.service'
import OrderService from '~/services/order.service'

export const useOrderStore = defineStore('order', () => {
  const isLoading = ref(false)
  const selectedOrder = ref<OrderInterface | null>(null)
  const orders = ref<OrderInterface[] | null>(null)
  const pagination = ref<PaginationInterface | null>(null)

  const fetchOrders = async ({
    page = 1,
    limit = 10,
    search = '',
    status = '',
  }: QueryInterface) => {
    isLoading.value = true
    try {
      const response = await OrderService.fetchOrders({ page, limit, search, status })
      if (response.data?.success) {
        orders.value = response.data?.data as OrderInterface[]
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    selectedOrder,
    orders,
    fetchOrders,
    pagination,
  }
})
