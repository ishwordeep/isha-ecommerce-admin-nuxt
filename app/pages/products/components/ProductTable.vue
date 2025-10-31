<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type { Row } from '@tanstack/vue-table'
import { useClipboard } from '@vueuse/core'
import { NuxtImg, USwitch } from '#components'
import DeleteCategory from '~/pages/category/components/DeleteCategory.vue'
import type { ProductInterface } from '~/services/product.service'

const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')
const productStore = useProductStore()
const openDelete = ref(false)
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
      return row.getValue('category')
    },
  },
  {
    accessorKey: 'price',
    header: 'Price',
  },
  {
    accessorKey: 'discount',
    header: 'Discount',
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
    accessorKey: 'actions',
    header: 'Actions',
  },
]

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
    >
      <template #actions="{ row }">
        <div class="flex gap-2">
          <UButton variant="outline" size="md" to="/products/add"
            ><UIcon name="i-lucide-pencil" />
          </UButton>
          <UButton variant="outline" size="md" to="/products/add" @click="handleDelete(row)"
            ><UIcon name="i-lucide-pencil" />
          </UButton>
        </div>
      </template>
    </UTable>
  </div>
  <DeleteCategory
    :open="openDelete"
    @update:open="
      () => {
        productStore.selectedProduct = null
        openDelete = false
      }
    "
  />
</template>
