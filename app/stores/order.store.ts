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
        pagination.value = response.data?.pagination as PaginationInterface
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      isLoading.value = false
    }
  }

  const updateOrderStatus = async (orderId: string, status: string) => {
    isLoading.value = true
    try {
      const response = await OrderService.updateOrderStatus(orderId, status)
      if (response.data?.success) {
        // Update the selected order status locally
        if (selectedOrder.value && selectedOrder.value._id === orderId) {
          selectedOrder.value.status = status
          if (status !== 'all')
            orders.value = orders.value?.filter((order) => order._id !== orderId) || null
        }
        return response
      }
    } catch (error) {
      console.error('Error updating order status:', error)
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
    updateOrderStatus,
  }
})
