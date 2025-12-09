<script setup lang="ts">
import { useHeaderStore } from '~/stores/header.store'

definePageMeta({
  layout: 'admin',
})

const headerStore = useHeaderStore()
const settingStore = useSettingStore()
onBeforeMount(() => {
  headerStore.setHeaders('Shipping Information', 'Manage your shipping Information here')
})

const input = reactive({
  shippingInformations: '',
})

const saveData = async () => {
  await settingStore.updateSetting({ shippingInformations: input.shippingInformations })
  useToast().add({
    color: 'success',
    title: 'Success',
    description: 'Shipping Information Updated Successfully',
  })
}

onMounted(() => {
  setTimeout(async () => {
    if (!settingStore.setting) {
      await settingStore.fetchSetting()
    }
    if (settingStore.setting) {
      input.shippingInformations = settingStore.setting.shippingInformations || ''
    }
  }, 1000)
})
</script>
<template>
  <UForm class="flex flex-col gap-4">
    <UCard>
      <UFormField label="Shipping Information">
        <TiptapEditor
          v-model="input.shippingInformations"
          root-class="!min-h-[50dvh] !max-h-[60dvh]"
        />
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
