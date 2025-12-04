<template>
  <UTabs
    :items="tabHeaders"
    class="w-full"
    :ui="{
      list: 'w-max mr-auto',
    }"
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
import type { TabsItem } from '@nuxt/ui'
import General from '~/pages/settings/components/General.vue'
import Social from '~/pages/settings/components/Social.vue'
import { useHeaderStore } from '~/stores/header.store'

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
