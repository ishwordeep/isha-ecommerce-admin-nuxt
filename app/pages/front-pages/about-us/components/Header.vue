<script setup lang="ts">
interface Stat {
  number: string
  label: string
}

interface AboutHero {
  title: string
  subtitle: string
  buttonText: string
  buttonLink: string
  stats: Stat[]
}

// Reactive state
const about = ref<AboutHero>({
  title: 'About Fashion Store',
  subtitle:
    "We're not just a fashion retailer – we're a community of style enthusiasts dedicated to bringing you the finest clothing and accessories from around the world.",
  buttonText: 'Our Story',
  buttonLink: '/about',
  stats: [
    { number: '10+', label: 'Years Experience' },
    { number: '50K+', label: 'Happy Customers' },
    { number: '1000+', label: 'Products' },
    { number: '25+', label: 'Countries' },
  ],
})

// Add / Remove Stat
const addStat = () => {
  about.value.stats.push({ number: '', label: '' })
}
const removeStat = (index: number) => about.value.stats.splice(index, 1)

// Submit
const onSubmit = () => {
  console.log('About Hero saved →', about.value)
}
</script>

<template>
  <UForm @submit="onSubmit" id="about-hero-form">
    <UPageCard title="About Hero Section">
      <template #description>
        Customize the hero section of your About page — with elegant gradient background and
        floating decorative orbs.
      </template>

      <!-- Form Fields -->
      <div class="space-y-8">
        <!-- Title -->
        <UFormField label="Main Title" required>
          <UInput
            v-model="about.title"
            placeholder="About Fashion Store"
            size="xl"
            class="text-4xl font-bold"
          />
        </UFormField>

        <!-- Subtitle -->
        <UFormField label="Subtitle">
          <UTextarea
            v-model="about.subtitle"
            placeholder="We’re not just a fashion retailer..."
            autoresize
            :rows="4"
            size="lg"
          />
        </UFormField>

        <!-- Button -->
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <UFormField label="Button Text">
            <UInput v-model="about.buttonText" placeholder="Our Story" />
          </UFormField>
          <UFormField label="Button Link">
            <UInput v-model="about.buttonLink" placeholder="/about" />
          </UFormField>
        </div>

        <!-- Stats -->
        <div>
          <div class="mb-4 flex items-center justify-between">
            <h3 class="text-lg font-semibold">Stats</h3>
            <UButton size="sm" @click="addStat" icon="i-heroicons-plus" label="Add Stat" />
          </div>

          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <UCard v-for="(stat, index) in about.stats" :key="index" class="relative p-5">
              <UButton
                icon="i-heroicons-x-mark"
                size="xs"
                color="neutral"
                variant="ghost"
                class="absolute top-4 right-4"
                @click="removeStat(index)"
              />

              <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <UFormField label="Number">
                  <UInput v-model="stat.number" placeholder="10+" />
                </UFormField>
                <UFormField label="Label">
                  <UInput v-model="stat.label" placeholder="Years Experience" />
                </UFormField>
              </div>
            </UCard>
          </div>
        </div>
      </div>

      <!-- Debug -->
      <details class="mt-10 text-xs text-gray-500">
        <summary>Debug: Current data</summary>
        <pre>{{ about }}</pre>
      </details>
    </UPageCard>

    <!-- Action Buttons -->
    <div class="mt-10 flex gap-4">
      <UButton variant="outline">Skip</UButton>
      <UButton type="submit" form="about-hero-form"> Save & Next </UButton>
    </div>
  </UForm>
</template>
