<template>
  <Messages />
</template>

<script setup lang="ts">
import Messages from '~/views/messages/index.vue'
definePageMeta({
  layout: 'admin',
})

useSeoMeta({
  title: 'Messages',
  description: 'Manage your messages here',
  ogTitle: 'Messages',
})
</script>
