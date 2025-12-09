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
import { useSettingStore } from '~/stores/settings.store'

const isInitializing = ref(true)
const settingStore = useSettingStore()

onMounted(async () => {
  // Small delay to prevent flash
  await settingStore.fetchSetting()
  useSettingSeo(computed(() => settingStore.setting))
  await new Promise((resolve) => setTimeout(resolve, 100))

  isInitializing.value = false
})
</script>
