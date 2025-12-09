<!-- components/DashboardContent.vue -->
<template>
  <div>
    <!-- Stats Grid -->
    <div class="mb-8 grid grid-cols-2 gap-2 md:gap-6 lg:grid-cols-4">
      <UCard v-for="(stat, idx) in stats" :key="idx" class="transition-shadow hover:shadow-lg">
        <template #header>
          <div class="flex items-start justify-between">
            <div
              :class="`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg ${stat.color}`"
            >
              <UIcon :name="stat.icon" class="h-6 w-6 text-white" />
            </div>
            <UBadge :color="stat.trend === 'up' ? 'green' : 'red'" variant="subtle" size="xs">
              <template #leading>
                <UIcon
                  :name="stat.trend === 'up' ? 'i-lucide-trending-up' : 'i-lucide-trending-down'"
                  class="h-3 w-3"
                />
              </template>
              {{ stat.change }}
            </UBadge>
          </div>
        </template>

        <p class="text-sm text-gray-600 dark:text-gray-400">{{ stat.title }}</p>
        <p class="mt-1 text-lg font-bold text-gray-900 sm:text-2xl dark:text-white">
          {{ stat.value }}
        </p>
      </UCard>
    </div>

    <div class="grid grid-cols-1">
      <!-- Recent Orders -->
      <div class="lg:col-span-1">
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-bold text-gray-900 dark:text-white">Recent Orders</h3>
                <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">Latest customer orders</p>
              </div>
              <UButton
                label="View All"
                variant="link"
                trailing-icon="i-heroicons-chevron-right-20-solid"
              />
            </div>
          </template>

          <UTable :rows="recentOrders" :columns="orderColumns">
            <template #status-data="{ row }">
              <UBadge
                :label="row.status"
                :color="statusColorMap[row.status.toLowerCase()]"
                variant="soft"
                size="sm"
              />
            </template>

            <template #time-data="{ row }">
              <span class="text-sm text-gray-500 dark:text-gray-400">{{ row.date }}</span>
            </template>

            <template #action-data>
              <UButton
                icon="i-heroicons-eye"
                size="xs"
                color="gray"
                variant="ghost"
                square
                padded
              />
            </template>
          </UTable>
        </UCard>
      </div>

      <!-- Top Products -->
      <!-- <UCard>
        <template #header>
          <div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">Top Products</h3>
            <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">Best selling items</p>
          </div>
        </template>

        <div class="divide-y divide-gray-200 dark:divide-gray-800">
          <div
            v-for="(product, idx) in topProducts"
            :key="idx"
            class="flex items-center justify-between py-4"
          >
            <div>
              <p class="font-semibold text-gray-900 dark:text-white">{{ product.name }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ product.sales }} sales</p>
            </div>
            <div class="text-right">
              <p class="font-bold text-gray-900 dark:text-white">{{ product.revenue }}</p>
              <div
                :class="product.trend === 'up' ? 'text-green-600' : 'text-red-600'"
                class="mt-1 flex items-center justify-end gap-1"
              >
                <UIcon
                  :name="product.trend === 'up' ? 'i-lucide-trending-up' : 'i-lucide-trending-down'"
                  class="h-4 w-4"
                />
              </div>
            </div>
          </div>
        </div>
      </UCard> -->
    </div>

    <!-- Quick Actions -->
    <div class="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
      <UCard class="border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
        <h3 class="mb-2 text-lg font-bold">Add New Product</h3>
        <p class="mb-6 text-sm text-blue-100">Create a new product listing</p>
        <UButton
          to="/products/add"
          label="Add Product"
          color="white"
          class="font-semibold"
          viewTransition
        />
      </UCard>

      <UCard class="border-0 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
        <h3 class="mb-2 text-lg font-bold">View Reports</h3>
        <p class="mb-6 text-sm text-purple-100">Check detailed analytics</p>
        <UButton label="View Reports" color="white" class="font-semibold" />
      </UCard>

      <UCard class="border-0 bg-gradient-to-br from-green-500 to-green-600 text-white">
        <h3 class="mb-2 text-lg font-bold">Manage Orders</h3>
        <p class="mb-6 text-sm text-green-100">Process pending orders</p>
        <UButton label="Manage Orders" color="white" class="font-semibold" />
      </UCard>
    </div>
  </div>
</template>

<script setup>
import { useHeaderStore } from '~/stores/header.store'

definePageMeta({
  layout: 'admin',
})

const headerStore = useHeaderStore()

onBeforeMount(() => {
  headerStore.setHeaders('Dashboard', 'This is admin dashboard page')
})

useSeoMeta({
  title: 'Dashboard | Admin',
  description: 'Overview of your admin dashboard',
})

// Stats Data
const stats = [
  {
    title: 'Total Revenue',
    value: '$45,231',
    change: '+20.1%',
    trend: 'up',
    icon: 'i-lucide-dollar-sign',
    color: 'from-blue-500 to-blue-600',
  },
  {
    title: 'Total Orders',
    value: '1,234',
    change: '+12.5%',
    trend: 'up',
    icon: 'i-lucide-shopping-cart',
    color: 'from-green-500 to-green-600',
  },
  {
    title: 'Total Products',
    value: '456',
    change: '+4.3%',
    trend: 'up',
    icon: 'i-lucide-package',
    color: 'from-purple-500 to-purple-600',
  },
  {
    title: 'Total Customers',
    value: '8,492',
    change: '-2.4%',
    trend: 'down',
    icon: 'i-lucide-users',
    color: 'from-orange-500 to-orange-600',
  },
]

// Recent Orders
const recentOrders = [
  {
    id: '#12345',
    customer: 'John Doe',
    product: 'Cotton T-Shirt',
    amount: '$29.99',
    status: 'Completed',
    date: '2 min ago',
  },
  {
    id: '#12344',
    customer: 'Sarah Smith',
    product: 'Denim Jacket',
    amount: '$89.99',
    status: 'Processing',
    date: '15 min ago',
  },
  {
    id: '#12343',
    customer: 'Mike Johnson',
    product: 'Sneakers',
    amount: '$129.99',
    status: 'Shipped',
    date: '1 hour ago',
  },
  {
    id: '#12342',
    customer: 'Emma Wilson',
    product: 'Summer Dress',
    amount: '$59.99',
    status: 'Completed',
    date: '2 hours ago',
  },
  {
    id: '#12341',
    customer: 'David Lee',
    product: 'Leather Belt',
    amount: '$34.99',
    status: 'Pending',
    date: '3 hours ago',
  },
]

// Top Products
const topProducts = [
  { name: 'Classic White T-Shirt', sales: 342, revenue: '$10,260', trend: 'up' },
  { name: 'Denim Jeans', sales: 298, revenue: '$23,840', trend: 'up' },
  { name: 'Leather Jacket', sales: 156, revenue: '$31,200', trend: 'down' },
  { name: 'Running Shoes', sales: 234, revenue: '$28,080', trend: 'up' },
]

// Table Columns
const orderColumns = [
  { id: 'id', header: 'Order ID' },
  { id: 'customer', header: 'Customer' },
  { id: 'product', header: 'Product' },
  { id: 'amount', header: 'Amount' },
  { id: 'status', header: 'Status' },
  { id: 'time', header: 'Time' },
  { id: 'action', header: '', class: 'text-right' },
]

// Status Badge Colors
const statusColorMap = {
  completed: 'green',
  processing: 'blue',
  shipped: 'purple',
  pending: 'yellow',
}
</script>
