<!-- pages/admin/orders/index.vue -->
<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

import type { OrderInterface, OrderStatus } from '~/services/order.service'
import OrderDetail from './OrderDetail.vue'
import OrderStatusBadge from './OrderStatusBadge.vue'

const orderStore = useOrderStore()
const searchQuery = ref('')
const { formatDate } = useFormatDate()
// Filters & Search
const searchTerm = ref('')
const selectedStatus = ref<'all' | string>('all')

// Pagination
const pagination = reactive({
  page: 1,
  limit: 10,
  total: computed(() => orderStore.pagination?.total || 0),
})

// Fetch orders
const fetchOrders = async () => {
  await orderStore.fetchOrders({
    page: pagination.page,
    limit: pagination.limit,
    search: searchTerm.value,
  })
}

onMounted(fetchOrders)
const handleSearch = (value: string) => {
  searchQuery.value = value
}

// Status tabs with counts
const statusCounts = computed(() => {
  const all = orderStore.orders?.length || 0
  const map = { all, Pending: 0, Processing: 0, Shipped: 0, Delivered: 0, Cancelled: 0 }

  orderStore.orders?.forEach((o: OrderInterface) => {
    if (map[o.status as keyof typeof map] !== undefined) {
      map[o.status as keyof typeof map]++
    }
  })

  return map
})

const statusOptions = [
  { value: 'all', label: 'All Orders', icon: 'i-lucide-package' },
  { value: 'Pending', label: 'Pending', icon: 'i-lucide-clock' },
  { value: 'Processing', label: 'Processing', icon: 'i-lucide-package' },
  { value: 'Shipped', label: 'Shipped', icon: 'i-lucide-truck' },
  { value: 'Delivered', label: 'Delivered', icon: 'i-lucide-check-circle' },
  { value: 'Cancelled', label: 'Cancelled', icon: 'i-lucide-x-circle' },
]

const viewOrder = (order: OrderInterface) => {
  orderStore.selectedOrder = order
  console.log(orderStore.selectedOrder)
}
</script>

<template>
  <div>
    <!-- Search + Actions -->
    <UCard class="mb-6">
      <div class="flex flex-col gap-4 lg:flex-row">
        <UiSearchInput
          :delay="500"
          :loading="true"
          @search="handleSearch"
          class="!w-full !max-w-full flex-1"
        />
        <div class="flex gap-3">
          <UButton color="neutral" variant="outline" size="lg">
            <UIcon name="i-lucide-download" class="h-5 w-5" />
            Export
          </UButton>
        </div>
      </div>
    </UCard>

    <!-- Status Tabs -->
    <UCard class="mb-6">
      <UTabs
        :items="
          statusOptions.map((s) => ({
            ...s,
            label: `${s.label} (${statusCounts[s.value as keyof typeof statusCounts]})`,
          }))
        "
        v-model="selectedStatus"
        class="w-full"
      />
    </UCard>

    <!-- Orders Table -->
    <UCard
      :ui="{
        body: '!p-0',
      }"
    >
      <UTable
        :data="orderStore.orders || []"
        :loading="orderStore.isLoading"
        :columns="[
          { accessorKey: 'orderNumber', header: 'Order ID' },
          { accessorKey: 'name', header: 'Customer' },
          { accessorKey: 'items', header: 'Items' },
          { accessorKey: 'total', header: 'Total' },
          { accessorKey: 'status', header: 'Status' },
          { accessorKey: 'createdAt', header: 'Date' },
          { accessorKey: 'actions', header: 'Actions' },
        ]"
        :ui="{
          th: 'bg-gray-100 font-semibold text-black',
        }"
      >
        <!-- Customer Cell -->
        <template #name-cell="{ row }">
          <div>
            <div class="font-medium">{{ row.original.name || '-' }}</div>
            <div class="text-sm text-gray-500" v-if="row.original.email">
              {{ row.original.email }}
            </div>
          </div>
        </template>

        <!-- Items Cell -->
        <template #items-cell="{ row }">
          <div class="flex -space-x-3">
            <div
              class="border-default aspect-square w-10 shrink-0 rounded-md border"
              v-for="(item, i) in row.original.items.slice(0, 3)"
              :key="i"
            >
              <NuxtImg
                v-if="item.image"
                :src="item.image"
                :alt="item.name"
                class="h-full w-full rounded-md object-cover"
              />
            </div>
            <div
              v-if="row.original.items.length > 3"
              class="border-default flex h-10 w-10 items-center justify-center rounded-md border-2 bg-gray-200 text-xs font-bold text-gray-600 ring-2 ring-white"
            >
              +{{ row.original.items.length - 3 }}
            </div>
          </div>
        </template>

        <!-- Total -->
        <template #total-cell="{ row }">
          <span class="font-bold">${{ Number(row.original.grandTotal).toFixed(2) }}</span>
        </template>

        <!-- Status -->
        <template #status-cell="{ row }">
          <OrderStatusBadge :status="row.original.status as OrderStatus" />
        </template>

        <!-- Date -->
        <template #createdAt-cell="{ row }">
          <span class="text-sm text-gray-800">
            {{ formatDate(row.original.createdAt) }}
          </span>
        </template>

        <!-- Actions -->
        <template #actions-cell="{ row }">
          <div class="flex justify-end gap-2">
            <UButton
              size="xs"
              color="info"
              variant="ghost"
              square
              @click="viewOrder(row.original)"
              title="View Details"
            >
              <UIcon name="i-lucide-eye" class="h-4 w-4" />
            </UButton>
            <UButton size="xs" color="success" variant="ghost" square title="Update Status">
              <UIcon name="i-lucide-refresh-cw" class="h-4 w-4" />
            </UButton>
            <UButton size="xs" color="primary" variant="ghost" square title="Print">
              <UIcon name="i-lucide-printer" class="h-4 w-4" />
            </UButton>
          </div>
        </template>
      </UTable>

      <!-- Pagination -->
      <template #footer>
        <div class="flex items-center justify-between">
          <p class="text-sm text-gray-600">
            Showing {{ orderStore.orders?.length || 0 }} of
            {{ pagination.total || orderStore.orders?.length || 0 }} orders
          </p>
          <UPagination
            v-model="pagination.page"
            :page-count="Math.ceil(pagination.total / pagination.limit)"
            :total="pagination.total"
          />
        </div>
      </template>
    </UCard>

    <!-- Order Detail Modal -->
    <OrderDetail />
  </div>
</template>
