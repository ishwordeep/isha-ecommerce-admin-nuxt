// ============================================
// FILE: stores/auth.ts
// ============================================
import { defineStore } from 'pinia'
import ProductService from '~/services/product.service'
import type { ProductInterface } from '~/services/product.service'

export interface ProductState {
  products: ProductInterface[] | null
  loading: boolean
  selectedProduct: ProductInterface | null
}

export const useProductStore = defineStore('product', {
  state: (): ProductState => ({
    products: null,
    loading: false,
    selectedProduct: null,
  }),

  getters: {
    isLoading: (state): boolean => state.loading,
  },

  actions: {
    async fetchProducts() {
      this.loading = true
      try {
        const response = await ProductService.fetchProducts()
        if (response.data?.data) {
          this.products = response.data.data
        }
      } catch (error) {
        console.error('Failed to fetch products:', error)
      } finally {
        this.loading = false
      }
    },

    async addProduct(payload: ProductInterface) {
      this.loading = true
      try {
        const response = await ProductService.addProduct(payload)
        const newItem = response.data?.data || null
        if (newItem) {
          this.products = Array.isArray(this.products) ? [...this.products, newItem] : [newItem]
        }
        return response
      } catch (error) {
        console.error('Failed to add category:', error)
      } finally {
        this.loading = false
      }
    },

    async updateProduct(_id: string, payload: ProductInterface) {
      this.loading = true
      try {
        const response = await ProductService.updateProduct(_id, payload)
        const updatedItem = response.data?.data || null
        if (updatedItem) {
          if (Array.isArray(this.products)) {
            const idx = this.products.findIndex((c) => c._id === updatedItem._id)
            if (idx !== -1) {
              this.products = [
                ...this.products.slice(0, idx),
                { ...this.products[idx], ...updatedItem },
                ...this.products.slice(idx + 1),
              ]
            } else {
              // If not found, append it
              this.products = [...this.products, updatedItem]
            }
          } else {
            this.products = [updatedItem]
          }
        }
        return response
      } catch (error) {
        console.error('Failed to update category:', error)
      } finally {
        this.loading = false
      }
    },

    async deleteProduct() {
      this.loading = true
      const _id = this.selectedProduct?._id
      if (!_id) return
      try {
        const response = await ProductService.deleteProduct(_id)
        console.log(response)
        const deleted = response.data?.success
        if (deleted) {
          if (Array.isArray(this.products)) {
            this.products = this.products.filter((c) => c._id !== _id)
          }
        }
        return response
      } catch (error) {
        console.error('Failed to delete category:', error)
      } finally {
        this.loading = false
      }
    },

    reset() {
      this.$reset()
    },
  },
})
