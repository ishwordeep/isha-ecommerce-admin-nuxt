<template>
  <UPageCard class="p-4">
    <UForm
      :schema="schema"
      :state="inputs"
      id="product-form"
      @submit="onSubmit"
      class="flex flex-col gap-4"
    >
      <!--Product Information-->
      <UCollapsible class="flex flex-col gap-4" default-open>
        <UButton
          class="group rounded-none border-0 bg-gray-100 hover:bg-gray-100/70 active:bg-gray-100/70"
          label="Product Information"
          variant="soft"
          trailing-icon="i-lucide-chevron-down"
          :ui="{
            trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200',
          }"
          block
        />

        <template #content>
          <div class="4xl:grid-cols-4 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            <!--Name-->
            <UFormField label="Name" name="name" required>
              <UInput v-model="inputs.name" />
            </UFormField>

            <!--Category-->
            <UFormField label="Select Category" name="category">
              <USelect
                v-model="inputs.category"
                :items="[
                  { label: 'Category1', value: '68e657c08089c27e8c94de80' },
                  { label: 'Category 2', value: '68e51e6918ad38b46a2d87a7' },
                ]"
              />
            </UFormField>

            <!--Price-->
            <UFormField label="Price" name="price" required>
              <UInputNumber :min="1" v-model="inputs.price" orientation="vertical" />
            </UFormField>
          </div>
          <!--Description-->
          <UFormField class="my-6" label="Description" name="description">
            <UTextarea v-model="inputs.description" :maxrows="5" autoresize />
          </UFormField>
          <div
            class="4xl:grid-cols-4 grid grid-cols-1 items-start gap-6 sm:grid-cols-2 xl:grid-cols-3"
          >
            <!--Colors-->
            <UFormField label="Colors" name="colors">
              <UInputTags v-model="inputs.colors" addOnBlur addOnPaste addOnTab />
            </UFormField>

            <!--Sizes-->
            <UFormField label="Sizes" name="sizes">
              <UInputTags v-model="inputs.sizes" addOnBlur addOnPaste addOnTab />
            </UFormField>

            <!--Tags-->
            <UFormField label="Tags" required>
              <UInputTags v-model="inputs.tags" />
            </UFormField>

            <!--isNew-->
            <UFormField label="Is New?" name="isNew">
              <UCheckbox v-model="inputs.isNew" variant="card" label="Is New?" class="max-w-max" />
            </UFormField>

            <!--isFeatured-->
            <UFormField label="Is Featured?" name="isFeatured">
              <UCheckbox
                v-model="inputs.isFeatured"
                variant="card"
                label="Is Featured?"
                class="max-w-max"
              />
            </UFormField>

            <!--isTrending-->
            <UFormField label="Is Trending?" name="isTrending">
              <UCheckbox
                v-model="inputs.isTrending"
                variant="card"
                label="Is Trending?"
                class="max-w-max"
              />
            </UFormField>

            <!--Image-->
            <UFormField label="Image" name="image">
              <FileDropzone
                v-model="inputs.image"
                upload-url="/upload"
                containerClass="w-[150px] aspect-square"
              />
            </UFormField>

            <!--Status-->
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
          </div>

          <UFormField label="Images" name="images" class="my-4">
            <FileDropzone v-model="inputs.images" upload-url="/upload" containerClass="min-h-48" />
          </UFormField>
        </template>
      </UCollapsible>
      <!--Product Information-->
    </UForm>

    <div class="flex space-x-2">
      <UButton type="submit" form="product-form" label="Submit" :loading="isSubmitting" />
      <UButton type="button" label="Reset" variant="outline" @click="resetForm" />
    </div>
  </UPageCard>
</template>

<script setup lang="ts">
import * as z from 'zod'
import { useHeaderStore } from '~/stores/header.store'
import FileDropzone from '~/components/ui/FileDropzone.vue'
definePageMeta({
  layout: 'admin',
})

const headerStore = useHeaderStore()

onBeforeMount(() => {
  headerStore.setHeaders('Add Product', 'Add your product here')
})

useSeoMeta({
  title: 'Add Product',
  description: 'Add your products here',
  ogTitle: 'Add Product',
})
const value = ref<File[]>([])
const isSubmitting = ref(false)
const productStore = useProductStore()
const schema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(100, 'Name must be at most 100 characters'),
  description: z.string(),
  price: z.number().min(1, 'Price is required'),
  discount: z
    .number()
    .min(0, 'Discount percentage cannot be negative')
    .max(100, 'Discount percentage cannot be more than 100'),
  category: z.string().min(1, 'Category is required'),
  isActive: z.boolean(),
  isNew: z.boolean(),
  isFeatured: z.boolean(),
  isTrending: z.boolean(),
  tags: z.array(z.string()),
  image: z.string(),
  images: z.array(z.string()),
  colors: z.array(z.string()),
  sizes: z.array(z.string()),
})
type InputFields = z.output<typeof schema>

const inputs = reactive<InputFields>({
  name: '',
  price: 0,
  discount: 0,
  description: '',
  isActive: true,
  isNew: true,
  isFeatured: false,
  isTrending: false,
  tags: [],
  category: '',
  image: '',
  images: [],
  colors: [],
  sizes: [],
})

const resetForm = () => {
  productStore.reset()
}

const onSubmit = async () => {
  isSubmitting.value = true
  const response = await productStore.addProduct(inputs)
  console.log(response)
  isSubmitting.value = false
  resetForm()
}
</script>
