// stores/product.store.ts
import { defineStore } from 'pinia'
import { ref, reactive, computed } from 'vue'
import ProductService from '~/services/product.service'
import type { ProductInterface } from '~/services/product.service'
import { useCategoryStore } from './category.store'
import type { PaginationInterface } from '~/services/index.interface'

type Mode = 'add' | 'edit'

export interface ProductForm {
  name: string
  price: number
  discount: number
  description: string
  isActive: boolean
  isNew: boolean
  isFeatured: boolean
  isTrending: boolean
  tags: string[]
  category: string // human-readable name (not id)
  image: string
  images: string[]
  colors: string[]
  sizes: string[]
}

const mapProductToForm = (product: ProductInterface | null): ProductForm => {
  if (!product) return emptyForm()

  return {
    name: product.name ?? '',
    price: product.price ?? 0,
    discount: product.discount ?? 0,
    description: product.description ?? '',
    isActive: product.isActive ?? true,
    isNew: product.isNew ?? true,
    isFeatured: product.isFeatured ?? false,
    isTrending: product.isTrending ?? false,
    tags: Array.isArray(product.tags) ? product.tags : [],
    category: product.category ?? '',
    image: product.image ?? '',
    images: Array.isArray(product.images) ? product.images : [],
    colors: Array.isArray(product.colors) ? product.colors : [],
    sizes: Array.isArray(product.sizes) ? product.sizes : [],
  }
}

const emptyForm = (): ProductForm => ({
  name: '',
  price: 0,
  discount: 0,
  description: '',
  isActive: true,
  isNew: true,
  isFeatured: false,
  isTrending: false,
  tags: [],
  category: '',
  image: '',
  images: [],
  colors: [],
  sizes: [],
})

export const useProductStore = defineStore('product', () => {
  const isLoading = ref(false)
  const isSubmitting = ref(false)
  const selectedProduct = ref<ProductInterface | null>(null)
  const list = ref<ProductInterface[]>([])
  const products = ref<ProductInterface[]>([])
  const pagination = ref<PaginationInterface | null>(null)
  const mode = ref<Mode>('add')
  const formInputs = reactive<ProductForm>(emptyForm())

  const isAddMode = computed(() => mode.value === 'add')
  const isEditMode = computed(() => mode.value === 'edit')

  const initializeForAdd = () => {
    mode.value = 'add'
    Object.assign(formInputs, emptyForm())
  }

  const initializeForEdit = async (productId: string) => {
    mode.value = 'edit'
    isLoading.value = true
    try {
      const res = await fetchProductById(productId)
      const product = res?.data?.data ?? null
      selectedProduct.value = product
      if (product) Object.assign(formInputs, mapProductToForm(product))
    } finally {
      isLoading.value = false
    }
  }

  const resetToOriginal = () => {
    if (mode.value === 'edit' && selectedProduct.value) {
      Object.assign(formInputs, mapProductToForm(selectedProduct.value))
    } else {
      initializeForAdd()
    }
  }

  const fetchProducts = async ({ page = 1, limit = 2, search = '' }) => {
    isLoading.value = true

    try {
      const response = await ProductService.fetchProducts({
        page,
        limit,
        search,
      })
      if (response.data?.data) {
        products.value = response.data.data
        pagination.value = response.data.pagination
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      isLoading.value = false
    }
  }

  const fetchProductById = async (id: string) => {
    isLoading.value = true
    try {
      return await ProductService.getProduct(id)
    } finally {
      isLoading.value = false
    }
  }

  const addProduct = async (payload: Partial<ProductInterface>) => {
    isSubmitting.value = true
    try {
      const res = await ProductService.addProduct(payload)
      const newItem = res?.data?.data
      if (newItem) list.value = [newItem, ...list.value]
      return res
    } finally {
      isSubmitting.value = false
    }
  }

  const updateProduct = async (id: string, payload: Partial<ProductInterface>) => {
    isSubmitting.value = true
    try {
      const res = await ProductService.updateProduct(id, payload)
      const updated = res?.data?.data
      if (updated) {
        const idx = list.value.findIndex((p) => p._id === updated._id)
        if (idx > -1) {
          list.value = [
            ...list.value.slice(0, idx),
            { ...list.value[idx], ...updated },
            ...list.value.slice(idx + 1),
          ]
        } else {
          list.value = [...list.value, updated]
        }
        selectedProduct.value = updated
      }
      return res
    } finally {
      isSubmitting.value = false
    }
  }

  const deleteProduct = async (id: string) => {
    isSubmitting.value = true
    try {
      const res = await ProductService.deleteProduct(id)
      if (res?.data?.success) {
        list.value = list.value.filter((p) => p._id !== id)
        if (selectedProduct.value?._id === id) selectedProduct.value = null
      }
      return res
    } finally {
      isSubmitting.value = false
    }
  }

  const reset = () => {
    initializeForAdd()
    selectedProduct.value = null
  }

  return {
    isLoading: readonly(isLoading),
    isSubmitting: readonly(isSubmitting),
    selectedProduct,
    products,
    pagination,
    list: readonly(list),

    formInputs,
    mode: readonly(mode),
    isAddMode,
    isEditMode,

    fetchProducts,
    initializeForAdd,
    initializeForEdit,
    resetToOriginal,
    fetchProductById,
    addProduct,
    updateProduct,
    deleteProduct,
    reset,
  }
})
