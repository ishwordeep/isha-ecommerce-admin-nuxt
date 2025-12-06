<template>
  <div class="flex flex-col">
    <MessageTable />
  </div>
</template>

<script setup lang="ts">
import { useHeaderStore } from '~/stores/header.store'
import MessageTable from './components/MessageTable.vue'

const headerStore = useHeaderStore()

onBeforeMount(async () => {
  headerStore.setHeaders('Messages', 'Manage your messages here')
})
</script>
