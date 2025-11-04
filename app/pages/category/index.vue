<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center justify-between gap-2">
      <div></div>
      <UButton label="Add Category" @click="openForm = true" />
    </div>
    <CategoryTable />
    <CategoryForm mode="add" v-model:open="openForm" />
  </div>
</template>

<script setup lang="ts">
import { useHeaderStore } from '~/stores/header.store'
import CategoryTable from '~/pages/category/components/CategoryTable.vue'
import CategoryForm from '~/pages/category/components/CategoryForm.vue'
import { watch } from 'vue'
definePageMeta({
  layout: 'admin',
})
const openForm = ref(false)
const states = reactive({
  fetching: false,
  adding: false,
})

useSeoMeta({
  title: 'Categories',
  description: 'Manage your categories here.',
})

const headerStore = useHeaderStore()

onBeforeMount(() => {
  headerStore.setHeaders('Categories', 'Manage your categories here.')
})
</script>
