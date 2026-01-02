<!-- pages/admin/orders/index.vue -->
<script setup lang="ts">
import type { MessageInterface } from '~/services/message.service'
import DeleteMessage from './DeleteMessage.vue'
import MessageDetail from './MessageDetail.vue'

definePageMeta({
  layout: 'admin',
})
// Contact Status Enum
const ContactStatus = {
  NEW: 'NEW',
  IN_PROGRESS: 'IN_PROGRESS',
  RESOLVED: 'RESOLVED',
}

const messageStore = useMessageStore()
const searchQuery = ref('')
const { formatDate } = useFormatDate()
// Filters & Search
const searchTerm = ref('')
const selectedStatus = ref<'all' | string>('all')
const isFetching = ref(false)

// Pagination
const pagination = reactive({
  page: 1,
  limit: 10,
  total: computed(() => messageStore.pagination?.total || 0),
  pages: computed(() => messageStore.pagination?.pages || 0),
})

const { from, to, hasItems, total } = usePaginationInfo(pagination)

console.log({ from, to, hasItems, total })

const getSelectedStatus = computed(() => {
  return selectedStatus.value === 'NEW'
    ? 'NEW'
    : selectedStatus.value === 'IN_PROGRESS'
      ? 'IN_PROGRESS'
      : selectedStatus.value === 'RESOLVED'
        ? 'RESOLVED'
        : ''
})

// Fetch orders
const fetchOrders = async () => {
  isFetching.value = true

  await messageStore.fetchMessages({
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

onMounted(fetchOrders)
const handleSearch = (value: string) => {
  searchQuery.value = value
}

// Status config for badge & icons
const getStatusConfig = (status: (typeof ContactStatus)[keyof typeof ContactStatus]) => {
  const configs = {
    [ContactStatus.NEW]: { icon: 'i-lucide-alert-circle', label: 'New' },
    [ContactStatus.IN_PROGRESS]: { icon: 'i-lucide-clock', label: 'In Progress' },
    [ContactStatus.RESOLVED]: { icon: 'i-lucide-check-circle', label: 'Resolved' },
  }
  return (
    configs[status] || (configs[ContactStatus.NEW] as (typeof configs)[typeof ContactStatus.NEW])
  )
}

// Status tabs with counts
const statusCounts = computed(() => {
  const all = messageStore.messages?.length || 0
  const map = { all, NEW: 0, IN_PROGRESS: 0, RESOLVED: 0 }

  messageStore.messages?.forEach((o: MessageInterface) => {
    if (map[o.status as keyof typeof map] !== undefined) {
      map[o.status as keyof typeof map]++
    }
  })

  return map
})

const statusOptions = [
  { value: 'all', label: 'All Messages', icon: 'i-lucide-package' },
  { value: 'NEW', label: 'New', icon: 'i-lucide-clock' },
  { value: 'IN_PROGRESS', label: 'In Progress', icon: 'i-lucide-package' },
  { value: 'RESOLVED', label: 'Resolved', icon: 'i-lucide-package' },
]

const openDeleteModal = ref(false)
const openMessageDetailModal = ref(false)

const handleDeleteMessage = (message: MessageInterface) => {
  messageStore.selectedMessage = message
  openDeleteModal.value = true
}

const handleViewMessage = (message: MessageInterface) => {
  messageStore.selectedMessage = message
  openMessageDetailModal.value = true
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
        :data="messageStore.messages || []"
        :loading="isFetching"
        :columns="[
          { accessorKey: 'contact', header: 'Contact Info' },
          { accessorKey: 'subject', header: 'Subject' },
          {
            accessorKey: 'message',
            header: 'Message',
            meta: {
              class: {
                td: 'max-w-xs',
              },
            },
          },
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
      >
        <template #contact-cell="{ row }">
          <div class="flex flex-col">
            <span class="text-lg font-medium text-gray-900">{{ row.original.name }}</span>
            <a
              :href="`mailto:${row.original.email}`"
              v-if="row.original.email"
              class="hover:text-primary flex cursor-pointer items-center gap-2 text-gray-600 hover:underline"
            >
              <UIcon name="i-lucide-mail" class="h-4 w-4" />
              <span class="text-sm">{{ row.original.email }}</span>
            </a>
            <a
              :href="`tel:${row.original.phone}`"
              v-if="row.original.phone"
              class="hover:text-primary flex cursor-pointer items-center gap-2 text-gray-600 hover:underline"
            >
              <UIcon name="i-lucide-phone" class="h-4 w-4" />
              <span class="text-sm">{{ row.original.phone }}</span>
            </a>
          </div>
        </template>

        <template #subject-cell="{ row }">
          <span class="text-sm text-gray-800 capitalize">
            {{ row.original.subject }}
          </span>
        </template>

        <template #message-cell="{ row }">
          <div class="block w-full max-w-xs truncate" :title="row.original.message">
            <span class="text-sm text-gray-600">
              {{ row.original.message }}
            </span>
          </div>
        </template>

        <!-- Status -->
        <template #status-cell="{ row }">
          <span
            class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors"
            :class="{
              'bg-blue-100 text-blue-700': row.original.status === 'NEW',
              'bg-yellow-100 text-yellow-700': row.original.status === 'IN_PROGRESS',
              'bg-green-100 text-green-700': row.original.status === 'RESOLVED',
            }"
            v-if="row.original.status"
          >
            <UIcon :name="getStatusConfig(row.original.status).icon" class="h-3.5 w-3.5" />
            {{ getStatusConfig(row.original.status).label }}
          </span>
          <span v-else>-</span>
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
              @click="handleViewMessage(row.original)"
              title="View Details"
            >
              <UIcon name="i-lucide-eye" class="h-4 w-4" />
            </UButton>
            <UButton
              size="xs"
              color="error"
              variant="ghost"
              square
              title="Delete"
              @click="handleDeleteMessage(row.original)"
            >
              <UIcon name="i-lucide-trash-2" class="h-4 w-4" />
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
            messages
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

    <!-- Message Detail Modal -->
    <MessageDetail v-model:open="openMessageDetailModal" />

    <!-- Delete Message Modal -->
    <DeleteMessage v-model:open="openDeleteModal" />
  </div>
</template>
