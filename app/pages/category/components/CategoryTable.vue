<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type { Row } from '@tanstack/vue-table'
import { useClipboard } from '@vueuse/core'
import { NuxtImg, USwitch } from '#components'
import DeleteCategory from '~/pages/category/components/DeleteCategory.vue'

const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')
const UDropdownMenu = resolveComponent('UDropdownMenu')
const categoryStore = useCategoryStore()
const toast = useToast()
const { copy } = useClipboard()
const openDelete = ref(false)
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
          }),
          h(UButton, {
            size: 'md',
            variant: 'subtle',
            color: 'error',
            icon: 'i-lucide-trash',
            onClick() {
              categoryStore.selectedCategory = row.original
              console.log('Selected Category for Deletion:', categoryStore.selectedCategory)
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
  <DeleteCategory
    :open="openDelete"
    @update:open="
      () => {
        categoryStore.selectedCategory = null
        openDelete = false
      }
    "
  />
</template>
