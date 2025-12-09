// ============================================
// FILE: stores/auth.ts
// ============================================
import { defineStore } from 'pinia'
import type { SettingInterface } from '~/services/setting.service'
import SettingService from '~/services/setting.service'

export interface SettingState {
  setting: SettingInterface | null
  loading: boolean
}

export const useSettingStore = defineStore('setting', {
  state: (): SettingState => ({
    setting: null,
    loading: false,
  }),

  getters: {
    isLoading: (state): boolean => state.loading,
  },

  actions: {
    async fetchSetting() {
      this.loading = true
      try {
        const response = await SettingService.fetchSetting()
        if (response.data) {
          this.setting = response.data.data
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error)
      } finally {
        this.loading = false
      }
    },

    async updateSetting(payload: Partial<SettingInterface>) {
      this.loading = true
      const { _id, createdAt, updatedAt, __v, ...data } = payload
      try {
        // Simulate an API call to fetch settings
        const response = await SettingService.updateSetting(this.setting?._id || '', data)
        if (response.data?.success && response.data.data) {
          this.setting = response.data.data
        }
        return response
      } catch (error) {
        return {
          success: false,
          error,
          message: 'Failed to update setting',
        }
      } finally {
        this.loading = false
      }
    },
  },
})
