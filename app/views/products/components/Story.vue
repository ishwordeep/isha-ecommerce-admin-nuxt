<script setup lang="ts">
const productStore = useProductStore()

const onSubmit = async () => {
  const toast = useToast()

  try {
    await productStore.updateProduct(productStore.selectedProduct?._id!, {
      story: productStore.formInputs.story,
    })
    toast.add({
      color: 'success',
      title: 'Success',
      description: 'Product story updated successfully',
    })
    // Navigate to FAQs tab
    const router = useRouter()
    router.replace({ query: { ...router.currentRoute.value.query, tab: 'faqs' } })
  } catch (error) {
    toast.add({
      color: 'error',
      title: 'Error',
      description: 'Failed to update product story',
    })
  }
}
</script>

<template>
  <UPageCard title="Product Story">
    <UForm @submit="onSubmit">
      <UFormField name="story" class="mb-4">
        <TiptapEditor
          v-model="productStore.formInputs.story"
          placeholder="Enter shipping details"
          root-class="!min-h-[50dvh] !max-h-[60dvh]"
        />
      </UFormField>
    </UForm>
  </UPageCard>

  <div class="mt-4 flex">
    <UButton variant="outline" class="mr-2">Skip</UButton>
    <UButton @click="onSubmit">Save & Next</UButton>
  </div>
</template>
