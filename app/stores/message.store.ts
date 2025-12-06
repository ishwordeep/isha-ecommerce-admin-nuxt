import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { PaginationInterface, QueryInterface } from '~/services/index.interface'
import type { MessageInterface } from '~/services/message.service'
import MessageService from '~/services/message.service'

export const useMessageStore = defineStore('message', () => {
  const isLoading = ref(false)
  const selectedMessage = ref<MessageInterface | null>(null)
  const messages = ref<MessageInterface[] | null>(null)
  const pagination = ref<PaginationInterface | null>(null)

  const fetchMessages = async ({
    page = 1,
    limit = 10,
    search = '',
    status = '',
  }: QueryInterface) => {
    isLoading.value = true
    try {
      const response = await MessageService.fetchMessages({ page, limit, search, status })
      if (response.data?.success) {
        messages.value = response.data?.data as MessageInterface[]
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      isLoading.value = false
    }
  }

  const deleteMessage = async (id: string) => {
    isLoading.value = true
    try {
      const res = await MessageService.deleteMessage(id)
      if (res?.data?.success) {
        messages.value = messages.value?.filter((p) => p._id !== id) || null
        if (selectedMessage.value?._id === id) selectedMessage.value = null
      }
      return res
    } finally {
      isLoading.value = false
    }
  }

  const updateMessageStatus = async (
    id: string,
    { status, adminNotes }: { status: string; adminNotes?: string }
  ) => {
    isLoading.value = true
    try {
      const res = await MessageService.updateMessageStatus(id, { status, adminNotes })
      if (res?.data?.success && res.data?.data) {
        const updatedMessage = res.data.data
        messages.value =
          messages.value?.map((m) => (m._id === id ? { ...m, ...updatedMessage } : m)) || null
        if (selectedMessage.value?._id === id) {
          selectedMessage.value = { ...selectedMessage.value, ...updatedMessage }
        }
      }
      return res
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    selectedMessage,
    messages,
    fetchMessages,
    pagination,
    deleteMessage,
    updateMessageStatus,
  }
})
