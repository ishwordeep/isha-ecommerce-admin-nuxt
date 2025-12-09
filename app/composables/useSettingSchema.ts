// composables/useSettingSeo.ts
import type { SettingInterface } from '~/services/setting.service'

export function useSettingSeo(setting: Ref<SettingInterface | null | undefined>) {
  const runtimeConfig = useRuntimeConfig()
  const appUrl = runtimeConfig.public.appUrl

  const image = computed(() => {
    if (!setting) return ''
    const img = setting.value?.logoUrl
    return img || ''
  })

  useSeoMeta({
    title: () => (setting.value?.name ? `${setting.value?.name}` : 'Parish Jat Leo'),
    description: () => setting.value?.description || 'Welcome to Parish Jat Leo official website.',
    ogUrl: appUrl,
    ogTitle: () => setting.value?.name || 'Parish Jat Leo',
    ogDescription: () =>
      setting.value?.description || 'Welcome to Parish Jat Leo official website.',
    ogImage: () => image.value,

    twitterCard: 'summary_large_image',
    twitterTitle: () => setting.value?.name || 'Parish Jat Leo',
    twitterDescription: () =>
      setting.value?.description || 'Welcome to Parish Jat Leo official website.',
    twitterImage: () => image.value,
  })
}
