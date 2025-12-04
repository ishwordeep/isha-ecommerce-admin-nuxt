<template>
  <UForm
    :schema="schema"
    :state="inputs"
    class="grid grid-cols-1 gap-4 p-2 sm:grid-cols-2"
    id="general-settings-form"
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
    <UFormField label="Logo" name="logoUrl" required>
      <FileDropzone
        v-model="inputs.logoUrl"
        upload-url="/upload/single"
        containerClass="w-[150px] aspect-square max-h-[150px]"
        helpText="'The ratio of 1:1 would be best."
      />
    </UFormField>
  </UForm>
  <UButton class="mt-4 ml-2" form="general-settings-form" type="submit">Save Changes</UButton>
</template>

<script setup lang="ts">
import * as z from 'zod'
import FileDropzone from '~/components/ui/FileDropzone.vue'
const settingStore = useSettingStore()
const schema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  email: z
    .string()
    .email('Invalid email address')
    .max(100, 'Email must be less than 100 characters'),
  phone: z.string(),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  country: z.string().min(1, 'Country is required'),
  postalCode: z.string().min(1, 'Postal Code is required'),
  logoUrl: z.string(),
})

type InputFields = z.output<typeof schema>

const inputs = reactive<InputFields>({
  name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  country: '',
  postalCode: '',
  logoUrl: '',
})

const fields: { label: string; name: keyof InputFields; type: string; required?: boolean }[] = [
  { label: 'Name', name: 'name', type: 'text', required: true },
  { label: 'Email', name: 'email', type: 'email', required: true },
  { label: 'Phone', name: 'phone', type: 'text', required: false },
  { label: 'Address', name: 'address', type: 'text', required: true },
  { label: 'City', name: 'city', type: 'text', required: true },
  { label: 'State', name: 'state', type: 'text', required: true },
  { label: 'Country', name: 'country', type: 'text', required: true },
  { label: 'Postal Code', name: 'postalCode', type: 'text', required: true },
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
  const res = await settingStore.updateSetting(inputs)
  console.log(res)
}
</script>
