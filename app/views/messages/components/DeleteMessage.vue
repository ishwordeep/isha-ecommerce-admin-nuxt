<template>
  <div>
    <UModal
      :open="open"
      :close-on-esc="!isDeleting"
      :close-on-backdrop-click="!isDeleting"
      @update:open="onOpenUpdate"
      title="Delete Message"
    >
      <template #body>
        <p class="text-sm text-gray-500">
          Are you sure you want to delete this message? This action cannot be undone.
        </p>
      </template>
      <template #footer>
        <div class="flex w-full justify-end space-x-2">
          <UButton variant="outline" @click="emit('update:open', false)" :disabled="isDeleting"
            >Cancel</UButton
          >
          <UButton color="error" @click="onSubmit" :loading="isDeleting">Delete</UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  open: {
    type: Boolean,
    required: true,
  },
})
const isDeleting = ref(false)
const messageStore = useMessageStore()
const toast = useToast()
const emit = defineEmits(['update:open'])

const onOpenUpdate = (val: boolean) => {
  // forward to parent and reset state when closing
  emit('update:open', val)
  if (!val) {
    isDeleting.value = false
  }
}

const onSubmit = async () => {
  if (isDeleting.value) return
  const id = messageStore.selectedMessage?._id
  if (!id) {
    // No selected category; just close
    emit('update:open', false)
    return
  }
  try {
    isDeleting.value = true
    const res = await messageStore.deleteMessage(id)
    if (res.data?.success) {
      toast.add({
        color: 'success',
        title: 'Success',
        description: 'Message deleted successfully',
      })
      emit('update:open', false)
    }
  } catch (e) {
    console.error('Failed to delete category:', e)
    toast.add({
      color: 'error',
      title: 'Error',
      description: 'Failed to delete message',
    })
  } finally {
    isDeleting.value = false
  }
}
</script>
