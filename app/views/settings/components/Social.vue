<template>
  <UForm
    :schema="schema"
    :state="inputs"
    class="grid grid-cols-1 gap-4 p-2 sm:grid-cols-2"
    id="social-settings-form"
    @submit="onSubmit"
  >
    <UFormField
      v-for="field in fields"
      :label="field.label"
      :name="field.name"
      :key="field.name"
      :required="field.required"
    >
      <UInput v-model="inputs[field.name]" />
    </UFormField>
    <UFormField label="Favicon" name="faviconUrl" required>
      <FileDropzone
        v-model="inputs.faviconUrl"
        upload-url="/upload/single"
        containerClass="w-[150px] aspect-square max-h-[150px]"
        helpText="'The ratio of 1:1 would be best."
      />
    </UFormField>
  </UForm>
  <UButton class="mt-4 ml-2" form="social-settings-form" type="submit">Save Changes</UButton>
</template>

<script setup lang="ts">
import * as z from 'zod'
import FileDropzone from '~/components/ui/FileDropzone.vue'
const settingStore = useSettingStore()
const schema = z.object({
  facebook: z.string().url('Invalid URL').optional().or(z.literal('')),
  instagram: z.string().url('Invalid URL').optional().or(z.literal('')),
  tiktok: z.string().url('Invalid URL').optional().or(z.literal('')),
  faviconUrl: z.string(),
})

type InputFields = z.output<typeof schema>

const inputs = reactive<InputFields>({
  facebook: '',
  instagram: '',
  tiktok: '',
  faviconUrl: '',
})

const fields: { label: string; name: keyof InputFields; type: string; required?: boolean }[] = [
  { label: 'Facebook', name: 'facebook', type: 'url' },
  { label: 'Instagram', name: 'instagram', type: 'url' },
  { label: 'Tiktok', name: 'tiktok', type: 'url' },
]

onMounted(async () => {
  if (!settingStore.setting) {
    await settingStore.fetchSetting()
  }
  if (settingStore.setting) {
    Object.assign(inputs, settingStore.setting)
  }
})

const onSubmit = async () => {
  const toast = useToast()
  try {
    await settingStore.updateSetting(inputs)
    toast.add({
      color: 'success',
      title: 'Success',
      description: 'Social settings updated successfully.',
    })
  } catch (error) {
    toast.add({
      color: 'error',
      title: 'Error',
      description: 'An error occurred while updating social settings.',
    })
  }
}
</script>
