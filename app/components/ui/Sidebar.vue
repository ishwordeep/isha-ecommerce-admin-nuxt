<template>
  <nav
    ref="sidebarRef"
    class="h-screen border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
    :class="className"
  >
    <div class="border-b-default flex items-center gap-2 border-b p-4">
      <!-- <NuxtImg :src="settingStore.setting?.logoUrl" class="h-14 w-auto shrink-0" /> -->
      <UIcon name="i-lucide-frame" class="h-8 w-8 shrink-0" />
      <p v-if="settingStore.setting?.name" class="line-clamp-1 text-lg font-bold">
        {{ settingStore.setting?.name }}
      </p>
    </div>

    <div class="flex flex-col gap-4 overflow-y-auto p-4">
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
              class="group hover:bg-primary flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 transition-colors hover:text-white"
              :class="accordionState[index] ? 'bg-primary text-white' : ''"
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
              <div class="space-y-1 py-2 pl-4">
                <ULink
                  v-for="(child, childIndex) in item.children"
                  :key="childIndex"
                  :to="child.to"
                  active-class="bg-primary text-white"
                  inactive-class="text-gray-700 dark:text-gray-300 hover:bg-primary hover:text-white"
                  class="block rounded-md px-3 py-2 text-sm transition-colors hover:text-white"
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
            active-class="bg-primary text-white"
            inactive-class="text-gray-700 dark:text-gray-300 hover:bg-primary hover:text-white"
            class="flex items-center gap-3 rounded-md px-3 py-2 transition-colors hover:text-white"
            @click="emit('navigate')"
          >
            <UIcon :name="item.icon" class="h-5 w-5" />
            <span>{{ item.label }}</span>
          </ULink>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import Logo from '~/assets/images/logo.jpg'
import { useRoute } from 'vue-router'
import { computed, watch, ref, onMounted, onBeforeUnmount } from 'vue'

defineProps({
  className: String,
})

const emit = defineEmits(['navigate'])

const route = useRoute()
const settingStore = useSettingStore()

// Reactive check for /products routes
const isProductsRoute = computed(() => route.path.startsWith('/products'))

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
          item.value === '/products' ? isProductsRoute.value : Boolean((item as any).defaultOpen)
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
    }
  })
})
</script>
