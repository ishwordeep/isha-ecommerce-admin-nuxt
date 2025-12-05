<script setup lang="ts">
import { useHeaderStore } from '~/stores/header.store'

definePageMeta({
  layout: 'admin',
})

const headerStore = useHeaderStore()

onBeforeMount(() => {
  headerStore.setHeaders('Terms of Service', 'Manage your terms of service here')
})

const input = reactive({
  terms: '',
})

useSeoMeta({
  title: 'Terms of Service',
  description: 'Manage your terms of service here',
  ogTitle: 'Terms of Service',
})
</script>
<template>
  <UForm class="flex flex-col gap-4">
    <UCard>
      <UFormField label="Terms of Service">
        <TiptapEditor v-model="input.terms" />
      </UFormField>
    </UCard>
    <UButton class="w-max" type="submit" form="terms-of-service-form" color="primary"
      >Save
    </UButton>
  </UForm>
</template>
