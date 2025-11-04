<!-- components/ProductForm.vue -->
<template>
  <UPageCard class="p-4">
    <UForm
      :schema="schema"
      :state="productStore.formInputs"
      @submit="handleSubmit"
      class="flex flex-col gap-4"
    >
      <UCollapsible class="flex flex-col gap-4" default-open>
        <UButton
          class="group rounded-none border-0 bg-gray-100 hover:bg-gray-100/70 active:bg-gray-100/70"
          :label="title"
          variant="soft"
          trailing-icon="i-lucide-chevron-down"
          :ui="{
            trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200',
          }"
          block
        />
        <template #content>
          <!-- Grid: Name, Category, Price -->
          <div class="4xl:grid-cols-4 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            <UFormField label="Name" name="name" required>
              <UInput v-model="productStore.formInputs.name" />
            </UFormField>

            <UFormField label="Select Category" name="category" required>
              <USelect
                v-model="productStore.formInputs.category"
                :items="categoryList"
                placeholder="Choose category"
              />
            </UFormField>

            <UFormField label="Price" name="price" required>
              <UInputNumber
                :min="1"
                v-model="productStore.formInputs.price"
                orientation="vertical"
              />
            </UFormField>

            <UFormField label="Discount %" name="discount">
              <UInputNumber
                :min="0"
                :max="100"
                v-model="productStore.formInputs.discount"
                orientation="vertical"
              />
            </UFormField>
          </div>

          <!-- Description -->
          <UFormField class="my-6" label="Description" name="description">
            <UTextarea v-model="productStore.formInputs.description" :maxrows="5" autoresize />
          </UFormField>

          <!-- Tags, Colors, Sizes, Checkboxes -->
          <div
            class="4xl:grid-cols-4 grid grid-cols-1 items-start gap-6 sm:grid-cols-2 xl:grid-cols-3"
          >
            <UFormField label="Colors" name="colors">
              <UInputTags
                v-model="productStore.formInputs.colors"
                addOnBlur
                addOnPaste
                addOnTab
                placeholder="Add color"
              />
            </UFormField>

            <UFormField label="Sizes" name="sizes">
              <UInputTags
                v-model="productStore.formInputs.sizes"
                addOnBlur
                addOnPaste
                addOnTab
                placeholder="Add size"
              />
            </UFormField>

            <UFormField label="Tags" name="tags" required>
              <UInputTags v-model="productStore.formInputs.tags" placeholder="Add tags" />
            </UFormField>

            <UFormField label="Is New?" name="isNew">
              <UCheckbox
                v-model="productStore.formInputs.isNew"
                variant="card"
                label="New"
                class="max-w-max"
              />
            </UFormField>

            <UFormField label="Is Featured?" name="isFeatured">
              <UCheckbox
                v-model="productStore.formInputs.isFeatured"
                variant="card"
                label="Featured"
                class="max-w-max"
              />
            </UFormField>

            <UFormField label="Is Trending?" name="isTrending">
              <UCheckbox
                v-model="productStore.formInputs.isTrending"
                variant="card"
                label="Trending"
                class="max-w-max"
              />
            </UFormField>

            <UFormField label="Main Image" name="image">
              <FileDropzone
                v-model="productStore.formInputs.image"
                upload-url="/upload/single"
                containerClass="w-[150px] aspect-square max-h-[150px]"
              />
            </UFormField>

            <UFormField label="Status" name="isActive">
              <URadioGroup
                indicator="hidden"
                v-model="productStore.formInputs.isActive"
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
          </div>

          <!-- Gallery Images -->
          <UFormField label="Gallery Images" name="images" class="my-4">
            <FileDropzone
              v-model="productStore.formInputs.images"
              upload-url="/upload/multiple"
              fieldName="images"
              containerClass="min-h-48"
            />
          </UFormField>
        </template>
      </UCollapsible>

      <!-- Submit & Reset Buttons -->
      <div class="flex space-x-2">
        <UButton
          type="submit"
          :label="submitLabel"
          :loading="productStore.isSubmitting"
          :disabled="productStore.isSubmitting"
        />
        <UButton
          v-if="showReset"
          type="button"
          label="Reset"
          variant="outline"
          :disabled="productStore.isSubmitting"
          @click="productStore.resetToOriginal"
        />
      </div>
    </UForm>
  </UPageCard>
</template>

<script setup lang="ts">
import * as z from 'zod'
import FileDropzone from '~/components/ui/FileDropzone.vue'
import { useProductStore } from '@/stores/product.store'
import { useCategoryStore } from '@/stores/category.store'

const props = withDefaults(
  defineProps<{
    mode?: 'add' | 'edit'
    showReset?: boolean
  }>(),
  {
    mode: 'add',
    showReset: true,
  }
)

const productStore = useProductStore()
const categoryStore = useCategoryStore()
const toast = useToast()
// Ensure categories are loaded
onBeforeMount(async () => {
  if (!categoryStore.list?.length) {
    await categoryStore.fetchListOnly()
  }
})

// Dynamic labels
const title = computed(() => (props.mode === 'edit' ? 'Edit Product' : 'Add New Product'))
const submitLabel = computed(() => (props.mode === 'edit' ? 'Update Product' : 'Create Product'))

// Category dropdown items
const categoryList = computed(
  () =>
    categoryStore.list?.map((c) => ({
      label: c.name,
      value: c._id, // we store name in form, map to ID on submit
    })) ?? []
)

// Zod Schema
const schema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  description: z.string().optional(),
  price: z.number().min(1, 'Price must be at least 1'),
  discount: z.number().min(0).max(100).optional().default(0),
  category: z.string().min(1, 'Category is required'),
  isActive: z.boolean(),
  isNew: z.boolean(),
  isFeatured: z.boolean(),
  isTrending: z.boolean(),
  tags: z.array(z.string()),
  image: z.string().optional(),
  images: z.array(z.string()),
  colors: z.array(z.string()),
  sizes: z.array(z.string()),
})

// Submit handler
const handleSubmit = async () => {
  const isAdd = props.mode === 'add'
  const action = isAdd
    ? () => productStore.addProduct(productStore.formInputs)
    : () => productStore.updateProduct(productStore.selectedProduct?._id!, productStore.formInputs)

  const response = await action()

  if (response?.data?.success) {
    toast.add({
      color: 'success',
      title: 'Success',
      description: `Product ${isAdd ? 'added' : 'updated'} successfully`,
    })
    navigateTo('/products')
    productStore.reset()
  } else {
    toast.add({
      color: 'error',
      title: 'Error',
      description: `Failed to ${isAdd ? 'add' : 'update'} product`,
    })
  }
}
</script>
