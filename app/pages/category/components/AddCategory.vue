<template>
  <UModal
    title="Add Category"
    v-model:open="open"
    @update:open="
      (val) => {
        if (!val) resetForm()
      }
    "
  >
    <UButton>Add Category</UButton>
    <template #body>
      <UForm
        :schema="schema"
        :state="inputs"
        class="flex flex-col gap-4 p-2"
        id="category-form"
        @submit="onSubmit"
      >
        <UFormField label="Name" name="name" required>
          <UInput v-model="inputs.name" />
        </UFormField>

        <UFormField label="Description" name="description">
          <UTextarea v-model="inputs.description" :maxrows="4" autoresize />
        </UFormField>

        <UFormField label="Display Order" name="displayOrder">
          <UInputNumber :min="1" v-model="inputs.displayOrder" orientation="vertical" />
        </UFormField>

        <UFormField label="Image" name="image">
          <FileDropzone
            v-model="inputs.image"
            upload-url="/upload/single"
            containerClass="w-[150px] aspect-square max-h-[150px]"
          />
        </UFormField>

        <UFormField label="Status" name="isActive">
          <URadioGroup
            indicator="hidden"
            v-model="inputs.isActive"
            variant="card"
            :default-value="true"
            orientation="horizontal"
            :items="[
              { label: 'Active', value: true },
              { label: 'InActive', value: false },
            ]"
            :ui="{ item: 'border-2' }"
          />
        </UFormField>
      </UForm>
    </template>

    <template #footer="{ close }">
      <div class="flex w-full justify-end gap-2">
        <UButton
          :disabled="isSubmitting"
          label="Cancel"
          color="neutral"
          variant="outline"
          @click="close"
        />
        <UButton
          :loading="isSubmitting"
          label="Submit"
          color="neutral"
          type="submit"
          form="category-form"
        />
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import * as z from 'zod'
import { useCategoryStore } from '~/stores/category.store'
import FileDropzone from '~/components/ui/FileDropzone.vue'
const categoryStore = useCategoryStore()
const open = ref(false)
const isSubmitting = ref(false)
const toast = useToast()
const schema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(100, 'Name must be at most 100 characters'),
  description: z.string(),
  displayOrder: z.number().min(1, 'Display order must be at least 1'),
  isActive: z.boolean(),
  image: z.string(),
})
type InputFields = z.output<typeof schema>

const inputs = reactive<InputFields>({
  name: '',
  description: '',
  displayOrder: 1,
  isActive: true,
  image: '',
})

const resetForm = () => {
  inputs.name = ''
  inputs.description = ''
  inputs.displayOrder = 1
  inputs.isActive = true
  inputs.image = ''
}

const onSubmit = async () => {
  isSubmitting.value = true
  const res = await categoryStore.addCategory(inputs)
  if (res?.data?.success) {
    toast.add({
      color: 'success',
      title: 'Success',
      description: 'Category added successfully.',
    })
  } else {
    toast.add({
      color: 'error',
      title: 'Error',
      description: 'Something went wrong',
    })
  }
  isSubmitting.value = false
  open.value = false
  resetForm()
}
</script>
