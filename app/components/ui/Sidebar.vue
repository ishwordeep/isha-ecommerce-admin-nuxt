<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const route = useRoute()

const items: NavigationMenuItem[][] = [
  [
    {
      label: 'Home',
      icon: 'i-lucide-house',
      to: '/',
    },
    {
      label: 'Category',
      icon: 'i-lucide-grid-2x2',
      to: '/category',
    },

    {
      label: 'Products',
      icon: 'i-lucide-shopping-cart',
      get defaultOpen() {
        return isProducts.value
      },
      children: [
        {
          label: 'Information',
          to: '/products',
        },
        // {
        //   label: 'Colors',
        //   to: '/products/colors',
        // },
      ],
    },
  ],
]

const isProducts = computed(() => {
  return route.path.startsWith('/products')
})
</script>

<template>
  <UDashboardSidebar
    class="sticky top-0 h-[100dvh] max-w-[250px] min-w-[250px]"
    style="width: 100%"
    :ui="{ footer: 'border-t border-default' }"
  >
    <template #header="{ collapsed }">
      <UIcon name="i-simple-icons-nuxtdotjs" class="text-primary mx-auto size-5" />
    </template>

    <template #default="{ collapsed }">
      <UNavigationMenu
        :key="route.path"
        :collapsed="collapsed"
        :items="items[0]"
        orientation="vertical"
        :ui="{
          link: 'hover:bg-accent hover:text-accent-foreground p-2.5',
          childList: 'border-none mt-1',
        }"
      />
    </template>

    <template #footer="{ collapsed }">
      <UButton
        :avatar="{
          src: 'https://github.com/benjamincanac.png',
        }"
        :label="collapsed ? undefined : 'Benjamin'"
        color="neutral"
        variant="ghost"
        class="w-full"
        :block="collapsed"
      />
    </template>
  </UDashboardSidebar>
</template>
