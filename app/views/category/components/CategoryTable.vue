<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import { h, resolveComponent, watch } from 'vue'
import type { ProductInterface } from '~/services/product.service'
import CategoryForm from './CategoryForm.vue'
import DeleteCategory from './DeleteCategory.vue'

const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')
const categoryStore = useCategoryStore()
const openDelete = ref(false)
const openEdit = ref(false)
const props = withDefaults(
  defineProps<{
    search?: string
    status?: string
  }>(),
  {
    search: '',
    status: 'active',
  }
)

const states = reactive({
  fetching: false,
})
const pagination = reactive({
  page: 1,
  limit: 20,
  pages: computed(() => categoryStore.pagination?.pages || 0),
  total: computed(() => categoryStore.pagination?.total || 0),
})

const { from, to, pageCount, hasItems, total } = usePaginationInfo(pagination)

onBeforeMount(() => {
  if (!categoryStore.categories?.length) {
    categoryStore.fetchCategories({
      page: pagination.page,
      limit: pagination.limit,
      search: props.search,
    })
  }
})

watch(
  () => [pagination.page, pagination.limit, props.search, props.status],
  async () => {
    states.fetching = true
    await categoryStore.fetchCategories({
      page: pagination.page,
      limit: pagination.limit,
      search: props.search,
      status: props.status,
    })
    states.fetching = false
  }
)

const columns: TableColumn<any>[] = [
  {
    accessorKey: 's.n',
    header: 'S.N',
    cell: ({ row }) => `${row.index + 1}`,
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      return h('div', { class: 'font-medium' }, `${row.getValue('name')}`)
    },
  },
  {
    accessorKey: 'image',
    header: 'Image',
    cell: ({ row }) => {
      return row.getValue('image')
        ? h('img', {
            src: row.getValue('image'),
            alt: row.original.title,
            class: 'rounded-xs object-cover w-[50px] aspect-square',
          })
        : h('div', { class: 'w-[50px] aspect-square border border-default' })
    },
  },
  {
    accessorKey: 'displayOrder',
    header: 'Display Order',
  },
  {
    accessorKey: 'isActive',
    header: 'Status',
    cell: ({ row }) => {
      return h(
        UBadge,
        {
          color: row.getValue('isActive') ? 'success' : 'error',
          variant: 'subtle',
          class: 'px-2 py-1',
        },
        {
          default: () => (row.getValue('isActive') ? 'Active' : 'Inactive'),
        }
      )
    },
  },
  {
    id: 'actions',
    header: 'Actions',
  },
]

const handleDelete = async (row: ProductInterface) => {
  categoryStore.selectedCategory = row
  openDelete.value = true
}

const handleEdit = (row: ProductInterface) => {
  categoryStore.selectedCategory = row
  openEdit.value = true
}
</script>

<template>
  <UCard
    class="rounded-lg"
    :ui="{
      body: '!p-0',
    }"
  >
    <UTable
      :data="categoryStore.categories || []"
      :columns="columns"
      class="flex-1"
      :ui="{ thead: 'bg-gray-100' }"
    >
      <template #actions-cell="{ row }">
        <div class="flex gap-2">
          <UButton
            variant="outline"
            size="md"
            icon="i-lucide-pencil"
            color="info"
            @click="() => handleEdit(row.original)"
          />
          <UButton
            variant="outline"
            size="md"
            @click="handleDelete(row.original)"
            icon="i-lucide-trash"
            color="error"
          />
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
  <DeleteCategory
    :open="openDelete"
    @update:open="
      () => {
        categoryStore.selectedCategory = null
        openDelete = false
      }
    "
  />

  <CategoryForm mode="edit" v-model:open="openEdit" />
</template>
