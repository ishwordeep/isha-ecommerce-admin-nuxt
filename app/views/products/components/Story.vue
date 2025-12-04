<script setup lang="ts">
const inputs = reactive({
  story: '',
})

const onSubmit = () => {
  // Handle form submission logic here
  console.log('Form submitted with inputs:', inputs)
}
</script>

<template>
  <UPageCard title="Product Story">
    <UForm @submit="onSubmit">
      <UFormField name="story" class="mb-4">
        <UTextarea
          v-model="inputs.story"
          placeholder="Enter shipping details"
          autoresize
          :rows="8"
        />
      </UFormField>
    </UForm>
  </UPageCard>

  <div class="mt-4 flex">
    <UButton variant="outline" class="mr-2">Skip</UButton>
    <UButton @click="onSubmit">Save & Next</UButton>
  </div>
</template>
