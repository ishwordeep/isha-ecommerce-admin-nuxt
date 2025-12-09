<template>
  <Settings />
</template>

<script setup lang="ts">
import Settings from '~/views/settings/index.vue'

definePageMeta({
  layout: 'admin',
})

useSeoMeta({
  title: 'Settings | Admin',
  description: 'Manage your settings here.',
})
</script>
