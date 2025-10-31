// ============================================
// FILE: stores/auth.ts
// ============================================
import { defineStore } from 'pinia'
import SettingService from '~/services/setting.service'
import type { SettingInterface } from '~/services/setting.service'

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
        // Simulate an API call to fetch settings
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

    async updateSetting(payload: SettingInterface) {
      this.loading = true
      try {
        // Simulate an API call to fetch settings
        const response = await SettingService.updateSetting(payload)
        if (response.data) {
          this.setting = response.data.data
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error)
      } finally {
        this.loading = false
      }
    },
  },
})
