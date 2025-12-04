<template>
  <UModal
    :title="`${props.mode === 'add' ? 'Add' : 'Edit'} Category`"
    v-model:open="modalOpen"
    @update:open="
      (val) => {
        if (!val) categoryStore.reset()
      }
    "
    :dismissible="false"
  >
    <div v-show="fetching" class="flex h-full w-full items-center justify-center">
      <div
        class="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-r-transparent"
      ></div>
    </div>

    <template v-if="!fetching" #body>
      <UForm
        :schema="schema"
        :state="categoryStore.formInputs"
        class="flex flex-col gap-4 p-2"
        id="category-form"
        @submit="onSubmit"
      >
        <UFormField label="Name" name="name" required>
          <UInput v-model="categoryStore.formInputs.name" />
        </UFormField>

        <UFormField label="Description" name="description">
          <UTextarea v-model="categoryStore.formInputs.description" :maxrows="4" autoresize />
        </UFormField>

        <UFormField label="Display Order" name="displayOrder">
          <UInputNumber
            :min="1"
            v-model="categoryStore.formInputs.displayOrder"
            orientation="vertical"
          />
        </UFormField>

        <UFormField label="Image" name="image">
          <FileDropzone
            v-model="categoryStore.formInputs.image"
            upload-url="/upload/single"
            containerClass="w-[150px] aspect-square srink-0"
            helpText="'The ratio of 1:1 would be best."
          />
        </UFormField>

        <UFormField label="Status" name="isActive">
          <URadioGroup
            indicator="hidden"
            v-model="categoryStore.formInputs.isActive"
            variant="card"
            :default-value="true"
            orientation="horizontal"
            :items="[
              { label: 'Active', value: true },
              { label: 'Inactive', value: false },
            ]"
            :ui="{ item: 'border-2' }"
          />
        </UFormField>
      </UForm>
    </template>
    <template v-if="!fetching" #footer="{ close }">
      <div class="flex w-full justify-end gap-2">
        <UButton :disabled="isSubmitting" label="Cancel" variant="outline" @click="close" />
        <UButton
          :loading="isSubmitting"
          label="Submit"
          type="submit"
          form="category-form"
          :disabled="isSubmitting"
        />
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    mode?: 'add' | 'edit'
    open?: boolean
  }>(),
  {
    mode: 'add',
    open: false,
  }
)

import * as z from 'zod'
import { useCategoryStore } from '~/stores/category.store'
import FileDropzone from '~/components/ui/FileDropzone.vue'
const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
}>()
const categoryStore = useCategoryStore()
const modalOpen = computed({
  get: () => props.open,
  set: (val: boolean) => emit('update:open', val),
})
const toast = useToast()
const isSubmitting = ref(false)
const fetching = ref(false)
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

watch(
  () => props.open,
  async (nowOpen) => {
    if (!nowOpen) return

    if (props.mode === 'add') {
      categoryStore.initializeForAdd()
      return
    }

    // ----- edit mode -----
    if (!categoryStore.selectedCategory?._id) {
      toast.add({
        color: 'error',
        title: 'Missing ID',
        description: 'Category ID is required for edit mode.',
      })
      emit('update:open', false)
      return
    }

    fetching.value = true
    try {
      await categoryStore.initializeForEdit(categoryStore.selectedCategory?._id)
    } catch (err) {
      toast.add({
        color: 'error',
        title: 'Failed to load',
        description: 'Could not load the category.',
      })
      emit('update:open', false)
    } finally {
      fetching.value = false
    }
  },
  { immediate: true } // run on first render if already open
)

const onSubmit = async () => {
  isSubmitting.value = true
  const isAdd = props.mode === 'add'
  const action = isAdd
    ? () => categoryStore.addCategory(categoryStore.formInputs)
    : () =>
        categoryStore.updateCategory(categoryStore.selectedCategory?._id!, categoryStore.formInputs)

  const response = await action()

  if (response?.data?.success) {
    toast.add({
      color: 'success',
      title: 'Success',
      description: `Category ${isAdd ? 'added' : 'updated'} successfully`,
    })
    emit('update:open', false)
    categoryStore.reset()
  } else {
    toast.add({
      color: 'error',
      title: 'Error',
      description: `Failed to ${isAdd ? 'add' : 'update'} category`,
    })
  }

  isSubmitting.value = false
  categoryStore.reset()
}
</script>
