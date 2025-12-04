<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui'
import { useHeaderStore } from '~/stores/header.store'
import BrandPhilosophy from './components/BrandPhilosophy.vue'
import CoreValues from './components/CoreValues.vue'
import Header from './components/Header.vue'
import Journey from './components/Journey.vue'
import Teams from './components/Teams.vue'

const headerStore = useHeaderStore()

onBeforeMount(() => {
  headerStore.setHeaders('About Us', 'Manage your about us page here')
})

const route = useRoute()
const router = useRouter()

const active = computed({
  get() {
    return (route.query.tab as string) || 'header'
  },
  set(tab) {
    // Hash is specified here to prevent the page from scrolling to the top
    router.push({
      path: `/front-pages/about-us`,
      query: { tab },
    })
  },
})

const items = ref<TabsItem[]>([
  {
    label: 'Header',
    icon: 'i-lucide-info',
    slot: 'header',
    value: 'header',
  },
  {
    label: 'Brand Philosophy',
    icon: 'i-lucide-book-open',
    slot: 'brand-philosophy',
    value: 'brand-philosophy',
  },
  {
    label: 'Milestones',
    icon: 'i-lucide-flag',
    slot: 'milestones',
    value: 'milestones',
  },
  {
    label: 'Teams',
    icon: 'i-lucide-users',
    slot: 'teams',
    value: 'teams',
  },
  {
    label: 'Core Values',
    icon: 'i-lucide-heart',
    slot: 'core-values',
    value: 'core-values',
  },
])
</script>
<template>
  <UTabs
    :items="items"
    class="w-full"
    :ui="{
      list: 'w-max mr-auto',
    }"
    v-model="active"
  >
    <template #header>
      <Header />
    </template>

    <template #brand-philosophy>
      <BrandPhilosophy />
    </template>

    <template #milestones>
      <Journey />
    </template>

    <template #teams>
      <Teams />
    </template>

    <template #core-values>
      <CoreValues />
    </template>
  </UTabs>
</template>
