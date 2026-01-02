<!-- pages/admin/orders/index.vue -->
<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

import type { OrderInterface, OrderStatus } from '~/services/order.service'
import OrderDetail from './OrderDetail.vue'
import OrderStatusBadge from './OrderStatusBadge.vue'

const orderStore = useOrderStore()
const { formatDate } = useFormatDate()
// Filters & Search
const searchTerm = ref('')
const selectedStatus = ref<'all' | string>('all')
const isFetching = ref(false)

// Pagination
const pagination = reactive({
  page: 1,
  limit: 20,
  pages: computed(() => orderStore.pagination?.pages || 0),
  total: computed(() => orderStore.pagination?.total || 0),
})

const getSelectedStatus = computed(() => {
  return selectedStatus.value === 'pending'
    ? 'PENDING_PAYMENT'
    : selectedStatus.value === 'paid'
      ? 'PAID'
      : selectedStatus.value === 'shipped'
        ? 'SHIPPED'
        : selectedStatus.value === 'completed'
          ? 'COMPLETED'
          : selectedStatus.value === 'cancelled'
            ? 'CANCELLED'
            : ''
})

const { from, to, hasItems, total } = usePaginationInfo(pagination)

// Fetch orders
const fetchOrders = async () => {
  isFetching.value = true

  await orderStore.fetchOrders({
    page: pagination.page,
    limit: pagination.limit,
    search: searchTerm.value,
    status: getSelectedStatus.value,
  })
  isFetching.value = false
}

watch([() => pagination.page, () => pagination.limit, searchTerm, selectedStatus], fetchOrders, {
  immediate: true,
})

watch(selectedStatus, (newStatus, oldStatus) => {
  if (newStatus !== oldStatus) {
    pagination.page = 1
  }
})

onMounted(fetchOrders)
const handleSearch = (value: string) => {
  searchTerm.value = value
}

const statusOptions = computed(() => [
  {
    value: 'all',
    label: 'All Orders',
    icon: 'i-lucide-package',
    count: orderStore.statusCount?.ALL || 0,
  },
  {
    value: 'pending',
    label: 'Pending',
    icon: 'i-lucide-clock',
    count: orderStore.statusCount?.PENDING_PAYMENT || 0,
  },
  {
    value: 'paid',
    label: 'Paid',
    icon: 'i-lucide-credit-card',
    count: orderStore.statusCount?.PAID || 0,
  },
  {
    value: 'shipped',
    label: 'Shipped',
    icon: 'i-lucide-truck',
    count: orderStore.statusCount?.SHIPPED || 0,
  },
  {
    value: 'completed',
    label: 'Completed',
    icon: 'i-lucide-check-circle',
    count: orderStore.statusCount?.COMPLETED || 0,
  },
  {
    value: 'cancelled',
    label: 'Cancelled',
    icon: 'i-lucide-x-circle',
    count: orderStore.statusCount?.CANCELLED || 0,
  },
])

const viewOrder = (order: OrderInterface) => {
  orderStore.selectedOrder = order
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
            label: `${s.label} (${s.count})`,
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
        :loading="isFetching"
        sticky
        :columns="[
          { accessorKey: 'orderNumber', header: 'Order ID' },
          { accessorKey: 'name', header: 'Customer' },
          { accessorKey: 'items', header: 'Items' },
          { accessorKey: 'total', header: 'Total' },
          { accessorKey: 'status', header: 'Status' },
          { accessorKey: 'createdAt', header: 'Date' },
          {
            accessorKey: 'actions',
            header: 'Actions',
            meta: {
              class: {
                th: 'text-right',
              },
            },
          },
        ]"
        :ui="{
          th: 'bg-gray-100 font-semibold text-black',
        }"
        class="scrollbar-thin max-h-[65dvh]"
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
          <div class="flex w-full justify-end gap-2">
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
        <div class="flex flex-wrap items-center justify-between gap-3">
          <p v-if="hasItems" class="flex-1 text-sm whitespace-nowrap text-gray-600">
            Showing
            <span class="font-medium">{{ from }}</span>
            to
            <span class="font-medium">{{ to }}</span>
            of
            <span class="font-medium">{{ total }}</span>
            orders
          </p>
          <UPagination
            v-model:page="pagination.page"
            :page-count="pagination.pages"
            :total="pagination.total"
            :items-per-page="pagination.limit"
            :ui="{
              root: 'flex-1',
              list: 'justify-end',
            }"
          />
        </div>
      </template>
    </UCard>

    <!-- Order Detail Modal -->
    <OrderDetail :selectedTab="selectedStatus" />
  </div>
</template>
