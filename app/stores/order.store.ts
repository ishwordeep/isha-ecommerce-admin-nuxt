import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  type PaginationInterface,
  type QueryInterface,
  type StatusCountInterface,
} from '~/services/index.interface'
import type { OrderInterface } from '~/services/order.service'
import OrderService from '~/services/order.service'

export const useOrderStore = defineStore('order', () => {
  const isLoading = ref(false)
  const selectedOrder = ref<OrderInterface | null>(null)
  const orders = ref<OrderInterface[] | null>(null)
  const pagination = ref<PaginationInterface | null>(null)
  const statusCount = ref<StatusCountInterface | null>(null)

  const fetchOrders = async ({
    page = 1,
    limit = 10,
    search = '',
    status = '',
  }: QueryInterface) => {
    isLoading.value = true
    try {
      console.log({ search })
      const response = await OrderService.fetchOrders({ page, limit, search, status })
      if (response.data?.success) {
        orders.value = response.data?.data as OrderInterface[]
        pagination.value = response.data?.pagination as PaginationInterface
        console.log('statusCounts:', response.data?.statusCounts)
        statusCount.value = response.data?.statusCounts as StatusCountInterface
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      isLoading.value = false
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: string, currentTab: string) => {
    isLoading.value = true
    try {
      const response = await OrderService.updateOrderStatus(orderId, newStatus)

      if (response.data?.success) {
        const index = orders.value?.findIndex((order) => order._id === orderId)

        if (index !== -1 && index !== undefined && orders.value) {
          if (currentTab === 'all' || currentTab === newStatus) {
            orders.value[index] = { ...orders.value[index], status: newStatus } as OrderInterface
          } else {
            orders.value.splice(index, 1)
          }
        }

        if (selectedOrder.value?._id === orderId) {
          selectedOrder.value.status = newStatus
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
    statusCount,
  }
})
