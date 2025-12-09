<script setup lang="ts">
const productStore = useProductStore()
const route = useRoute()
// Add a new empty FAQ block
const addFAQ = () => {
  productStore.formInputs.faqs.push({
    question: '',
    answer: '',
  })
}

// Remove FAQ
const removeFAQ = (index: number) => {
  productStore.formInputs.faqs.splice(index, 1)
}

const onSubmit = async () => {
  const id = route.params.id as string
  const payload = productStore.formInputs.faqs

  if (id) {
    await productStore.updateProductFaq(id, payload)
  }
}
</script>

<template>
  <UForm
    @submit="onSubmit"
    id="faqs-form"
    class="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4"
    v-if="productStore.formInputs.faqs.length > 0"
  >
    <template v-for="(faq, index) in productStore.formInputs.faqs || []" :key="index">
      <UCard :title="`FAQ ${index + 1}`" class="relative">
        <!-- Close Button -->
        <UButton
          color="neutral"
          variant="ghost"
          size="xs"
          class="absolute top-4 right-4 z-10"
          icon="i-heroicons-x-mark"
          @click="removeFAQ(index)"
        />

        <div class="border-b-default mb-4 flex items-center gap-3 border-b pb-2">
          <h3 class="text-lg font-semibold">FAQ {{ index + 1 }}</h3>
        </div>

        <div class="space-y-5">
          <!-- Question -->
          <UFormField label="Question" required>
            <UInput v-model="faq.question" placeholder="Enter question" size="lg" />
          </UFormField>

          <!-- Answer -->
          <UFormField label="Answer" required>
            <UTextarea v-model="faq.answer" placeholder="Enter answer" :rows="5" size="lg" />
          </UFormField>
        </div>
      </UCard>
    </template>
  </UForm>

  <!-- Empty State -->
  <div v-if="productStore.formInputs.faqs.length === 0" class="py-20 text-center">
    <p class="mb-6 text-xl text-gray-500">No FAQs added yet</p>
    <UButton size="xl" @click="addFAQ" icon="i-heroicons-plus"> Add Your First FAQ </UButton>
  </div>

  <!-- Action Buttons -->
  <div class="mt-10 flex flex-wrap gap-2">
    <UButton
      v-if="productStore.formInputs.faqs.length > 0"
      color="neutral"
      class="dark border-2 border-dashed border-gray-400"
      @click="addFAQ"
      icon="i-heroicons-plus"
    >
      Add FAQ
    </UButton>

    <UButton variant="outline" color="neutral"> Skip </UButton>

    <UButton type="submit" form="faqs-form"> Finish </UButton>
  </div>
</template>
