<script setup lang="ts">
import PrivacyPolicy from '~/views/pages/privacy-policy/index.vue'

definePageMeta({
  layout: 'admin',
})

useSeoMeta({
  title: 'Privacy Policy',
  description: 'Manage your privacy policy here',
  ogTitle: 'Privacy Policy',
})
</script>
<template>
  <PrivacyPolicy />
</template>
