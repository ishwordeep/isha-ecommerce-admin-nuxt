<template>
  <div class="flex min-h-screen">
    <Sidebar />
    <div class="flex flex-1 flex-col overflow-x-hidden bg-gray-50 p-6">
      <div class="mb-4 flex items-center justify-between gap-2">
        <div class="flex flex-col max-lg:pl-12 max-sm:pl-10">
          <h1 class="text-2xl font-bold">{{ headerStore.title }}</h1>
          <p class="text-sm text-gray-600">{{ headerStore.description }}</p>
        </div>
        <UDropdownMenu
          size="lg"
          :content="{ align: 'end' }"
          :items="items"
          :ui="{ content: 'w-40' }"
        >
          <UAvatar src="https://github.com/benjamincanac.png" />
        </UDropdownMenu>
      </div>
      <main>
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import Sidebar from '~/components/ui/Sidebar.vue'
import { useHeaderStore } from '~/stores/header.store'

const headerStore = useHeaderStore()
const authStore = useAuthStore()
const items = ref([
  {
    label: 'Settings',
    icon: 'i-lucide-settings',
    to: '/settings',
  },
  {
    label: 'Logout',
    icon: 'i-lucide-log-out',
    onSelect: () => {
      authStore.clearAuth()
    },
  },
])
</script>
