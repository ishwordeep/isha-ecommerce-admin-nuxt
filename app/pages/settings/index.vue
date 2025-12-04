<template>
  <Settings />
</template>

<script setup lang="ts">
import Settings from '~/views/settings/index.vue'

definePageMeta({
  layout: 'admin',
  name: 'Settings',
})

useSeoMeta({
  title: 'Settings',
  description: 'Manage your settings here.',
})
</script>
