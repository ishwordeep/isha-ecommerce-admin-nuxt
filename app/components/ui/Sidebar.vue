<template>
  <nav
    ref="sidebarRef"
    class="flex h-screen flex-col border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
    :class="className"
  >
    <div class="border-b-default flex items-center gap-2 border-b p-4">
      <NuxtImg
        v-if="settingStore.setting?.logoUrl"
        :src="settingStore.setting?.logoUrl"
        class="h-8 w-8 shrink-0"
      />
      <UIcon v-else name="i-lucide-frame" class="h-8 w-8 shrink-0" />
      <p v-if="settingStore.setting?.name" class="line-clamp-1 text-lg font-bold">
        {{ settingStore.setting?.name }}
      </p>
    </div>

    <div class="flex flex-1 flex-col gap-4 overflow-y-auto p-2">
      <div v-for="(item, index) in menuItems" :key="index">
        <!-- Items with children (collapsible) -->
        <template v-if="item.children">
          <UCollapsible
            :key="item.value"
            v-model:open="accordionState[index]"
            :items="[
              {
                label: item.label,
                icon: item.icon,
                slot: `content-${index}`,
              },
            ]"
            :defaultOpen="item.defaultOpen"
          >
            <ULink
              :to="item.to"
              class="group hover:bg-primary/50 flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 font-bold text-black transition-colors hover:text-black"
              :class="accordionState[index] ? 'bg-primary/50' : ''"
              @click="emit('navigate')"
            >
              <div class="flex items-center gap-3">
                <UIcon :name="item.icon" class="h-5 w-5" />
                <span>{{ item.label }}</span>
              </div>
              <UIcon
                name="i-lucide-chevron-down"
                class="h-5 w-5 transition-transform duration-200 group-data-[state=open]:rotate-180"
              />
            </ULink>
            <template #content>
              <div class="space-y-2 py-2 pl-4">
                <ULink
                  v-for="(child, childIndex) in item.children"
                  :key="childIndex"
                  :to="child.to"
                  active-class="bg-primary/50 text-black"
                  inactive-class="text-gray-700 dark:text-gray-300 hover:bg-primary/50 hover:text-black"
                  class="block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-black"
                  @click="emit('navigate')"
                >
                  {{ child.label }}
                </ULink>
              </div>
            </template>
          </UCollapsible>
        </template>

        <!-- Simple items without children -->
        <template v-else>
          <ULink
            :to="item.to"
            active-class="bg-primary/50 text-black"
            inactive-class="text-gray-700 dark:text-gray-300 hover:bg-primary/50 hover:text-black"
            class="flex items-center gap-3 rounded-md px-3 py-2 font-bold transition-colors hover:text-black"
            @click="emit('navigate')"
          >
            <UIcon :name="item.icon" class="h-5 w-5" />
            <span>{{ item.label }}</span>
          </ULink>
        </template>
      </div>
    </div>

    <div class="border-t border-gray-200 p-4 dark:border-gray-800">
      <UButton
        label="Sign Out"
        leading-icon="i-lucide-log-out"
        variant="ghost"
        color="error"
        class="w-full"
        @click="authStore.clearAuth()"
      />
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

defineProps({
  className: String,
})

const emit = defineEmits(['navigate'])

const route = useRoute()
const settingStore = useSettingStore()
const authStore = useAuthStore()

// Reactive check for /products routes
const isProductsRoute = computed(() => route.path.startsWith('/products'))
const isPagesRoute = computed(() => route.path.startsWith('/front-pages'))

// Track accordion open state
const accordionState = ref<Record<number, boolean>>({})

// Ref for the sidebar (collapsible container)
const sidebarRef = ref<HTMLElement | null>(null)

const menuItems = ref([
  {
    label: 'Home',
    icon: 'i-lucide-house',
    to: '/',
  },
  {
    label: 'Sliders',
    icon: 'i-lucide-images',
    to: '/slider',
  },
  {
    label: 'Category',
    icon: 'i-lucide-grid-2x2',
    to: '/category',
  },
  {
    label: 'Products',
    icon: 'i-lucide-shopping-cart',
    value: '/products',
    defaultOpen: isProductsRoute.value,
    children: [
      { label: 'Information', to: '/products' },
      { label: 'New Arrivals', to: '/products/new-arrivals' },
      { label: 'Trending', to: '/products/trending' },
      { label: 'Featured', to: '/products/featured' },
    ],
  },
  {
    label: 'Orders',
    icon: 'i-lucide-package',
    to: '/orders',
  },
  {
    label: 'Messages',
    icon: 'i-lucide-message-circle',
    to: '/messages',
  },
  {
    label: 'Pages',
    icon: 'i-lucide-file-text',
    defaultOpen: isPagesRoute.value,
    children: [
      { label: 'About Us', to: '/front-pages/about-us' },
      { label: 'Size Guides', to: '/front-pages/size-guides' },
      { label: 'Privacy Policy', to: '/front-pages/privacy-policy' },
    ],
  },
  {
    label: 'Settings',
    icon: 'i-lucide-settings',
    to: '/settings',
  },
])

// Initialize accordion state based on current route and add outside-click handler
// Outside click handler to close non-default-open collapsibles
const handleDocumentClick = (e: MouseEvent) => {
  const target = e.target as Node | null
  const inside = target && sidebarRef.value ? sidebarRef.value.contains(target) : false

  if (!inside) {
    menuItems.value.forEach((item, index) => {
      if (item.children) {
        const isDefaultOpen =
          item.value === '/products'
            ? isProductsRoute.value
            : item.value === '/front-pages'
              ? isPagesRoute.value
              : Boolean((item as any).defaultOpen)
        if (!isDefaultOpen) {
          accordionState.value[index] = false
        }
      }
    })
  }
}

onMounted(() => {
  // Initialize open state for all collapsibles
  menuItems.value.forEach((item, index) => {
    if (item.children) {
      if (item.value === '/products') {
        accordionState.value[index] = isProductsRoute.value
      } else if (item.value === '/front-pages') {
        accordionState.value[index] = isPagesRoute.value
      } else {
        // fall back to provided defaultOpen or false
        accordionState.value[index] = Boolean(item.defaultOpen)
      }
    }
  })

  document.addEventListener('click', handleDocumentClick)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleDocumentClick)
})

// Watch route changes to update accordion state
watch(isProductsRoute, (newValue) => {
  menuItems.value.forEach((item, index) => {
    if (item.children && item.value === '/products') {
      accordionState.value[index] = newValue
    } else if (item.children && item.value === '/front-pages') {
      accordionState.value[index] = isPagesRoute.value
    }
  })
})
</script>
