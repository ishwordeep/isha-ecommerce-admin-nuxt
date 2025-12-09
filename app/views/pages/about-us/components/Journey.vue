<script setup lang="ts">
interface StoryItem {
  year: string
  milestone: string
  description: string
}

const stories = ref<StoryItem[]>([])
const aboutStore = useAboutStore()
// Add new empty story block
const addStory = () => {
  aboutStore.formInputs.productStory.push({
    year: '',
    milestoneTitle: '',
    description: '',
  })
}

// Remove story
const removeStory = (index: number) => {
  aboutStore.formInputs.productStory.splice(index, 1)
}

// Submit handler (you can send this array to API)
const onSubmit = async () => {
  console.log('Product Story saved:', aboutStore.formInputs)
  const toast = useToast()
  try {
    const res = await aboutStore.updateAbout({ productStory: aboutStore.formInputs.productStory })
    if (res?.data?.success) {
      toast.add({
        color: 'success',
        title: 'Success',
        description: 'Product Story section updated successfully.',
      })
    } else {
      toast.add({
        color: 'error',
        title: 'Error',
        description: 'Failed to update Product Story section.',
      })
    }
  } catch (error) {
    toast.add({
      color: 'error',
      title: 'Error',
      description: 'An unexpected error occurred while updating Product Story section.',
    })
  }
}
</script>

<template>
  <UPageCard title="Product Story">
    <template #description> Add your brand journey, milestones, or "Our Story" timeline. </template>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <!-- Story Blocks -->
      <UCard
        v-for="(story, index) in aboutStore.formInputs.productStory"
        :key="index"
        class="relative"
      >
        <!-- Remove Button -->
        <UButton
          icon="i-heroicons-x-mark-20-solid"
          color="neutral"
          variant="ghost"
          size="xs"
          class="absolute top-4 right-4 z-10"
          @click="removeStory(index)"
        />

        <UForm class="grid grid-cols-1 gap-4 md:grid-cols-3">
          <!-- Year -->
          <UFormField label="Year" required>
            <UInput
              v-model="story.year"
              placeholder="2024"
              class="text-center font-semibold md:text-left"
            />
          </UFormField>

          <!-- Milestone Title -->
          <UFormField label="Milestone / Title" required class="md:col-span-2">
            <UInput
              v-model="story.milestoneTitle"
              placeholder="e.g. Launched First Product, Raised Series A, Hit 1M Users"
            />
          </UFormField>
        </UForm>

        <!-- Description -->
        <UFormField label="Description" class="mt-4">
          <UTextarea
            v-model="story.description"
            placeholder="Tell the story behind this milestone..."
            autoresize
            :rows="4"
          />
        </UFormField>

        <div class="mt-2 text-sm text-gray-500">Story #{{ index + 1 }}</div>
      </UCard>
    </div>
    <!-- Empty State -->
    <div
      v-if="aboutStore.formInputs.productStory.length === 0"
      class="rounded-xl border-2 border-dashed border-gray-300 py-16 text-center"
    >
      <UIcon name="i-heroicons-flag" class="mx-auto mb-4 h-16 w-16 text-gray-400" />

      <p class="mb-4 text-xl text-gray-500">No story added yet</p>
      <UButton size="lg" @click="addStory" icon="i-heroicons-plus">
        Add Your First Milestone
      </UButton>
    </div>

    <!-- Add Button (when already have some) -->
    <div v-if="aboutStore.formInputs.productStory.length > 0" class="mt-6 text-center">
      <UButton
        size="lg"
        color="neutral"
        variant="outline"
        class="border-dashed"
        @click="addStory"
        icon="i-heroicons-plus-circle"
      >
        Add Another Milestone
      </UButton>
    </div>

    <!-- Debug (remove in production) -->
    <details class="mt-8 text-xs text-gray-500">
      <summary>Debug: Current stories array</summary>
      <pre>{{ aboutStore.formInputs.productStory }}</pre>
    </details>
  </UPageCard>

  <!-- Action Buttons -->
  <div class="mt-10 flex gap-3">
    <UButton @click="onSubmit">Update Milestone </UButton>
  </div>
</template>
