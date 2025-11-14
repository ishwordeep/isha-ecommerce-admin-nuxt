<script setup lang="ts">
import { h, resolveComponent, watch } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import DeleteSlider from '~/pages/slider/components/DeleteSlider.vue'
import SliderForm from '~/pages/slider/components/SliderForm.vue'
import type { ProductInterface } from '~/services/product.service'
import type { SliderInterface } from '~/services/slider.service'

const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')
const sliderStore = useSliderStore()
const openDelete = ref(false)
const openEdit = ref(false)
const props = withDefaults(
  defineProps<{
    search?: string
  }>(),
  {
    search: '',
  }
)

const states = reactive({
  fetching: false,
})
const pagination = reactive({
  page: 1,
  limit: 20,
})

onBeforeMount(() => {
  if (!sliderStore.sliders?.length) {
    sliderStore.fetchSliders({
      ...pagination,
      search: props.search,
    })
  }
})

watch(
  () => [pagination.page, pagination.limit, props.search],
  async () => {
    states.fetching = true
    await sliderStore.fetchSliders({
      ...pagination,
      search: props.search,
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
    accessorKey: 'image',
    header: 'Image',
    cell: ({ row }) => {
      return row.getValue('image')
        ? h('img', {
            src: row.getValue('image'),
            alt: row.original.title,
            class: 'rounded-xs object-cover w-[100px] aspect-video',
          })
        : h('div', { class: 'w-[100px] aspect-video border border-default' })
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

const handleDelete = async (row: SliderInterface) => {
  sliderStore.selectedSlider = row
  openDelete.value = true
}

const handleEdit = (row: SliderInterface) => {
  sliderStore.selectedSlider = row
  openEdit.value = true
}
</script>

<template>
  <div class="border-default rounded-lg border bg-white">
    <UTable
      :data="sliderStore.sliders || []"
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
  </div>
  <div class="border-default flex justify-end pt-4">
    <UPagination
      v-model:page="pagination.page"
      :items-per-page="pagination.limit"
      :total="sliderStore.pagination?.total || 0"
    />
  </div>
  <DeleteSlider
    :open="openDelete"
    @update:open="
      () => {
        sliderStore.selectedSlider = null
        openDelete = false
      }
    "
  />

  <SliderForm mode="edit" v-model:open="openEdit" />
</template>
