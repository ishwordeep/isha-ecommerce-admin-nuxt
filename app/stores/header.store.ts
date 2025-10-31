export const useHeaderStore = defineStore('headerStore', {
  state: () => ({
    title: 'Home',
    description: '',
  }),
  actions: {
    setHeaders(title: string, description?: string) {
      this.title = title
      this.description = description ?? ''
    },
  },
})
