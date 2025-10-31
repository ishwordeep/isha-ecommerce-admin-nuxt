<template>
  <div>
    <UModal
      :open="open"
      :close-on-esc="!isDeleting"
      :close-on-backdrop-click="!isDeleting"
      @update:open="onOpenUpdate"
      title="Delete Category"
    >
      <template #body>
        <p class="text-sm text-gray-500">
          Are you sure you want to delete this category? This action cannot be undone.
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
const categoryStore = useCategoryStore()

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
  const id = categoryStore.selectedCategory?._id
  if (!id) {
    // No selected category; just close
    emit('update:open', false)
    return
  }
  try {
    isDeleting.value = true
    const res = await categoryStore.deleteCategory(id)
    if (!res?.error) {
      emit('update:open', false)
    }
  } catch (e) {
    console.error('Failed to delete category:', e)
  } finally {
    isDeleting.value = false
  }
}
</script>
