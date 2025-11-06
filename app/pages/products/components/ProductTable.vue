<script setup lang="ts">
import { h, resolveComponent, watch } from 'vue'
import type { TableColumn } from '@nuxt/ui'

import DeleteProduct from '~/pages/products/components/DeleteProduct.vue'
import type { ProductInterface } from '~/services/product.service'

const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')
const productStore = useProductStore()
const openDelete = ref(false)

const props = withDefaults(
  defineProps<{
    search?: string
    category?: string
  }>(),
  {
    search: '',
    category: '',
  }
)

const pagination = reactive({
  page: 1,
  limit: 20,
})

watch(
  () => [pagination.page, pagination.limit, props.search, props.category],
  async () => {
    states.fetching = true
    await productStore.fetchProducts({
      ...pagination,
      search: props.search,
      category: props.category,
    })
    states.fetching = false
  }
)

const columns: TableColumn<ProductInterface>[] = [
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
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => {
      return row.original.categoryDetails?.name || '-'
    },
  },
  {
    id: 'image',
    header: 'Image',
  },
  {
    accessorKey: 'price',
    header: 'Price',
    cell: ({ row }) => {
      return `$${row.original.price}`
    },
  },
  {
    accessorKey: 'discount',
    header: 'Discount',
    id: 'discount',
  },
  {
    accessorKey: 'isActive',
    header: 'Status',
    cell: ({ row }) => {
      return h(
        UBadge,
        {
          color: row.original.isActive ? 'success' : 'error',
          variant: 'subtle',
        },
        {
          default: () => (row.original.isActive ? 'Active' : 'Inactive'),
        }
      )
    },
  },
  {
    id: 'actions',
    header: 'Actions',
  },
]
const states = reactive({
  fetching: false,
  adding: false,
})

onMounted(async () => {
  states.fetching = true
  await productStore.fetchProducts({
    ...pagination,
    search: props.search,
  })
  states.fetching = false
})
const handleDelete = async (row: ProductInterface) => {
  productStore.selectedProduct = row
  console.log('Selected Product for Deletion:', productStore.selectedProduct)
  openDelete.value = true
}
</script>

<template>
  <div class="border-default rounded-lg border bg-white">
    <UTable
      :data="productStore.products || []"
      :columns="columns"
      class="flex-1"
      :ui="{ thead: 'bg-gray-100' }"
      :loading="states.fetching"
    >
      <template #image-cell="{ row }">
        <NuxtImg
          v-if="row.original.image"
          :src="row.original.image"
          class="aspect-square w-24 min-w-16 object-fill"
        />
        <div v-else class="border-default aspect-square w-24 min-w-16 border object-fill"></div>
      </template>

      <template #discount-cell="{ row }">
        <span v-if="row.original.discount || 0 > 0"> {{ row.original.discount }}% </span>
        <span v-else> - </span>
      </template>

      <template #actions-cell="{ row }">
        <div class="flex gap-2">
          <UButton
            variant="outline"
            size="md"
            icon="i-lucide-pencil"
            color="info"
            :to="`/products/${row.original._id}/edit`"
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
  </div>
  <div class="border-default flex justify-end pt-4">
    <UPagination
      v-model:page="pagination.page"
      :items-per-page="pagination.limit"
      :total="productStore.pagination?.total || 0"
    />
  </div>
  <DeleteProduct
    :open="openDelete"
    @update:open="
      () => {
        productStore.selectedProduct = null
        openDelete = false
      }
    "
  />
</template>
