<!-- components/ProductForm.vue -->
<template>
  <UForm
    :schema="schema"
    :state="productStore.formInputs"
    @submit="handleSubmit"
    class="grid grid-cols-1 gap-4 min-[920px]:grid-cols-3"
  >
    <div class="col-span-2 flex flex-col gap-4">
      <UPageCard title="Basic Information">
        <UFormField label="Name" name="name" required>
          <UInput v-model="productStore.formInputs.name" />
        </UFormField>

        <UFormField label="Description" name="description">
          <UTextarea v-model="productStore.formInputs.description" :rows="5" autoresize />
        </UFormField>

        <div class="grid grid-cols-1 gap-4 min-[920px]:grid-cols-2">
          <UFormField label="Select Category" name="category" required>
            <USelect
              v-model="productStore.formInputs.category"
              :items="categoryList"
              placeholder="Choose category"
            />
          </UFormField>
          <UFormField label="Price (in $)" name="price" required>
            <UInputNumber :min="1" v-model="productStore.formInputs.price" orientation="vertical" />
          </UFormField>

          <UFormField label="Discount %" name="discount">
            <UInputNumber
              :min="0"
              :max="100"
              v-model="productStore.formInputs.discount"
              orientation="vertical"
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

        <UFormField label="Tags" name="tags">
          <UInputTags
            v-model="productStore.formInputs.tags"
            placeholder="Add tags"
            addOnBlur
            addOnPaste
            addOnTab
          />
        </UFormField>
      </UPageCard>

      <UPageCard title="Add Images">
        <UFormField label="Main Image" name="image">
          <!-- Main Image -->
          <FileDropzone
            v-model="productStore.formInputs.image"
            upload-url="/upload/single"
            containerClass="w-[150px] aspect-square max-h-[150px]"
            helpText="'The ratio of 1:1 would be best."
          />

          <!-- Gallery Images -->
          <UFormField label="Gallery Images" name="images" class="my-4">
            <FileDropzone
              v-model="productStore.formInputs.images"
              upload-url="/upload/multiple"
              fieldName="images"
              containerClass="min-h-48"
              helpText="'The ratio of 1:1 would be best."
            />
          </UFormField>
        </UFormField>
      </UPageCard>
    </div>

    <div class="col-span-2 flex flex-col gap-4 min-[920px]:col-span-1">
      <UPageCard title="Add Colors">
        <div class="flex items-end gap-2">
          <UFormField label="Select Color" name="color" class="w-full max-w-[500px]">
            <UInput v-model="colorValue" :ui="{ trailing: 'pe-3' }">
              <template #trailing>
                <UPopover>
                  <span :style="selectedColor" class="border-default size-6 rounded-sm border-2" />

                  <template #content>
                    <UColorPicker v-model="colorValue" class="p-2" />
                  </template> </UPopover
              ></template>
            </UInput>
          </UFormField>

          <UButton leadingIcon="i-lucide-plus" label="Add" @click="addColor" />
        </div>

        <div class="mt-4 flex flex-col gap-2">
          <span class="font-semibold" v-if="productStore.formInputs.colors.length">
            Selected Colors ({{ productStore.formInputs.colors.length || 0 }})
          </span>
          <div class="flex flex-wrap items-center gap-2">
            <div
              class="border-default flex items-center rounded-md border bg-gray-50 px-3 py-1"
              v-for="color in productStore.formInputs.colors"
            >
              <div class="aspect-square w-[20px] shrink-0" :style="{ background: color }"></div>
              <UButton
                size="md"
                variant="link"
                class="ml-2"
                icon="i-lucide-x"
                @click="removeColor(color)"
              />
            </div>
          </div>
        </div>
      </UPageCard>

      <UPageCard title="Available Sizes">
        <div class="flex flex-wrap items-center gap-2">
          <UButton
            v-for="size in availableSizes"
            :label="size"
            @click="toggleSize(size)"
            :variant="productStore.formInputs.sizes.includes(size) ? 'solid' : 'outline'"
            :ui="{
              base: 'px-6 py-3',
              label: 'text-center m-auto',
            }"
          />
        </div>
      </UPageCard>

      <UPageCard title="Add To Collection">
        <UCheckbox
          v-model="productStore.formInputs.isNew"
          variant="card"
          label="New Arrivals"
          class="max-w-[500px]"
        />
        <UCheckbox
          v-model="productStore.formInputs.isFeatured"
          variant="card"
          label="Trending"
          class="max-w-[500px]"
        />
        <UCheckbox
          v-model="productStore.formInputs.isTrending"
          variant="card"
          label="Featured"
          class="max-w-[500px]"
        />
      </UPageCard>
    </div>

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
</template>

<script setup lang="ts">
import { useCategoryStore } from '@/stores/category.store'
import { useProductStore } from '@/stores/product.store'
import * as z from 'zod'
import FileDropzone from '~/components/ui/FileDropzone.vue'

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
const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXl', 'XXXl']
const colorValue = ref('#000')
const selectedColor = computed(() => ({ backgroundColor: colorValue.value }))

const addColor = () => {
  productStore.formInputs.colors.push(colorValue.value)
  colorValue.value = '#000'
}

const removeColor = (color: string) => {
  productStore.formInputs.colors.filter((color) => color !== color)
}

const toggleSize = (size: string) => {
  const exists = productStore.formInputs.sizes.includes(size)

  if (exists) {
    productStore.formInputs.sizes = productStore.formInputs.sizes.filter((s) => s !== size)
  } else {
    productStore.formInputs.sizes.push(size)
  }
}

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
    navigateTo(`/products/${response.data?.data?._id}/edit?tab=story`)
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
