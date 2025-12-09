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
    description: () => setting.value?.description || 'Welcome to Parish Jat Leo official website.',
    ogUrl: appUrl,
    ogTitle: () => setting.value?.name || 'Parish Jat Leo | Admin',
    ogDescription: () =>
      setting.value?.description || 'Welcome to Parish Jat Leo official website.',
    ogImage: () => image.value,

    twitterCard: 'summary_large_image',
    twitterTitle: () => setting.value?.name || 'Parish Jat Leo',
    twitterDescription: () =>
      setting.value?.description || 'Welcome to Parish Jat Leo official website.',
    twitterImage: () => image.value,
  })

  useHead(() => ({
    link: [
      {
        rel: 'icon',
        type: 'image/png',
        href: setting.value?.faviconUrl
          ? `${setting.value.faviconUrl}?v=${Date.now()}`
          : '/favicon.ico',
      },
      {
        rel: 'apple-touch-icon',
        href: setting.value?.faviconUrl
          ? `${setting.value.faviconUrl}?v=${Date.now()}`
          : '/favicon.ico',
      },
    ],
  }))
}
