<template>
  <UModal
    :title="`${props.mode === 'add' ? 'Add' : 'Edit'} Slider`"
    v-model:open="modalOpen"
    @update:open="
      (val) => {
        if (!val) sliderStore.reset()
      }
    "
    :dismissible="false"
    :ui="{
      content: 'max-w-2xl',
    }"
  >
    <div v-show="fetching" class="flex h-full w-full items-center justify-center">
      <div
        class="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-r-transparent"
      ></div>
    </div>

    <template v-if="!fetching" #body>
      <UForm
        :schema="schema"
        :state="sliderStore.formInputs"
        class="flex flex-col gap-4 p-2"
        id="slider-form"
        @submit="onSubmit"
      >
        <UFormField label="Link" name="link">
          <UInput v-model="sliderStore.formInputs.link" />
        </UFormField>

        <UFormField label="Display Order" name="displayOrder">
          <UInputNumber
            :min="1"
            v-model="sliderStore.formInputs.displayOrder"
            orientation="vertical"
          />
        </UFormField>

        <UCheckbox
          size="xl"
          label="Enable Button"
          v-model="sliderStore.formInputs.isButtonEnabled"
          :ui="{
            root: 'flex items-center',
            label: 'text-sm',
          }"
        />

        <template v-if="sliderStore.formInputs.isButtonEnabled">
          <UFormField label="Button Text" name="buttonText">
            <UInput v-model="sliderStore.formInputs.button.title" />
          </UFormField>

          <UFormField label="Button Text Color" name="buttonTextColor">
            <UInput v-model="sliderStore.formInputs.button.textColor" :ui="{ trailing: 'pe-3' }">
              <template #trailing>
                <UPopover>
                  <span :style="textColor" class="border-default size-6 rounded-sm border-2" />

                  <template #content>
                    <UColorPicker v-model="sliderStore.formInputs.button.textColor" class="p-2" />
                  </template> </UPopover
              ></template>
            </UInput>
          </UFormField>

          <UFormField label="Button Background Color" name="buttonBackgroundColor">
            <UInput v-model="sliderStore.formInputs.button.bgColor" :ui="{ trailing: 'pe-3' }">
              <template #trailing>
                <UPopover>
                  <span :style="bgColor" class="border-default size-6 rounded-sm border-2" />

                  <template #content>
                    <UColorPicker v-model="sliderStore.formInputs.button.bgColor" class="p-2" />
                  </template> </UPopover
              ></template>
            </UInput>
          </UFormField>
        </template>
        <UFormField label="Image" name="image" required>
          <FileDropzone
            v-model="sliderStore.formInputs.image"
            upload-url="/upload/single"
            containerClass="w-full aspect-video"
            helpText="The ration of 16:9 would be best"
          />
        </UFormField>

        <UFormField label="Status" name="isActive">
          <URadioGroup
            indicator="hidden"
            v-model="sliderStore.formInputs.isActive"
            variant="card"
            :default-value="true"
            orientation="horizontal"
            :items="[
              { label: 'Active', value: true },
              { label: 'Inactive', value: false },
            ]"
            :ui="{ item: 'border-2' }"
          />
        </UFormField>
      </UForm>
    </template>
    <template v-if="!fetching" #footer="{ close }">
      <div class="flex w-full justify-end gap-2">
        <UButton :disabled="isSubmitting" label="Cancel" variant="outline" @click="close" />
        <UButton
          :loading="isSubmitting"
          label="Submit"
          type="submit"
          form="slider-form"
          :disabled="isSubmitting"
        />
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    mode?: 'add' | 'edit'
    open?: boolean
  }>(),
  {
    mode: 'add',
    open: false,
  }
)

import * as z from 'zod'
import { useSliderStore } from '~/stores/slider.store'
import FileDropzone from '~/components/ui/FileDropzone.vue'
const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
}>()
const sliderStore = useSliderStore()
const modalOpen = computed({
  get: () => props.open,
  set: (val: boolean) => emit('update:open', val),
})
const toast = useToast()
const isSubmitting = ref(false)
const fetching = ref(false)
const schema = z.object({
  link: z.string().url().or(z.literal('')).optional(),
  displayOrder: z.number().min(1, 'Display order must be at least 1'),
  isActive: z.boolean(),
  image: z.string().min(1, 'Select atleast 1 image'),
})

const textColor = computed(() => ({ backgroundColor: sliderStore.formInputs.button.textColor }))
const bgColor = computed(() => ({ backgroundColor: sliderStore.formInputs.button.bgColor }))

watch(
  () => props.open,
  async (nowOpen) => {
    if (!nowOpen) return

    if (props.mode === 'add') {
      sliderStore.initializeForAdd()
      return
    }

    // ----- edit mode -----
    if (!sliderStore.selectedSlider?._id) {
      toast.add({
        color: 'error',
        title: 'Missing ID',
        description: 'Slider ID is required for edit mode.',
      })
      emit('update:open', false)
      return
    }

    fetching.value = true
    try {
      await sliderStore.initializeForEdit(sliderStore.selectedSlider?._id)
    } catch (err) {
      toast.add({
        color: 'error',
        title: 'Failed to load',
        description: 'Could not load the slider.',
      })
      emit('update:open', false)
    } finally {
      fetching.value = false
    }
  },
  { immediate: true } // run on first render if already open
)

const onSubmit = async () => {
  isSubmitting.value = true
  const isAdd = props.mode === 'add'
  const action = isAdd
    ? () => sliderStore.addSlider(sliderStore.formInputs)
    : () => sliderStore.updateSlider(sliderStore.selectedSlider?._id!, sliderStore.formInputs)

  const response = await action()

  if (response?.data?.success) {
    toast.add({
      color: 'success',
      title: 'Success',
      description: `Slider ${isAdd ? 'added' : 'updated'} successfully`,
    })
    emit('update:open', false)
    sliderStore.reset()
  } else {
    toast.add({
      color: 'error',
      title: 'Error',
      description: `Failed to ${isAdd ? 'add' : 'update'} slider`,
    })
  }

  isSubmitting.value = false
}
</script>
