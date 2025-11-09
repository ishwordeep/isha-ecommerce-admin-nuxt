import { defineStore } from 'pinia'
import { ref, readonly, reactive, computed } from 'vue'
import SliderService from '~/services/slider.service'
import type { SliderInterface } from '~/services/slider.service'
import type { PaginationInterface } from '~/services/index.interface'

type Mode = 'add' | 'edit'

export interface SliderForm {
  isActive: boolean
  image: string
  displayOrder: number
  isButtonEnabled: boolean
  button: {
    link: string
    title: string
    textColor: string
    bgColor: string
  }
}

const mapProductToForm = (slider: SliderInterface | null): SliderForm => {
  if (!slider) return emptyForm()

  return {
    isActive: slider.isActive ?? true,
    image: slider.image ?? '',
    displayOrder: slider.displayOrder ?? 0,
    isButtonEnabled: slider.isButtonEnabled ?? false,
    button: {
      link: slider.button?.link ?? '',
      title: slider.button?.title ?? 'Shop Now',
      textColor: slider.button?.textColor ?? '#FFFFFF',
      bgColor: slider.button?.bgColor ?? '#000000',
    },
  }
}

const emptyForm = (): SliderForm => ({
  isActive: true,
  image: '',
  displayOrder: 0,
  isButtonEnabled: false,
  button: {
    link: '',
    title: 'Shop Now',
    textColor: '#FFFFFF',
    bgColor: '#000000',
  },
})

export const useSliderStore = defineStore('slider', () => {
  const sliders = ref<SliderInterface[] | null>(null)
  const isLoading = ref(false)
  const selectedSlider = ref<SliderInterface | null>(null)
  const pagination = ref<PaginationInterface | null>(null)
  const list = ref<SliderInterface[] | null>(null)
  const mode = ref<Mode>('add')
  const formInputs = reactive<SliderForm>(emptyForm())

  const isAddMode = computed(() => mode.value === 'add')
  const isEditMode = computed(() => mode.value === 'edit')

  const initializeForAdd = () => {
    mode.value = 'add'
    Object.assign(formInputs, emptyForm())
  }

  const initializeForEdit = async (sliderId: string) => {
    mode.value = 'edit'
    isLoading.value = true
    try {
      const res = await fetchSliderById(sliderId)
      const product = res?.data?.data ?? null
      selectedSlider.value = product
      if (product) Object.assign(formInputs, mapProductToForm(product))
    } finally {
      isLoading.value = false
    }
  }

  const resetToOriginal = () => {
    if (mode.value === 'edit' && selectedSlider.value) {
      Object.assign(formInputs, mapProductToForm(selectedSlider.value))
    } else {
      initializeForAdd()
    }
  }

  const fetchSliders = async ({ page = 1, limit = 10, search = '' } = {}) => {
    isLoading.value = true
    try {
      const response = await SliderService.fetchSliders({ page, limit, search })
      if (response.data?.data) {
        sliders.value = response.data.data
        pagination.value = response.data.pagination
      }
    } catch (error) {
      console.error('Failed to fetch sliders:', error)
    } finally {
      isLoading.value = false
    }
  }

  const fetchSliderById = async (id: string) => {
    isLoading.value = true
    try {
      return await SliderService.getSlider(id)
    } finally {
      isLoading.value = false
    }
  }

  const addSlider = async (payload: SliderForm) => {
    isLoading.value = true
    try {
      const response = await SliderService.addSlider(payload)
      const newItem = response.data?.data || null
      if (newItem) {
        sliders.value = Array.isArray(sliders.value) ? [newItem, ...sliders.value] : [newItem]
        list.value = Array.isArray(list.value) ? [newItem, ...list.value] : [newItem]
      }
      return response
    } catch (error) {
      console.error('Failed to add slider:', error)
    } finally {
      isLoading.value = false
    }
  }

  const updateSlider = async (_id: string, payload: SliderForm) => {
    isLoading.value = true
    try {
      const response = await SliderService.updateSlider(_id, payload)
      const updatedItem = response.data?.data || null
      if (updatedItem) {
        if (Array.isArray(sliders.value)) {
          const idx = sliders.value.findIndex((c) => c._id === updatedItem._id)
          if (idx !== -1) {
            sliders.value = [
              ...sliders.value.slice(0, idx),
              { ...sliders.value[idx], ...updatedItem },
              ...sliders.value.slice(idx + 1),
            ]
          } else {
            sliders.value = [...sliders.value, updatedItem]
          }
        } else {
          sliders.value = [updatedItem]
        }

        // Also update in `list` if exists
        if (Array.isArray(list.value)) {
          const listIdx = list.value.findIndex((c) => c._id === updatedItem._id)
          if (listIdx !== -1) {
            list.value = [
              ...list.value.slice(0, listIdx),
              { ...list.value[listIdx], ...updatedItem },
              ...list.value.slice(listIdx + 1),
            ]
          }
        }
      }
      return response
    } catch (error) {
      console.error('Failed to update slider:', error)
    } finally {
      isLoading.value = false
    }
  }

  const deleteSlider = async (_id: string) => {
    isLoading.value = true
    try {
      const response = await SliderService.deleteSlider(_id)
      if (response.data?.success) {
        if (Array.isArray(sliders.value)) {
          sliders.value = sliders.value.filter((c) => c._id !== _id)
        }
        if (Array.isArray(list.value)) {
          list.value = list.value.filter((c) => c._id !== _id)
        }
        if (selectedSlider.value?._id === _id) {
          selectedSlider.value = null
        }
      }
      return response
    } catch (error) {
      console.error('Failed to delete slider:', error)
    } finally {
      isLoading.value = false
    }
  }

  const reset = () => {
    initializeForAdd()
    selectedSlider.value = null
  }

  return {
    sliders,
    isLoading: readonly(isLoading),
    selectedSlider,
    pagination: readonly(pagination),
    list: readonly(list),
    initializeForAdd,
    initializeForEdit,
    formInputs,
    isAddMode,
    isEditMode,
    fetchSliders,
    addSlider,
    updateSlider,
    deleteSlider,
    reset,
  }
})
