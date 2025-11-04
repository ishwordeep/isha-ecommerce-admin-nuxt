<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center justify-between gap-2">
      <div></div>
      <AddCategory />
    </div>
    <CategoryTable />
  </div>
</template>

<script setup lang="ts">
import { useHeaderStore } from '~/stores/header.store'
import CategoryTable from '~/pages/category/components/CategoryTable.vue'
import AddCategory from '~/pages/category/components/AddCategory.vue'
import { watch } from 'vue'
definePageMeta({
  layout: 'admin',
})

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
