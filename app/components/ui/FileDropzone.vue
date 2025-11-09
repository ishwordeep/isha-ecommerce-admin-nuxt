<template>
  <div>
    <!-- Dropzone Area -->
    <div
      class="relative flex cursor-pointer items-center justify-center rounded-xl border-gray-300 text-center transition hover:bg-gray-50 dark:hover:bg-gray-800"
      :class="[containerClass, isMultiple || !singleImageUrl ? 'border-2 border-dashed' : '']"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
      @click="fileInput?.click()"
    >
      <!-- Single Image Preview -->
      <template v-if="!isMultiple && singleImageUrl">
        <img :src="singleImageUrl" alt="Uploaded" class="h-full w-full rounded-lg object-cover" />
        <UButton
          class="absolute -top-2 -right-2 rounded-full"
          size="xs"
          square
          @click.stop="remove(0)"
          icon="i-lucide-x"
        />
      </template>

      <!-- Dropzone Content (no image yet) -->
      <template v-else-if="!isMultiple || !multipleImageUrls.length">
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

      <!-- Multiple Images - Show in dropzone if exists -->
      <template v-else-if="isMultiple && multipleImageUrls.length">
        <div class="m-auto flex flex-col items-center justify-center gap-2">
          <UIcon name="i-lucide-upload" class="m-auto h-8 w-8 text-gray-500" />
          <p class="text-sm text-gray-600 dark:text-gray-400">
            <span v-if="!isDragging">Click or drag to add more images</span>
            <span v-else>Drop to add more images</span>
          </p>
        </div>
      </template>

      <!-- Hidden File Input -->
      <input
        ref="fileInput"
        type="file"
        :multiple="isMultiple"
        accept="image/*"
        class="hidden"
        @change="handleSelect"
      />

      <!-- Uploading Overlay -->
      <div
        v-if="isUploading"
        class="absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-black/30"
      >
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
    <span class="text-muted mb-1 text-xs italic" v-if="helpText"> {{ helpText }} </span>

    <span class="block text-xs text-red-500 italic" v-if="error"> {{ error }} </span>

    <!-- Multiple Image Previews -->
    <div v-if="isMultiple && multipleImageUrls.length" class="mt-4 flex flex-wrap gap-3">
      <div
        v-for="(url, idx) in multipleImageUrls"
        :key="idx"
        class="relative h-32 w-32 rounded-md border-2 border-gray-200"
      >
        <img :src="url" alt="Uploaded" class="h-full w-full rounded-md object-cover" />
        <UButton
          class="absolute -top-2 -right-2 rounded-full"
          @click="remove(idx)"
          icon="i-lucide-x"
          size="xs"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { UIcon } from '#components'
import axios from 'axios'

interface Props {
  modelValue: string[] | string
  uploadUrl: string
  fieldName?: string
  containerClass?: string
  message?: string
  showMessage?: boolean
  helpText?: string
}

const props = withDefaults(defineProps<Props>(), {
  fieldName: 'image',
  showMessage: false,
})

const emit = defineEmits(['update:modelValue'])

const fileInput = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const isUploading = ref(false)
const config = useRuntimeConfig()
const error = ref<string | null>(null)
// Determine if it's multiple or single
const isMultiple = computed(() => Array.isArray(props.modelValue))

// Get the single image URL
const singleImageUrl = computed(() => {
  if (isMultiple.value) return ''
  return typeof props.modelValue === 'string' ? props.modelValue : ''
})

// Get multiple image URLs
const multipleImageUrls = computed(() => {
  if (!isMultiple.value) return []
  return Array.isArray(props.modelValue) ? props.modelValue : []
})

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
  error.value = null
  try {
    const formData = new FormData()

    // Append files based on mode
    if (isMultiple.value) {
      // For multiple files, append each with the same field name
      for (const file of files) {
        formData.append(props.fieldName, file)
      }
    } else {
      // For single file, just append one
      formData.append(props.fieldName, files[0])
    }

    const { data: response } = await axios.post(
      `${config.public.apiUrl}${props.uploadUrl}`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    )

    // Handle the response format: { success: true, data: "url" } or { success: true, data: ["url1", "url2"] }
    if (!response.success) {
      throw new Error(response.message || 'Upload failed')
      error.value = response?.message
    }

    const uploadedData = response.data

    // Handle both single URL (string) and multiple URLs (array)
    let urls: string[] = []

    if (typeof uploadedData === 'string') {
      urls = [uploadedData]
    } else if (Array.isArray(uploadedData)) {
      urls = uploadedData
    } else {
      throw new Error('Invalid response format')
    }

    if (!urls.length) throw new Error('No URLs returned from upload')

    // Update the model value
    if (isMultiple.value) {
      const currentUrls = Array.isArray(props.modelValue) ? props.modelValue : []
      emit('update:modelValue', [...currentUrls, ...urls])
    } else {
      // For single mode, just use the first URL
      emit('update:modelValue', urls[0])
    }
  } catch (err: any) {
    console.error('Upload failed:', err)
    // You can emit an error event or show a toast notification here
    // emit('upload-error', err.message)
  } finally {
    isUploading.value = false
    // Reset file input
    if (fileInput.value) {
      fileInput.value.value = ''
    }
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
