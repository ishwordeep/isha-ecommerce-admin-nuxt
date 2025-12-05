<template>
  <div class="flex flex-col">
    <OrderTable />
  </div>
</template>

<script setup lang="ts">
import { useCategoryStore } from '~/stores/category.store'
import { useHeaderStore } from '~/stores/header.store'
import OrderTable from './components/OrderTable.vue'

const headerStore = useHeaderStore()
const categoryStore = useCategoryStore()

onBeforeMount(async () => {
  headerStore.setHeaders('Orders', 'Manage your orders here')
  if (!categoryStore.list?.length) {
    await categoryStore.fetchListOnly()
  }
})
</script>
