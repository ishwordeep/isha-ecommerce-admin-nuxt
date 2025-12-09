<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui'
import { useRoute } from 'vue-router'
import { useProductStore } from '~/stores/product.store'
import FAQs from '~/views/products/components/FAQs.vue'
import ProductForm from '~/views/products/components/ProductForm.vue'
import Story from '~/views/products/components/Story.vue'

const route = useRoute()
const router = useRouter()

const productStore = useProductStore()

const headerStore = useHeaderStore()

definePageMeta({ layout: 'admin' })

useSeoMeta({
  title: 'Edit Product | Admin',
  description: 'Edit your product',
  ogTitle: 'Edit Product | Admin',
})

onBeforeMount(() => {
  headerStore.setHeaders('Products', 'Edit your product here.')
})

onMounted(async () => {
  const id = route.params.id as string
  if (id) {
    await productStore.initializeForEdit(id)
  }
})

const items = ref<TabsItem[]>([
  {
    label: 'General',
    icon: 'i-lucide-user',
    slot: 'general',
    value: 'general',
  },
  {
    label: 'Story',
    icon: 'i-lucide-info',
    slot: 'story',
    value: 'story',
  },
  {
    label: 'FAQs',
    icon: 'i-lucide-help-circle',
    slot: 'faqs',
    value: 'faqs',
  },
])

const active = computed({
  get() {
    return (route.query.tab as string) || 'general'
  },
  set(tab) {
    // Hash is specified here to prevent the page from scrolling to the top
    router.push({
      path: `/products/${route.params.id}/edit`,
      query: { tab },
    })
  },
})
</script>

<template>
  <UTabs
    :items="items"
    class="w-full"
    :ui="{
      list: 'w-max mr-auto',
    }"
    v-model="active"
  >
    <template #general>
      <ClientOnly>
        <ProductForm mode="edit" />
      </ClientOnly>
    </template>

    <template #story>
      <ClientOnly>
        <Story />
      </ClientOnly>
    </template>

    <template #faqs>
      <ClientOnly>
        <FAQs />
      </ClientOnly>
    </template>
  </UTabs>
</template>
