<template>
  <UTabs
    :items="tabHeaders"
    variant="link"
    :ui="{
      list: 'w-full max-w-max mr-auto !border-b-2 overflow-x-auto overflow-y-hidden',
      indicator: 'border-2',
    }"
    class="w-full gap-4"
  >
    <template #general>
      <General />
    </template>
    <template #social>
      <Social />
    </template>
  </UTabs>
</template>

<script setup lang="ts">
import { useHeaderStore } from '~/stores/header.store'
import type { TabsItem } from '#ui/components/Tabs.vue'
import General from '~/pages/settings/components/General.vue'
import Social from '~/pages/settings/components/Social.vue'

definePageMeta({
  layout: 'admin',
  name: 'Settings',
})

useSeoMeta({
  title: 'Settings',
  description: 'Manage your settings here.',
})

const headerStore = useHeaderStore()
const tabHeaders = ref<TabsItem[]>([
  {
    label: 'General Information',
    slot: 'general',
  },
  {
    label: 'Social Media',
    slot: 'social',
  },
])

onBeforeMount(() => {
  headerStore.setHeaders('Settings', 'Manage your settings here.')
})
</script>
