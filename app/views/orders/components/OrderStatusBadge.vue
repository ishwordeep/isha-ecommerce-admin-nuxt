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
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: 'i-lucide-clock',
  },
  [OrderStatus.PAID]: {
    label: 'Paid',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: 'i-lucide-check',
  },
  [OrderStatus.SHIPPED]: {
    label: 'Shipped',
    color: 'bg-purple-100 text-purple-700 border-purple-200',
    icon: 'i-lucide-truck',
  },
  [OrderStatus.COMPLETED]: {
    label: 'Completed',
    color: 'bg-green-100 text-green-700 border-green-200',
    icon: 'i-lucide-check',
  },
  [OrderStatus.CANCELLED]: {
    label: 'Cancelled',
    color: 'bg-red-100 text-red-700 border-red-200',
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
    class="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold"
    :class="current.color"
  >
    <!-- Icon (optional) -->
    <UIcon v-if="current.icon" :name="current.icon" class="h-3.5 w-3.5" />

    {{ current.label }}
  </span>
</template>
