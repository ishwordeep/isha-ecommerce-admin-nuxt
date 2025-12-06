<!-- components/ContactDetailModal.vue -->
<script setup lang="ts">
const emit = defineEmits(['update:open'])

const ContactStatus = {
  NEW: 'NEW',
  IN_PROGRESS: 'IN_PROGRESS',
  RESOLVED: 'RESOLVED',
}

const props = defineProps({
  open: {
    type: Boolean,
    required: true,
  },
})

const toast = useToast()
// Use store actions (recommended)
const messageStore = useMessageStore()
const inputs = reactive({
  status: '',
  adminNotes: '',
})

const state = reactive({
  isUpdating: false,
  isResolving: false,
})

const modalOpen = computed({
  get: () => props.open,
  set: (val: boolean) => emit('update:open', val),
})

onMounted(() => {
  inputs.status = messageStore.selectedMessage?.status || 'NEW'
})

const markAsResolved = () => {
  messageStore.updateMessageStatus(messageStore.selectedMessage?._id || '', {
    status: ContactStatus.RESOLVED,
  })
  emit('update:open', false)
}

const updateMessageStatus = async () => {
  try {
    state.isUpdating = true
    const response = await messageStore.updateMessageStatus(
      messageStore.selectedMessage?._id || '',
      {
        status: inputs.status,
        adminNotes: inputs.adminNotes,
      }
    )
    if (response?.data?.success) {
      toast.add({
        color: 'success',
        title: 'Success',
        description: 'Message status updated successfully',
      })
      emit('update:open', false)
    }
  } catch (error) {
    toast.add({
      color: 'error',
      title: 'Error',
      description: 'Failed to update message status',
    })
  } finally {
    state.isUpdating = false
  }
}
</script>

<template>
  <UModal v-model:open="modalOpen" title="Message Detail">
    <template #body>
      <div class="space-y-6" v-if="messageStore.selectedMessage">
        <!-- Status Update -->
        <div class="rounded-lg bg-gray-50 p-4">
          <div class="flex w-full items-end gap-2">
            <UFormField label="Status" class="flex-1">
              <USelect
                v-model="inputs.status"
                :items="[
                  { label: 'New', value: 'NEW' },
                  { label: 'In Progress', value: 'IN_PROGRESS' },
                  { label: 'Resolved', value: 'RESOLVED' },
                ]"
              />
            </UFormField>
            <UButton class="self-end" color="primary" @click="updateMessageStatus">
              Update
            </UButton>
          </div>
          <UFormField label="Admin Note" class="mt-4">
            <UTextarea
              v-model="inputs.adminNotes"
              placeholder="Add an internal note regarding this message..."
              :rows="3"
            />
          </UFormField>
        </div>

        <!-- Customer Info -->
        <div>
          <h3 class="mb-3 font-bold">Customer Information</h3>
          <div class="space-y-4 rounded-lg bg-gray-50 p-4">
            <div class="flex items-center gap-3">
              <UIcon name="i-lucide-user" class="h-5 w-5 text-gray-500" />
              <div>
                <p class="text-xs text-gray-500">Name</p>
                <p class="font-medium">{{ messageStore.selectedMessage.name }}</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <UIcon name="i-lucide-mail" class="h-5 w-5 text-gray-500" />
              <div>
                <p class="text-xs text-gray-500">Email</p>
                <p class="font-medium">{{ messageStore.selectedMessage.email }}</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <UIcon name="i-lucide-phone" class="h-5 w-5 text-gray-500" />
              <div>
                <p class="text-xs text-gray-500">Phone</p>
                <p class="font-medium">{{ messageStore.selectedMessage.phone }}</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <UIcon name="i-lucide-calendar" class="h-5 w-5 text-gray-500" />
              <div>
                <p class="text-xs text-gray-500">Submitted</p>
                <p class="font-medium">{{ messageStore.selectedMessage.createdAt }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Message Details -->
        <div>
          <h3 class="mb-3 font-bold">Message Details</h3>
          <div class="rounded-lg bg-gray-50 p-4">
            <p class="mb-2 font-semibold capitalize">{{ messageStore.selectedMessage.subject }}</p>
            <p class="leading-relaxed text-gray-700">{{ messageStore.selectedMessage.message }}</p>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="border-t-gray-3s00 flex gap-3 border-t pt-4 max-sm:flex-col">
          <UButton
            class="flex-1 justify-center bg-green-600 hover:bg-green-700"
            @click="markAsResolved"
          >
            <UIcon name="i-lucide-check-circle" class="mr-2 h-5 w-5" />
            Mark as Resolved
          </UButton>
        </div>
      </div>
    </template>
  </UModal>
</template>
