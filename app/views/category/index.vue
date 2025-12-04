<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center justify-between gap-2">
      <UiSearchInput :delay="500" :loading="true" @search="handleSearch" />
      <UButton label="Add Category" @click="openForm = true" />
    </div>
    <CategoryTable :search="searchQuery" />
    <CategoryForm mode="add" v-model:open="openForm" />
  </div>
</template>

<script setup lang="ts">
import { useHeaderStore } from '~/stores/header.store'
import CategoryForm from './components/CategoryForm.vue'
import CategoryTable from './components/CategoryTable.vue'

const headerStore = useHeaderStore()
const openForm = ref(false)

onBeforeMount(() => {
  headerStore.setHeaders('Categories', 'Manage your categories here.')
})

const searchQuery = ref('')
const handleSearch = (value: string) => {
  searchQuery.value = value
}
</script>
