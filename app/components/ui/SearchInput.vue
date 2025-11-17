<template>
  <UInput
    ref="input"
    v-model="innerValue"
    icon="i-lucide-search"
    placeholder="Search..."
    :loading="isPending"
    @blur="onBlur"
    class="max-w-[200px] min-w-[100px] sm:max-w-[250px] sm:min-w-[250px]"
  />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

// Props
const props = withDefaults(
  defineProps<{
    modelValue?: string
    delay?: number
    loading?: boolean
  }>(),
  {
    modelValue: '',
    delay: 300,
    loading: false,
  }
)

// Emits
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'search', value: string): void
  (e: 'blur'): void
}>()

const innerValue = ref(props.modelValue)
const isPending = ref(false)
let debounceTimer: ReturnType<typeof setTimeout> | null = null

// Manual debounce function
const debouncedSearch = (value: string) => {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }

  debounceTimer = setTimeout(() => {
    isPending.value = false
    emit('search', value)
  }, props.delay)
}

watch(
  () => props.modelValue,
  (val) => {
    if (val !== innerValue.value) {
      innerValue.value = val ?? ''
    }
  }
)

watch(innerValue, (newVal) => {
  emit('update:modelValue', newVal)
  if (props.loading) {
    isPending.value = true
  }
  debouncedSearch(newVal)
})

const onBlur = () => {
  emit('blur')
}
</script>
