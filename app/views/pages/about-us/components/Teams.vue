<script setup lang="ts">
import * as z from 'zod'

interface TeamMember {
  name: string
  title: string
  description: string
  image: string
}

const team = ref<TeamMember[]>([])

const addMember = () => {
  team.value.push({
    name: '',
    title: '',
    description: '',
    image: '',
  })
}

const removeMember = (index: number) => {
  team.value.splice(index, 1)
}

// schema must match { team: TeamMember[] }
const schema = z.object({
  team: z.array(
    z.object({
      name: z.string().min(1, 'Name is required'),
      title: z.string().min(1, 'Title is required'),
      description: z.string().optional(),
      image: z.string().optional(),
    })
  ),
})

const onSubmit = () => {
  console.log('Team saved:', team.value)
}
</script>

<template>
  <UForm :schema="schema" :state="{ team }" @submit="onSubmit" id="team-member-form">
    <UPageCard title="Our Team">
      <template #description>
        Add your team members — perfect for "Meet the Team", "Founders", or "Leadership".
      </template>

      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <UCard v-for="(member, index) in team" :key="index" class="relative overflow-hidden">
          <!-- Remove -->
          <UButton
            icon="i-heroicons-x-mark-20-solid"
            color="neutral"
            variant="ghost"
            size="xs"
            class="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur"
            @click="removeMember(index)"
          />

          <div class="mt-4 space-y-4">
            <!-- Name -->
            <UFormField :name="`team.${index}.name`" label="Name" required>
              <UInput v-model="member.name" />
            </UFormField>

            <!-- Title -->
            <UFormField :name="`team.${index}.title`" label="Title / Role" required>
              <UInput v-model="member.title" />
            </UFormField>

            <!-- Description -->
            <UFormField :name="`team.${index}.description`" label="Short Bio">
              <UTextarea v-model="member.description" autoresize :rows="3" />
            </UFormField>

            <!-- Image -->
            <UFormField :name="`team.${index}.image`" label="Image">
              <UiFileDropzone
                v-model="member.image"
                container-class="aspect-square max-w-[200px]"
              />
            </UFormField>
          </div>

          <div class="mt-3 text-sm text-gray-500">Member #{{ index + 1 }}</div>
        </UCard>
      </div>

      <!-- Empty State -->
      <div
        v-if="team.length === 0"
        class="rounded-xl border-2 border-dashed border-gray-300 py-20 text-center"
      >
        <UIcon name="i-heroicons-users" class="mx-auto mb-4 h-16 w-16 text-gray-400" />
        <p class="mb-6 text-xl text-gray-500">No team members added yet</p>
        <UButton @click="addMember" icon="i-heroicons-plus"> Add Your First Team Member </UButton>
      </div>

      <!-- Add Member -->
      <div v-if="team.length > 0" class="mt-8 text-center">
        <UButton
          size="lg"
          color="neutral"
          variant="outline"
          class="border-dashed"
          @click="addMember"
          icon="i-heroicons-plus-circle"
        >
          Add Another Member
        </UButton>
      </div>
    </UPageCard>

    <!-- Actions -->
    <div class="mt-10 flex gap-4">
      <UButton variant="outline">Skip</UButton>
      <UButton type="submit" form="team-member-form">Save & Next</UButton>
    </div>
  </UForm>
</template>
