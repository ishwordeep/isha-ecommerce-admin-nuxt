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
          class="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-r-transparent"
        ></div>
      </div>

      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
<script setup lang="ts">
const isInitializing = ref(true)

onMounted(async () => {
  const authStore = useAuthStore()
  const settingStore = useSettingStore()
  authStore.initAuth()
  if (!settingStore.setting) {
    await settingStore.fetchSetting()
  }
  // Small delay to prevent flash
  await new Promise((resolve) => setTimeout(resolve, 100))

  isInitializing.value = false
})
</script>
