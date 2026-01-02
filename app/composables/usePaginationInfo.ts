// composables/usePaginationInfo.ts
import { computed, type ComputedRef } from 'vue'

export interface Pagination {
  page: number
  limit: number
  total: number
}

export function usePaginationInfo(pagination: Pagination | ComputedRef<Pagination>) {
  // Ensure we always work with the actual values (handles ref or plain object)
  const page = computed(() => (pagination as any).page ?? 1)
  const limit = computed(() => (pagination as any).limit ?? 10)
  const total = computed(() => (pagination as any).total ?? 0)

  const from = computed(() => {
    if (total.value === 0) return 0
    return (page.value - 1) * limit.value + 1
  })

  const to = computed(() => {
    if (total.value === 0) return 0
    const end = page.value * limit.value
    return end > total.value ? total.value : end
  })

  const pageCount = computed(() => {
    if (limit.value === 0 || total.value === 0) return 1
    return Math.ceil(total.value / limit.value)
  })

  const hasItems = computed(() => total.value > 0)

  return {
    from,
    to,
    pageCount,
    total,
    hasItems,
  }
}
