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
      label: 'Sliders',
      icon: 'i-lucide-images',
      to: '/sliders',
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
        {
          label: 'New Arrivals',
          to: '/products/new-arrivals',
        },
        {
          label: 'Trending',
          to: '/products/trending',
        },
        {
          label: 'Featured',
          to: '/products/featured',
        },
      ],
    },
  ],
]

const isProducts = computed(() => {
  return route.path.startsWith('/products')
})
</script>

<template>
  <UDashboardGroup class="top-0 lg:sticky lg:h-[100dvh] lg:max-w-[250px] lg:min-w-[250px]">
    <UDashboardSidebar style="width: 100%" :ui="{ footer: 'border-t border-default' }">
      <template #default="{ collapsed }">
        <UNavigationMenu
          :key="route.path"
          :collapsed="collapsed"
          :items="items[0]"
          orientation="vertical"
          :ui="{
            link: 'hover:bg-primary hover:text-white p-2.5 rounded-md my-2 data-active:bg-primary data-active:text-white',
            childList: 'border-none',
            linkLeadingIcon: 'group-hover:text-white group-data-active:text-white',
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
    <UDashboardPanel>
      <template #header>
        <UDashboardNavbar class="border-b-0 pt-4" />
      </template>
    </UDashboardPanel>
  </UDashboardGroup>
</template>
