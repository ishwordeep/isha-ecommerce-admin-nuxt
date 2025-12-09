<script setup lang="ts">
interface Statement {
  icon: string
  title: string
  description: string
  gradient: string // for the icon background
}

const statements = ref<Statement[]>([
  {
    icon: 'i-lucide-target',
    title: 'Our Mission',
    description:
      'To empower individuals to express their unique style through carefully curated fashion that combines quality, affordability, and sustainability.',
    gradient: 'from-blue-500 to-blue-600',
  },
  {
    icon: 'i-heroicons-sparkles',
    title: 'Our Vision',
    description:
      "To become the world's most trusted and loved fashion destination, setting new standards for customer experience and sustainable retail.",
    gradient: 'from-purple-500 to-purple-600',
  },
])

// Icon options (same as Core Values)
const iconOptions = [
  'i-lucide-target',
  'i-heroicons-sparkles',
  'i-heroicons-heart',
  'i-heroicons-light-bulb',
  'i-heroicons-globe-alt',
  'i-heroicons-shield-check',
  'i-heroicons-star',
  'i-heroicons-rocket-launch',
]

const gradients = [
  { label: 'Blue', value: 'from-blue-500 to-blue-600' },
  { label: 'Purple', value: 'from-purple-500 to-purple-600' },
  { label: 'Green', value: 'from-green-500 to-green-600' },
  { label: 'Pink', value: 'from-pink-500 to-pink-600' },
  { label: 'Orange', value: 'from-orange-500 to-orange-600' },
  { label: 'Teal', value: 'from-teal-500 to-teal-600' },
]

const aboutStore = useAboutStore()

const editableStatements = computed({
  get() {
    const items = aboutStore.formInputs.statements

    // If empty or less than 2 → fill with beautiful defaults
    if (!items || items.length === 0) {
      return [
        {
          icon: 'i-lucide-target',
          iconBackgroundColor: 'from-blue-500 to-blue-600',
          title: 'Our Mission',
          description:
            'To empower individuals to express their unique style through carefully curated fashion that combines quality, affordability, and sustainability.',
        },
        {
          icon: 'i-heroicons-sparkles',
          iconBackgroundColor: 'from-purple-500 to-purple-600',
          title: 'Our Vision',
          description:
            "To become the world's most trusted and loved fashion destination, setting new standards for customer experience and sustainable retail.",
        },
      ]
    }

    // If only 1 exists → add second
    if (items.length === 1) {
      items.push({
        icon: 'i-heroicons-sparkles',
        iconBackgroundColor: 'from-purple-500 to-purple-600',
        title: 'Our Vision',
        description: '',
      })
    }

    return items
  },
  set(newVal) {
    // Write back to store (important!)
    aboutStore.formInputs.statements = newVal
  },
})

const onSubmit = async () => {
  const toast = useToast()

  try {
    const res = await aboutStore.updateAbout({ statements: editableStatements.value })
    if (res?.data?.success) {
      toast.add({
        color: 'success',
        title: 'Success',
        description: 'Brand Philosophy section updated successfully.',
      })
    } else {
      toast.add({
        color: 'error',
        title: 'Error',
        description: 'Failed to update Brand Philosophy section.',
      })
    }
  } catch (error) {
    toast.add({
      color: 'error',
      title: 'Error',
      description: 'An unexpected error occurred while updating Brand Philosophy section.',
    })
  }
}
</script>

<template>
  <UForm @submit="onSubmit" id="brand-philosophy-form">
    <UPageCard title="Brand Philosophy">
      <!-- Live Preview – uses store data (will show defaults if empty) -->
      <div class="mb-10 grid gap-8 md:grid-cols-2">
        <div
          v-for="(item, i) in editableStatements"
          :key="i"
          class="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200"
        >
          <div class="mb-6 flex justify-center">
            <div
              :class="`flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br ${item.iconBackgroundColor} shadow-lg`"
            >
              <UIcon :name="item.icon" class="h-8 w-8 text-white" />
            </div>
          </div>
          <h3 class="mb-4 text-center text-2xl font-bold text-gray-900">
            {{ item.title || 'Untitled Statement' }}
          </h3>
          <p class="text-center leading-relaxed text-gray-600">
            {{ item.description || 'No description yet...' }}
          </p>
        </div>
      </div>

      <!-- Editable Form – always shows 2 cards -->
      <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
        <UCard
          v-for="(item, index) in editableStatements"
          :key="index"
          class="rounded-xl"
          variant="subtle"
        >
          <h4 class="mb-6 text-lg font-semibold">Statement {{ index + 1 }}</h4>

          <UFormField label="Icon" required class="mb-5">
            <USelectMenu
              v-model="item.icon"
              :items="iconOptions"
              :icon="item.icon"
              searchable
              placeholder="Choose an icon"
            >
              <template #item="{ item: icon }">
                <UIcon :name="icon" class="mr-3 h-5 w-5" />
                {{ icon }}
              </template>
            </USelectMenu>
          </UFormField>

          <UFormField label="Icon Background Color" required class="mb-5">
            <USelectMenu
              v-model="item.iconBackgroundColor"
              :items="gradients"
              value-key="value"
              option-key="label"
            >
              <template #item="{ item }">
                <div class="flex items-center gap-3">
                  <div :class="`h-8 w-8 rounded-lg bg-gradient-to-br ${item.value}`" />
                  <span>{{ item.label }}</span>
                </div>
              </template>
            </USelectMenu>
          </UFormField>

          <UFormField label="Title" required class="mb-5">
            <UInput v-model="item.title" size="lg" class="font-bold" />
          </UFormField>

          <UFormField label="Description" required>
            <UTextarea v-model="item.description" autoresize :rows="4" size="lg" />
          </UFormField>
        </UCard>
      </div>
    </UPageCard>

    <div class="mt-10 flex gap-4">
      <UButton type="submit" size="lg">Update Brand Philosophy</UButton>
    </div>
  </UForm>
</template>
