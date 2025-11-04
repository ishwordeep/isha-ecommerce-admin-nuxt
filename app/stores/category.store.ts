// ============================================
// FILE: stores/auth.ts
// ============================================
import { defineStore } from 'pinia'
import CategoryService from '~/services/category.service'
import type { CategoryInterface } from '~/services/category.service'
import type { PaginationInterface } from '~/services/index.interface'

export interface CategoryState {
  categories: CategoryInterface[] | null
  loading: boolean
  selectedCategory: CategoryInterface | null
  pagination: PaginationInterface | null
  list: CategoryInterface[] | null
}

export const useCategoryStore = defineStore('category', {
  state: (): CategoryState => ({
    categories: null,
    loading: false,
    selectedCategory: null,
    pagination: null,
    list: null,
  }),

  getters: {
    isLoading: (state): boolean => state.loading,
  },

  actions: {
    async fetchListOnly() {
      this.loading = true
      try {
        const response = await CategoryService.fetchCategoryList()
        if (response.data?.data) {
          this.list = response.data.data
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchCategories({ page = 1, limit = 10, query = '' }) {
      this.loading = true
      try {
        const response = await CategoryService.fetchCategories({ page, limit, query })
        if (response.data?.data) {
          this.categories = response.data.data
          this.pagination = response.data.pagination
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error)
      } finally {
        this.loading = false
      }
    },

    async addCategory(payload: CategoryInterface) {
      this.loading = true
      try {
        const response = await CategoryService.addCategory(payload)
        const newItem = response.data?.data || null
        if (newItem) {
          this.categories = Array.isArray(this.categories)
            ? [newItem, ...this.categories]
            : [newItem]
          this.list = Array.isArray(this.list) ? [newItem, ...this.list] : [newItem]
        }
        return response
      } catch (error) {
        console.error('Failed to add category:', error)
      } finally {
        this.loading = false
      }
    },

    async updateCategory(_id: string, payload: CategoryInterface) {
      this.loading = true
      try {
        const response = await CategoryService.updateCategory(_id, payload)
        const updatedItem = response.data?.data || null
        if (updatedItem) {
          if (Array.isArray(this.categories)) {
            const idx = this.categories.findIndex((c) => c._id === updatedItem._id)
            if (idx !== -1) {
              this.categories = [
                ...this.categories.slice(0, idx),
                { ...this.categories[idx], ...updatedItem },
                ...this.categories.slice(idx + 1),
              ]
            } else {
              // If not found, append it
              this.categories = [...this.categories, updatedItem]
            }
          } else {
            this.categories = [updatedItem]
          }
        }
        return response
      } catch (error) {
        console.error('Failed to update category:', error)
      } finally {
        this.loading = false
      }
    },

    async deleteCategory(_id: string) {
      this.loading = true
      try {
        const response = await CategoryService.deleteCategory(_id)
        console.log(response)
        const deleted = response.data?.success
        if (deleted) {
          if (Array.isArray(this.categories)) {
            this.categories = this.categories.filter((c) => c._id !== _id)
          }
        }
        return response
      } catch (error) {
        console.error('Failed to delete category:', error)
      } finally {
        this.loading = false
      }
    },
  },
})
