<script setup lang="ts">
import TermsOfService from '~/views/pages/terms-of-service/index.vue'

definePageMeta({
  layout: 'admin',
})

useSeoMeta({
  title: 'Terms of Service',
  description: 'Manage your terms of service here',
  ogTitle: 'Terms of Service',
})
</script>
<template>
  <TermsOfService />
</template>
