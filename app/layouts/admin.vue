<template>
  <div class="flex min-h-screen">
    <Sidebar :className="'max-lg:hidden sticky top-0 w-64 '" />
    <div class="flex flex-1 flex-col overflow-x-hidden bg-gray-50 p-6">
      <div class="mb-4 flex items-center justify-between gap-2">
        <UDrawer
          v-model:open="isDrawerOpen"
          direction="left"
          class="lg:hidden"
          :ui="{
            content: 'w-full sm:w-64',
            container: 'p-0 overflow-hidden',
          }"
        >
          <UButton variant="outline" icon="i-lucide-menu" @click="isDrawerOpen = true" />

          <template #body>
            <Sidebar :className="'w-full border-r-0'" @navigate="isDrawerOpen = false" />
          </template>
        </UDrawer>
        <div class="flex flex-col max-lg:items-center">
          <h1 class="text-2xl font-bold">{{ headerStore.title }}</h1>
          <p class="text-center text-sm text-gray-600 max-sm:hidden">
            {{ headerStore.description }}
          </p>
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
import { ref } from 'vue'

const headerStore = useHeaderStore()
const authStore = useAuthStore()

const isDrawerOpen = ref(false)

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
