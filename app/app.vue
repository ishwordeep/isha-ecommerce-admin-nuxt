<template>
  <UApp>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <!-- Loading Screen -->
      <div
        v-show="isInitializing"
        class="fixed inset-0 z-50 flex items-center justify-center bg-white"
      >
        <div
          class="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-r-transparent"
        ></div>
      </div>

      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
<script setup lang="ts">
import { useAuthStore } from '~/stores/auth.store'
import { useSettingStore } from '~/stores/settings.store'

const isInitializing = ref(true)
const authStore = useAuthStore()
const settingStore = useSettingStore()

// Fix: Always return something from useAsyncData + only run when authenticated
await useAsyncData(
  'initial-setting',
  async () => {
    // Critical: Wait for auth state to be fully hydrated (especially in SSR)
    await nextTick()

    if (!authStore.isAuthenticated) {
      // Return null or throw skip to prevent duplicate request on client
      return null // or throw createError({ statusCode: 403, fatal: false })
    }

    // Only call fetchSetting if authenticated
    return await settingStore.fetchSetting()
  },
  {
    // This prevents Nuxt from re-running the request on client if it returned null/undefined
    server: true,
    lazy: true,
    default: () => null,
  }
)
useSettingSeo(computed(() => settingStore.setting))

onMounted(async () => {
  // Small delay to prevent flash
  await new Promise((resolve) => setTimeout(resolve, 100))

  isInitializing.value = false
})

watch(
  () => authStore.isAuthenticated,
  async () => {
    if (!settingStore.setting && authStore.isAuthenticated) {
      await settingStore.fetchSetting()
    }
  }
)
</script>
