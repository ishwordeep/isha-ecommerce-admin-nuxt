<script setup lang="ts">
import TiptapEditor from '~/components/TiptapEditor.vue'
import { useHeaderStore } from '~/stores/header.store'

definePageMeta({
  layout: 'admin',
})

const headerStore = useHeaderStore()

onBeforeMount(() => {
  headerStore.setHeaders('Privacy Policy', 'Manage your privacy policy here')
})

useSeoMeta({
  title: 'Privacy Policy',
  description: 'Manage your privacy policy here',
  ogTitle: 'Privacy Policy',
})

const input = reactive({
  policy: '',
})
</script>
<template>
  <UForm class="flex flex-col gap-4">
    <UCard>
      <UFormField label="Privacy Policy">
        <TiptapEditor v-model="input.policy" />
      </UFormField>
    </UCard>
    <UButton class="w-max" type="submit" form="privacy-policy-form" color="primary">Save </UButton>
  </UForm>
</template>
