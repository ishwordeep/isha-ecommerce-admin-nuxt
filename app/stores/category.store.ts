import { defineStore } from 'pinia'
import { ref, readonly, reactive, computed } from 'vue'
import CategoryService from '~/services/category.service'
import type { CategoryInterface } from '~/services/category.service'
import type { PaginationInterface } from '~/services/index.interface'

type Mode = 'add' | 'edit'

export interface CategoryForm {
  name: string
  description: string
  isActive: boolean
  image: string
  displayOrder: number
}

const mapProductToForm = (category: CategoryInterface | null): CategoryForm => {
  if (!category) return emptyForm()

  return {
    name: category.name ?? '',
    description: category.description ?? '',
    isActive: category.isActive ?? true,
    image: category.image ?? '',
    displayOrder: category.displayOrder ?? 1,
  }
}

const emptyForm = (): CategoryForm => ({
  name: '',
  description: '',
  isActive: true,
  image: '',
  displayOrder: 1,
})

export const useCategoryStore = defineStore('category', () => {
  const categories = ref<CategoryInterface[] | null>(null)
  const isLoading = ref(false)
  const selectedCategory = ref<CategoryInterface | null>(null)
  const pagination = ref<PaginationInterface | null>(null)
  const list = ref<CategoryInterface[] | null>(null)
  const mode = ref<Mode>('add')
  const formInputs = reactive<CategoryForm>(emptyForm())

  const isAddMode = computed(() => mode.value === 'add')
  const isEditMode = computed(() => mode.value === 'edit')

  const initializeForAdd = () => {
    mode.value = 'add'
    Object.assign(formInputs, emptyForm())
  }

  const initializeForEdit = async (categoryId: string) => {
    mode.value = 'edit'
    isLoading.value = true
    try {
      const res = await fetchCategoryById(categoryId)
      const product = res?.data?.data ?? null
      selectedCategory.value = product
      if (product) Object.assign(formInputs, mapProductToForm(product))
    } finally {
      isLoading.value = false
    }
  }

  const resetToOriginal = () => {
    if (mode.value === 'edit' && selectedCategory.value) {
      Object.assign(formInputs, mapProductToForm(selectedCategory.value))
    } else {
      initializeForAdd()
    }
  }

  const fetchListOnly = async () => {
    isLoading.value = true
    try {
      const response = await CategoryService.fetchCategoryList()
      if (response.data?.data) {
        list.value = response.data.data
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    } finally {
      isLoading.value = false
    }
  }

  const fetchCategories = async ({ page = 1, limit = 10, search = '' } = {}) => {
    isLoading.value = true
    try {
      const response = await CategoryService.fetchCategories({ page, limit, search })
      if (response.data?.data) {
        categories.value = response.data.data
        pagination.value = response.data.pagination
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    } finally {
      isLoading.value = false
    }
  }

  const fetchCategoryById = async (id: string) => {
    isLoading.value = true
    try {
      return await CategoryService.getCategory(id)
    } finally {
      isLoading.value = false
    }
  }

  const addCategory = async (payload: CategoryForm) => {
    isLoading.value = true
    try {
      const response = await CategoryService.addCategory(payload)
      const newItem = response.data?.data || null
      if (newItem) {
        categories.value = Array.isArray(categories.value)
          ? [newItem, ...categories.value]
          : [newItem]
        list.value = Array.isArray(list.value) ? [newItem, ...list.value] : [newItem]
      }
      return response
    } catch (error) {
      console.error('Failed to add category:', error)
    } finally {
      isLoading.value = false
    }
  }

  const updateCategory = async (_id: string, payload: CategoryForm) => {
    isLoading.value = true
    try {
      const response = await CategoryService.updateCategory(_id, payload)
      const updatedItem = response.data?.data || null
      if (updatedItem) {
        if (Array.isArray(categories.value)) {
          const idx = categories.value.findIndex((c) => c._id === updatedItem._id)
          if (idx !== -1) {
            categories.value = [
              ...categories.value.slice(0, idx),
              { ...categories.value[idx], ...updatedItem },
              ...categories.value.slice(idx + 1),
            ]
          } else {
            categories.value = [...categories.value, updatedItem]
          }
        } else {
          categories.value = [updatedItem]
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
      console.error('Failed to update category:', error)
    } finally {
      isLoading.value = false
    }
  }

  const deleteCategory = async (_id: string) => {
    isLoading.value = true
    try {
      const response = await CategoryService.deleteCategory(_id)
      if (response.data?.success) {
        if (Array.isArray(categories.value)) {
          categories.value = categories.value.filter((c) => c._id !== _id)
        }
        if (Array.isArray(list.value)) {
          list.value = list.value.filter((c) => c._id !== _id)
        }
        if (selectedCategory.value?._id === _id) {
          selectedCategory.value = null
        }
      }
      return response
    } catch (error) {
      console.error('Failed to delete category:', error)
    } finally {
      isLoading.value = false
    }
  }

  const reset = () => {
    initializeForAdd()
    selectedCategory.value = null
  }

  return {
    categories,
    isLoading: readonly(isLoading),
    selectedCategory,
    pagination: readonly(pagination),
    list: readonly(list),

    initializeForAdd,
    initializeForEdit,
    formInputs,
    isAddMode,
    isEditMode,
    fetchListOnly,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    reset,
  }
})
