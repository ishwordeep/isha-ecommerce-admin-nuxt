<template>
  <div class="flex flex-col gap-4">
    <UTabs
      v-model="currentTab"
      :items="tabHeaders"
      class="w-full"
      :ui="{ list: 'w-max mr-auto' }"
    />
    <div class="flex items-center justify-between gap-2">
      <UiSearchInput :delay="500" :loading="true" @search="handleSearch" />
      <UButton label="Add Category" @click="openForm = true" />
    </div>

    <CategoryTable :search="searchQuery" :status="currentTab" />

    <CategoryForm mode="add" v-model:open="openForm" />
  </div>
</template>

<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui'
import { useHeaderStore } from '~/stores/header.store'
import CategoryForm from './components/CategoryForm.vue'
import CategoryTable from './components/CategoryTable.vue'

const headerStore = useHeaderStore()
const openForm = ref(false)

const router = useRouter()
const route = useRoute()

const currentTab = computed({
  get() {
    return (route.query.tab as string) || 'active'
  },
  set(tab) {
    // Hash is specified here to prevent the page from scrolling to the top
    router.push({
      path: '/category',
      query: { tab },
    })
  },
})

onBeforeMount(() => {
  headerStore.setHeaders('Categories', 'Manage your categories here.')
})

const searchQuery = ref('')
const handleSearch = (value: string) => {
  searchQuery.value = value
}

const tabHeaders: TabsItem[] = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
]
</script>
