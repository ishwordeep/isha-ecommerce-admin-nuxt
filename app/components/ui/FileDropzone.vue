<template>
  <div>
    <!-- Dropzone Area -->
    <div
      class="relative flex cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-gray-300 p-6 text-center transition hover:bg-gray-50 dark:hover:bg-gray-800"
      :class="containerClass"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
      @click="fileInput?.click()"
    >
      <!-- Single Image Preview -->
      <template v-if="!isMultiple && modelValue?.length">
        <img :src="modelValue[0]" alt="Uploaded" class="h-64 w-full rounded-lg object-cover" />
        <button
          class="absolute top-2 right-2 rounded-full bg-black/60 p-1 text-white"
          @click.stop="remove(0)"
        >
          ✕
        </button>
      </template>

      <!-- Dropzone Content (no image yet) -->
      <template v-else>
        <div class="m-auto flex flex-col items-center justify-center gap-2">
          <UIcon name="i-lucide-upload" class="m-auto h-8 w-8 text-gray-500" />
          <p class="text-sm text-gray-600 dark:text-gray-400" v-if="showMessage">
            <span v-if="!isDragging && message">{{ message }}</span>
            <span v-else-if="!isDragging"
              >Drag & drop {{ isMultiple ? 'files' : 'an image' }} here</span
            >
            <span v-else>Drop {{ isMultiple ? 'files' : 'image' }} to upload</span>
          </p>
        </div>
      </template>

      <!-- Hidden File Input -->
      <input
        ref="fileInput"
        type="file"
        :multiple="isMultiple"
        class="hidden"
        @change="handleSelect"
      />

      <!-- Uploading Overlay -->
      <div
        v-if="isUploading"
        class="absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-black/30"
      >
        <!-- inline spinner -->
        <svg
          class="h-8 w-8 animate-spin text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
        <p class="mt-2 text-sm text-white">Uploading...</p>
      </div>
    </div>

    <!-- Multiple Image Previews -->
    <div v-if="isMultiple && modelValue?.length" class="mt-4 flex flex-wrap gap-3">
      <div
        v-for="(url, idx) in modelValue"
        :key="idx"
        class="relative h-32 w-32 overflow-hidden rounded-lg"
      >
        <img :src="url" alt="Uploaded" class="h-full w-full object-cover" />
        <button
          class="absolute top-1 right-1 rounded-full bg-black/50 p-1 text-white"
          @click="remove(idx)"
        >
          ✕
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { UButton, UIcon } from '#components'
import axios from 'axios'

interface Props {
  modelValue: string[] | string
  uploadUrl: string
  fieldName?: string
  containerClass?: string
  message?: string
  showMessage?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  fieldName: 'file',
  showMessage: false,
})

const emit = defineEmits(['update:modelValue'])

const fileInput = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const isUploading = ref(false)
const config = useRuntimeConfig()
// ✅ Determine if it’s multiple or single
const isMultiple = computed(() => Array.isArray(props.modelValue))

const handleSelect = (e: Event) => {
  const files = (e.target as HTMLInputElement).files
  if (files?.length) uploadFiles(Array.from(files))
}

const handleDrop = (e: DragEvent) => {
  isDragging.value = false
  const files = Array.from(e.dataTransfer?.files || [])
  uploadFiles(files)
}

const uploadFiles = async (files: File[]) => {
  if (!files.length) return
  isUploading.value = true

  try {
    const formData = new FormData()
    for (const file of files) {
      formData.append(props.fieldName, file)
    }

    const { data } = await axios.post(`${config.public.apiUrl}${props.uploadUrl}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    // Support various API return formats
    const urls = data?.urls || data?.data?.urls || [data?.url || data?.data?.url].filter(Boolean)

    if (!urls.length) throw new Error('No URLs returned from upload')

    if (isMultiple.value) {
      const newUrls = Array.isArray(props.modelValue) ? [...props.modelValue, ...urls] : urls
      emit('update:modelValue', newUrls)
    } else {
      emit('update:modelValue', urls[0])
    }
  } catch (err) {
    console.error('Upload failed:', err)
  } finally {
    isUploading.value = false
  }
}

const remove = (index: number) => {
  if (isMultiple.value) {
    const updated = [...(props.modelValue as string[])]
    updated.splice(index, 1)
    emit('update:modelValue', updated)
  } else {
    emit('update:modelValue', '')
  }
}
</script>
