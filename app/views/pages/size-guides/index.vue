<script setup lang="ts">
import { useHeaderStore } from '~/stores/header.store'

definePageMeta({
  layout: 'admin',
})

const headerStore = useHeaderStore()
const settingStore = useSettingStore()
onBeforeMount(() => {
  headerStore.setHeaders('Size Guides', 'Manage your size guides here')
})

const input = reactive({
  sizeGuides: '',
})

const saveData = async () => {
  await settingStore.updateSetting({ sizeGuides: input.sizeGuides })
  useToast().add({
    color: 'success',
    title: 'Success',
    description: 'Size Guides Updated Successfully',
  })
}

onMounted(() => {
  setTimeout(async () => {
    if (!settingStore.setting) {
      await settingStore.fetchSetting()
    }
    if (settingStore.setting) {
      input.sizeGuides = settingStore.setting.sizeGuides || ''
    }
  }, 1000)
})
</script>
<template>
  <UForm class="flex flex-col gap-4">
    <UCard>
      <UFormField label="Size Guides">
        <TiptapEditor v-model="input.sizeGuides" root-class="!min-h-[50dvh] !max-h-[60dvh]" />
      </UFormField>
    </UCard>
    <UButton
      @click="saveData"
      class="w-max"
      type="submit"
      form="terms-of-service-form"
      color="primary"
      >Save
    </UButton>
  </UForm>
</template>
