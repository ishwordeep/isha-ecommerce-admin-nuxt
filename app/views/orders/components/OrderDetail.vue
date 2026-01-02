<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    selectedTab: string
  }>(),
  {
    selectedTab: 'all',
  }
)

const orderStore = useOrderStore()

const open = ref(false)
const toast = useToast()
watch(
  () => orderStore.selectedOrder,
  (newVal) => {
    console.log(newVal)
    open.value = !!newVal
  }
)

const status = ref('')
const state = ref({
  updating: false,
})
// Just paste this wherever you need the options
const statusOptions = [
  { label: 'Pending Payment', value: 'PENDING_PAYMENT', icon: 'i-lucide-clock' },
  { label: 'Paid', value: 'PAID', icon: 'i-lucide-credit-card' },
  { label: 'Shipped', value: 'SHIPPED', icon: 'i-lucide-truck' },
  { label: 'Completed', value: 'COMPLETED', icon: 'i-lucide-check-circle' },
  { label: 'Cancelled', value: 'CANCELLED', icon: 'i-lucide-x-circle' },
]

onMounted(() => {
  status.value = orderStore.selectedOrder?.status || 'PENDING_PAYMENT'
})

watch(
  () => orderStore.selectedOrder,
  (newOrder) => {
    status.value = newOrder?.status || 'PENDING_PAYMENT'
  }
)

const updateStatus = async () => {
  if (!orderStore.selectedOrder) return
  state.value.updating = true
  await orderStore.updateOrderStatus(orderStore.selectedOrder.id, status.value, props.selectedTab)
  toast.add({
    color: 'success',
    title: 'Success',
    description: 'Order status updated successfully.',
  })
  orderStore.selectedOrder = null
  state.value.updating = false
  open.value = false
}
</script>

<template>
  <UModal
    :open="open"
    @update:open="
      (val) => {
        open = val
        if (!val) orderStore.selectedOrder = null
      }
    "
    title="Order Details"
    :description="orderStore.selectedOrder?.orderNumber || ''"
    :ui="{
      body: '!space-y-6',
      content: 'max-w-2xl',
    }"
  >
    <template #body>
      <!-- Status Update -->
      <div class="rounded-lg bg-gray-50 p-4">
        <label class="mb-2 block text-sm font-semibold">Update Status</label>
        <div class="flex gap-3 max-sm:flex-col">
          <USelectMenu
            :icon="statusOptions.find((option) => option.value === status)?.icon"
            :items="statusOptions"
            value-key="value"
            v-model="status"
            class="flex-1"
          />
          <UButton class="justify-center" color="primary" @click="updateStatus">Update</UButton>
        </div>
      </div>

      <!-- Customer, Items, Shipping, Summary -->
      <div>
        <h3 class="mb-3 font-bold">Customer</h3>
        <UCard variant="soft">
          <div class="space-y-2">
            <div class="flex justify-between">
              <span class="text-gray-600">Name:</span> {{ orderStore.selectedOrder?.name }}
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Email:</span> {{ orderStore.selectedOrder?.email }}
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Phone:</span> {{ orderStore.selectedOrder?.phone }}
            </div>
          </div>
        </UCard>
      </div>

      <!-- Order Items -->
      <div>
        <h3 class="mb-3 font-bold">Items</h3>
        <div class="space-y-3">
          <div
            v-for="item in orderStore.selectedOrder?.items"
            :key="item.productId"
            class="flex gap-4 rounded-lg bg-gray-50 p-4"
          >
            <div class="border-default aspect-square w-16 shrink-0 rounded-md border">
              <NuxtImg
                v-if="item.image"
                :src="item.image"
                alt="Product"
                class="h-full w-full rounded-md object-cover"
              />
            </div>
            <div class="flex-1">
              <div class="font-semibold max-sm:text-sm">{{ item.name }}</div>
              <div class="text-sm text-gray-600">Qty: {{ item.quantity }}</div>
            </div>
            <div class="text-right">
              <div class="font-bold max-sm:text-sm">
                ${{ (item.price * item.quantity).toFixed(2) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Shipping Address -->
      <div>
        <h3 class="mb-3 font-bold">Shipping</h3>
        <UCard variant="soft">
          {{ orderStore.selectedOrder?.shippingAddress.street }},
          {{ orderStore.selectedOrder?.shippingAddress.apartment }},
          {{ orderStore.selectedOrder?.shippingAddress.city }},
          {{ orderStore.selectedOrder?.shippingAddress.state }},
          {{ orderStore.selectedOrder?.shippingAddress.zipCode }},
          {{ orderStore.selectedOrder?.shippingAddress.country }}
        </UCard>
      </div>

      <div className="space-y-2">
        <USeparator />
        <div className="flex justify-between text-gray-600">
          <span>Subtotal:</span>
          <span>${{ orderStore.selectedOrder?.subtotal.toFixed(2) }}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Shipping:</span>
          <span>${{ orderStore.selectedOrder?.shippingFee.toFixed(2) }}</span>
        </div>
        <USeparator />

        <div className="flex justify-between text-lg font-bold text-gray-900 pt-2">
          <span>Total:</span>
          <span>${{ (orderStore.selectedOrder?.grandTotal || 0).toFixed(2) }}</span>
        </div>
      </div>
      <div class="flex gap-3">
        <UButton block size="lg" variant="outline">
          <Printer class="mr-2 h-5 w-5" />
          Print Invoice
        </UButton>
        <UButton block size="lg" variant="outline">
          <Mail class="mr-2 h-5 w-5" />
          Email Customer
        </UButton>
      </div>
    </template>
  </UModal>
</template>
