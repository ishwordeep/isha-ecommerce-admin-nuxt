<script setup lang="ts">
import { h, resolveComponent, watch } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import DeleteCategory from '~/pages/category/components/DeleteCategory.vue'
import CategoryForm from '~/pages/category/components/CategoryForm.vue'

const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')
const categoryStore = useCategoryStore()
const openDelete = ref(false)
const openEdit = ref(false)

const states = reactive({
  fetching: false,
})
const pagination = reactive({
  page: 1,
  limit: 20,
  query: '',
})

onBeforeMount(() => {
  if (!categoryStore.categories?.length) {
    categoryStore.fetchCategories(pagination)
  }
})

watch(
  () => [pagination.page, pagination.limit, pagination.query],
  async () => {
    states.fetching = true
    await categoryStore.fetchCategories(pagination)
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
            class: 'rounded-md object-cover w-[50px] aspect-square',
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
    cell: ({ row }) => {
      return h(
        'div',

        {
          class: 'flex gap-2',
        },
        [
          h(UButton, {
            size: 'md',
            variant: 'subtle',
            icon: 'i-lucide-pencil',
            color: 'info',
            onClick() {
              categoryStore.selectedCategory = row.original
              console.log('Selected Category for Deletion:', categoryStore.selectedCategory)
              openEdit.value = true

              console.log(openEdit.value)
            },
          }),
          h(UButton, {
            size: 'md',
            variant: 'subtle',
            color: 'error',
            icon: 'i-lucide-trash',
            onClick() {
              categoryStore.selectedCategory = row.original
              openDelete.value = true
            },
          }),
        ]
      )
    },
  },
]
</script>

<template>
  <div class="border-default rounded-lg border bg-white">
    <UTable
      :data="categoryStore.categories || []"
      :columns="columns"
      class="flex-1"
      :ui="{ thead: 'bg-gray-100' }"
    />
  </div>
  <div class="border-default flex justify-end pt-4">
    <UPagination
      v-model:page="pagination.page"
      :items-per-page="pagination.limit"
      :total="categoryStore.pagination?.total || 0"
    />
  </div>
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
