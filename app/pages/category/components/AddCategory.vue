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
          <UFileUpload v-model="inputs.image" class="aspect-square min-h-[150px] max-w-[150px]" />
          <!--          <UFileUpload-->
          <!--            v-model="inputs.image"-->
          <!--            class="aspect-square min-h-[150px] max-w-[150px]"-->
          <!--            v-else-->
          <!--            v-slot="{ open }"-->
          <!--          >-->
          <!--            <div class="relative h-full w-full">-->
          <!--              <NuxtImg-->
          <!--                class="h-full w-full object-cover"-->
          <!--                src="https://images.hdqwalls.com/wallpapers/bthumb/goku-unleashed-in-the-highlands-rc.jpg"-->
          <!--                @click="open()"-->
          <!--              />-->
          <!--              <UButton-->
          <!--                icon="i-lucide-x"-->
          <!--                size="sm"-->
          <!--                variant="solid"-->
          <!--                class="absolute -top-2 -right-2 rounded-full"-->
          <!--                @click="inputs.image = null"-->
          <!--              />-->
          <!--            </div>-->
          <!--          </UFileUpload>-->
        </UFormField>

        <UFormField label="Status" name="isActive">
          <!--          <USwitch-->
          <!--            unchecked-icon="i-lucide-x"-->
          <!--            checked-icon="i-lucide-check"-->
          <!--            default-value-->
          <!--            v-model="inputs.isActive"-->
          <!--          />-->
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
const categoryStore = useCategoryStore()
const open = ref(false)
const isSubmitting = ref(false)
const schema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(100, 'Name must be at most 100 characters'),
  description: z.string(),
  displayOrder: z.number().min(1, 'Display order must be at least 1'),
  isActive: z.boolean(),
  image: z
    .instanceof(File, {
      message: 'Please select an image file.',
    })
    .nullable(),
})
type InputFields = z.output<typeof schema>

const inputs = reactive<InputFields>({
  name: '',
  description: '',
  displayOrder: 1,
  isActive: true,
  image: null,
})

const resetForm = () => {
  inputs.name = ''
  inputs.description = ''
  inputs.displayOrder = 1
  inputs.isActive = true
  inputs.image = null
}

const onSubmit = async () => {
  isSubmitting.value = true
  // const formData = new FormData()
  // formData.append('name', inputs.name)
  // formData.append('description', inputs.description)
  // formData.append('displayOrder', inputs.displayOrder.toString())
  // formData.append('isActive', inputs.isActive.toString())
  // if (inputs.image) {
  //   formData.append('image', inputs.image)
  // }
  const res = await categoryStore.addCategory(inputs)
  if (res?.data) {
    open.value = false
  }
  isSubmitting.value = false
  resetForm()
}
</script>
