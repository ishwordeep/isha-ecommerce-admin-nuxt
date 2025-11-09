<template>
  <nav
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
          <UAccordion
            :key="item.value"
            v-model:open="accordionState[index]"
            :items="[
              {
                label: item.label,
                icon: item.icon,
                slot: `content-${index}`,
              },
            ]"
            :ui="{
              trigger:
                'group flex-1 flex items-center gap-1.5 font-medium text-sm focus-visible:outline-primary min-w-0 px-3 py-2 hover:bg-primary hover:text-white rounded-md text-md data-[state=open]:text-white data-[state=open]:bg-primary',
              leadingIcon: 'mr-1',
            }"
          >
            <template #[`content-${index}`]>
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
          </UAccordion>
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
import { computed, watch } from 'vue'

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
    children: [
      { label: 'Information', to: '/products' },
      { label: 'New Arrivals', to: '/products/new-arrivals' },
      { label: 'Trending', to: '/products/trending' },
      { label: 'Featured', to: '/products/featured' },
    ],
  },
  {
    label: 'Orders',
    icon: 'i-lucide-shopping-cart',
    to: '/orders',
  },
])

// Initialize accordion state based on current route
onMounted(() => {
  menuItems.value.forEach((item, index) => {
    if (item.children && item.value === '/products') {
      accordionState.value[index] = isProductsRoute.value
    }
  })
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
