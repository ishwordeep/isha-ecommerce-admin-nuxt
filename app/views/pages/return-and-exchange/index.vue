<script setup lang="ts">
import { useHeaderStore } from '~/stores/header.store'

definePageMeta({
  layout: 'admin',
})

const headerStore = useHeaderStore()
const settingStore = useSettingStore()
onBeforeMount(() => {
  headerStore.setHeaders('Return and Exchange', 'Manage your return and Exchange here')
})

const input = reactive({
  returnAndExchanges: '',
})

const saveData = async () => {
  await settingStore.updateSetting({ returnAndExchanges: input.returnAndExchanges })
  useToast().add({
    color: 'success',
    title: 'Success',
    description: 'Return and Exchange Updated Successfully',
  })
}

onMounted(() => {
  setTimeout(async () => {
    if (!settingStore.setting) {
      await settingStore.fetchSetting()
    }
    if (settingStore.setting) {
      input.returnAndExchanges = settingStore.setting.returnAndExchanges || ''
    }
  }, 1000)
})
</script>
<template>
  <UForm class="flex flex-col gap-4">
    <UCard>
      <UFormField label="Return and Exchange">
        <TiptapEditor
          v-model="input.returnAndExchanges"
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
