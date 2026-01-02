<script setup lang="ts">
interface CoreValue {
  icon: string
  title: string
  description: string
  gradient: string
}

const values = ref<CoreValue[]>([])

// Popular icons for quick selection
const iconOptions = [
  'i-heroicons-heart',
  'i-heroicons-trophy',
  'i-lucide-leaf',
  'i-heroicons-shield-check',
  'i-heroicons-star',
  'i-heroicons-light-bulb',
  'i-heroicons-users',
  'i-heroicons-globe-alt',
  'i-heroicons-sparkles',
  'i-heroicons-rocket-launch',
]

// Gradient presets (feel free to add more)
const gradients = [
  { label: 'Pink', value: 'from-pink-500 to-pink-600' },
  { label: 'Blue', value: 'from-blue-500 to-blue-600' },
  { label: 'Green', value: 'from-green-500 to-green-600' },
  { label: 'Purple', value: 'from-purple-500 to-purple-600' },
  { label: 'Orange', value: 'from-orange-500 to-orange-600' },
  { label: 'Teal', value: 'from-teal-500 to-teal-600' },
  { label: 'Red', value: 'from-red-500 to-red-600' },
  { label: 'Indigo', value: 'from-indigo-500 to-indigo-600' },
]

const aboutStore = useAboutStore()

// Add new value block
const addValue = () => {
  aboutStore.formInputs.coreValues.push({
    icon: 'i-heroicons-heart',
    title: '',
    description: '',
    color: 'from-pink-500 to-pink-600',
  })
}

// Remove
const removeValue = (index: number) => {
  aboutStore.formInputs.coreValues.splice(index, 1)
}

// Submit
const onSubmit = () => {
  const toast = useToast()

  try {
    aboutStore.updateAbout({ coreValues: aboutStore.formInputs.coreValues })
    toast.add({
      color: 'success',
      title: 'Success',
      description: 'Core Values updated successfully.',
    })
  } catch (error) {
    toast.add({
      color: 'error',
      title: 'Error',
      description: 'An error occurred while updating Core Values.',
    })
  }
}
</script>

<template>
  <UForm @submit="onSubmit" id="core-values-form">
    <UPageCard title="Our Core Values">
      <template #description>
        Define the principles that guide your brand. These will appear in a beautiful grid with
        icons and gradients.
      </template>

      <!-- Values Grid -->
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <UCard
          v-for="(value, index) in aboutStore.formInputs.coreValues"
          :key="index"
          class="relative overflow-hidden"
        >
          <!-- Remove Button -->
          <UButton
            icon="i-heroicons-x-mark-20-solid"
            color="neutral"
            variant="ghost"
            size="xs"
            class="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur"
            @click="removeValue(index)"
          />

          <!-- Icon + Gradient Preview -->
          <div class="mb-5 flex justify-center">
            <div
              :class="`flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${value.color} shadow-lg`"
            >
              <UIcon :name="value.icon" class="h-10 w-10 text-white" />
            </div>
          </div>

          <!-- Icon Selector -->
          <UFormField label="Icon" required class="mb-4">
            <USelectMenu
              :icon="value.icon"
              v-model="value.icon"
              :items="iconOptions"
              searchable
              class="w-full"
            >
              <template #item="{ item: icon }">
                <UIcon :name="icon" class="mr-3 h-5 w-5" />
                {{ icon }}
              </template>
            </USelectMenu>
          </UFormField>

          <!-- Gradient Selector -->
          <UFormField label="Color Gradient" required class="mb-4">
            <USelectMenu
              v-model="value.color"
              :items="gradients"
              searchable
              class="w-full"
              value-key="value"
            />
          </UFormField>

          <!-- Title -->
          <UFormField label="Title" required class="mb-4">
            <UInput
              v-model="value.title"
              placeholder="Customer First"
              size="lg"
              class="font-bold"
            />
          </UFormField>

          <!-- Description -->
          <UFormField label="Description">
            <UTextarea
              v-model="value.description"
              placeholder="We put our customers at the heart of everything we do..."
              autoresize
              :rows="4"
              size="lg"
            />
          </UFormField>

          <div class="mt-3 text-sm text-gray-500">Value #{{ index + 1 }}</div>
        </UCard>
      </div>

      <!-- Empty State -->
      <div
        v-if="aboutStore.formInputs.coreValues.length === 0"
        class="rounded-xl border-2 border-dashed border-gray-300 py-20 text-center"
      >
        <UIcon name="i-heroicons-heart" class="mx-auto mb-4 h-16 w-16 text-gray-400" />
        <p class="mb-6 text-xl text-gray-500">No core values added yet</p>
        <UButton size="xl" @click="addValue" icon="i-heroicons-plus">
          Add Your First Value
        </UButton>
      </div>

      <!-- Add Another -->
      <div v-if="aboutStore.formInputs.coreValues.length > 0" class="mt-8 text-center">
        <UButton
          size="lg"
          color="neutral"
          variant="outline"
          class="border-dashed"
          @click="addValue"
          icon="i-heroicons-plus-circle"
        >
          Add Another Value
        </UButton>
      </div>
    </UPageCard>
    <!-- Action Buttons -->
    <div class="mt-10 flex gap-4">
      <UButton @click="onSubmit"> Update Core Values </UButton>
    </div>
  </UForm>
</template>
