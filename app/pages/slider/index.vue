<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center justify-between gap-2">
      <UiSearchInput :delay="500" :loading="true" @search="handleSearch" />
      <UButton label="Add Slider" @click="openForm = true" />
    </div>
    <SliderTable :search="searchQuery" />
    <SliderForm mode="add" v-model:open="openForm" />
  </div>
</template>

<script setup lang="ts">
import { useHeaderStore } from '~/stores/header.store'
import SliderTable from '~/pages/slider/components/SliderTable.vue'
import SliderForm from '~/pages/slider/components/SliderForm.vue'
definePageMeta({
  layout: 'admin',
})
const openForm = ref(false)

useSeoMeta({
  title: 'Sliders',
  description: 'Manage your sliders here.',
})

const headerStore = useHeaderStore()

onBeforeMount(() => {
  headerStore.setHeaders('Sliders', 'Manage your sliders here.')
})

const searchQuery = ref('')
const handleSearch = (value: string) => {
  searchQuery.value = value
}
</script>
