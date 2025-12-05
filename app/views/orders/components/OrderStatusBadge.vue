<!-- components/OrderStatusBadge.vue -->
<script setup lang="ts">
enum OrderStatus {
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  PAID = 'PAID',
  SHIPPED = 'SHIPPED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

interface Props {
  status: OrderStatus
}

const props = defineProps<Props>()

// Everything defined locally — no external composable
const config = {
  [OrderStatus.PENDING_PAYMENT]: {
    label: 'Pending',
    bg: 'bg-yellow-500',
    icon: 'i-lucide-clock',
  },
  [OrderStatus.PAID]: {
    label: 'Paid',
    bg: 'bg-blue-500',
    icon: 'i-lucide-check',
  },
  [OrderStatus.SHIPPED]: {
    label: 'Shipped',
    bg: 'bg-purple-500',
    icon: 'i-lucide-truck',
  },
  [OrderStatus.COMPLETED]: {
    label: 'Completed',
    bg: 'bg-green-600',
    icon: 'i-lucide-badge-check',
  },
  [OrderStatus.CANCELLED]: {
    label: 'Cancelled',
    bg: 'bg-red-500',
    icon: 'i-lucide-x',
  },
}

// Computed values
const current = computed(
  () => config[props.status] || { label: props.status, bg: 'bg-gray-500', icon: undefined }
)
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-white capitalize"
    :class="current.bg"
  >
    <!-- Icon (optional) -->
    <UIcon v-if="current.icon" :name="current.icon" class="h-4 w-4" />

    {{ current.label }}
  </span>
</template>
