<template>
  <v-container class="pa-4">
    <!-- Filters section -->
    <v-card class="mb-4" elevation="1">
      <v-card-text>
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="filters.search"
              prepend-inner-icon="mdi-magnify"
              placeholder="Tìm kiếm theo mã hóa đơn"
              density="comfortable"
              variant="outlined"
              hide-details
              class="mb-2"
              clearable
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              v-model="filters.dateRange"
              :items="dateRanges"
              label="Thời gian"
              variant="outlined"
              density="comfortable"
              hide-details
              clearable
              item-title="title"
              item-value="value"
            ></v-select>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Status tabs -->
    <v-card class="mb-4" elevation="1">
      <v-card-text class="pa-0">
        <v-tabs
          v-model="activeTab"
          color="primary"
          show-arrows
          slider-color="primary"
        >
          <v-tab
            v-for="status in orderStatuses"
            :key="status.value"
            :value="status.value"
            class="text-body-2 font-weight-medium"
          >
            <v-icon start :icon="status.icon" class="mr-1"></v-icon>
            {{ status.text }}
            <v-chip
              size="x-small"
              color="primary"
              class="ml-2"
              variant="tonal"
            >
              {{ getStatusCount(status.value) }}
            </v-chip>
          </v-tab>
        </v-tabs>
      </v-card-text>
    </v-card>

    <!-- No data message -->
    <v-card v-if="!loading && filteredOrders.length === 0" class="text-center pa-4">
      <v-icon icon="mdi-alert-circle-outline" size="48" color="grey"></v-icon>
      <div class="text-h6 mt-2">Không tìm thấy đơn hàng nào</div>
      <div class="text-body-2 text-grey">Vui lòng thử lại với bộ lọc khác</div>
    </v-card>

    <!-- Orders list -->
    <v-row v-else>
      <v-col cols="12" v-for="item in paginatedOrders" :key="item.maHoaDon">
        <v-card
          :elevation="2"
          :class="{'border-primary': isSelected(item.maHoaDon)}"
          @click="selectOrder(item.maHoaDon)"
          hover
        >
          <v-card-item>
            <template v-slot:prepend>
              <v-icon
                :icon="getStatusIcon(item.trangThai)"
                :color="getStatusColor(item.trangThai)"
                size="large"
                class="mr-4"
              ></v-icon>
            </template>
            
            <v-card-title class="d-flex justify-space-between align-center pa-0">
              <div class="d-flex align-center">
                <span class="text-h6">Mã đơn: {{ item.maHoaDon }}</span>
                <v-chip
                  :color="getStatusColor(item.trangThai)"
                  :text-color="getStatusTextColor(item.trangThai)"
                  size="small"
                  class="ml-4"
                  variant="tonal"
                >
                  {{ getStatusText(item.trangThai) }}
                </v-chip>
              </div>
            </v-card-title>

            <v-card-text class="pt-4">
              <v-row>
                <v-col cols="12" sm="6" md="3">
                  <div class="text-caption text-medium-emphasis">Ngày đặt</div>
                  <div class="text-body-2 font-weight-medium">
                    {{ formatDate(item.ngayDatHang) }}
                  </div>
                </v-col>
    
                <v-col cols="12" sm="6" md="3">
                  <div class="text-caption text-medium-emphasis">Phí vận chuyển</div>
                  <div class="text-body-2 font-weight-medium">
                    {{ formatCurrency(item.phiShip) }}
                  </div>
                </v-col>
                <v-col cols="12" sm="6" md="3">
                  <div class="text-caption text-medium-emphasis">Tổng tiền</div>
                  <div class="text-h6 font-weight-bold text-primary">
                    {{ formatCurrency(item.tongTienHoaDon) }}
                  </div>
                </v-col>
              </v-row>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions class="pa-4">
              <v-spacer></v-spacer>
              <v-btn
                variant="outlined"
                color="primary"
                prepend-icon="mdi-eye"
                @click.stop="viewOrderDetails(item.maHoaDon)"
              >
                Xem chi tiết
              </v-btn>
              <v-btn
                v-if="canCancel(item.trangThai)"
                variant="outlined"
                color="error"
                prepend-icon="mdi-cancel"
                @click.stop="cancelOrder(item.maHoaDon)"
                class="ml-2"
              >
                Hủy đơn
              </v-btn>
            </v-card-actions>
          </v-card-item>
        </v-card>
      </v-col>
    </v-row>

    <!-- Pagination -->
    <v-card v-if="filteredOrders.length > 0" class="mt-4" elevation="1">
      <v-card-text class="d-flex align-center justify-space-between flex-wrap">
        <div class="text-body-2 mb-2 mb-sm-0">
          Hiển thị {{ Math.min(startIndex + 1, filteredOrders.length) }}-{{ endIndex }} 
          trên tổng số {{ filteredOrders.length }} đơn hàng
        </div>
        <v-pagination
          v-model="currentPage"
          :length="totalPages"
          :total-visible="5"
          rounded="circle"
          :disabled="loading"
          class="mb-2 mb-sm-0"
        ></v-pagination>
        <v-select
          v-model="itemsPerPage"
          :items="[5, 10, 15, 20]"
          label="Số đơn/trang"
          variant="outlined"
          density="compact"
          hide-details
          class="items-per-page-select"
        ></v-select>
      </v-card-text>
    </v-card>

    <!-- Loading overlay -->
    <v-overlay
      :model-value="loading"
      class="align-center justify-center"
      persistent
    >
      <v-progress-circular
        size="64"
        color="primary"
        indeterminate
      ></v-progress-circular>
    </v-overlay>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { layHoaDonTheoNguoiDung } from '@/axios/quanlihoadon'

const router = useRouter()
const loading = ref(false)
const dataHoaDon = ref([])
const selectedOrders = ref(new Set())
const currentPage = ref(1)
const itemsPerPage = ref(5)
const activeTab = ref('all')

// Filters
const filters = ref({
  search: '',
  dateRange: null
})

// Order statuses with icons
const orderStatuses = [
  { value: 'all', text: 'TẤT CẢ', icon: 'mdi-view-list' },
  // { value: 'pending', text: 'CHỜ XÁC NHẬN', icon: 'mdi-clock-outline' },
  { value: 'Confirmed', text: 'ĐÃ XÁC NHẬN', icon: 'mdi-check-decagram' },
  { value: 'Awaiting Shipment', text: 'CHỜ GIAO HÀNG', icon: 'mdi-package-variant' },
  { value: 'In Transit', text: 'ĐANG VẬN CHUYỂN', icon: 'mdi-truck-delivery' },
  { value: 'Delivered', text: 'ĐÃ GIAO HÀNG', icon: 'mdi-package-variant-closed' },
  { value: 'Paid', text: 'ĐÃ THANH TOÁN', icon: 'mdi-cash-check' },
  { value: 'Pending Payment', text: 'CHỜ XÁC NHẬN', icon: 'mdi-cash-clock' },
  { value: 'Completed', text: 'HOÀN THÀNH', icon: 'mdi-check-circle' },
  { value: 'Cancelled', text: 'ĐÃ HỦY', icon: 'mdi-cancel' }
]

const dateRanges = [
  { title: 'Hôm nay', value: 'today' },
  { title: '7 ngày qua', value: '7days' },
  { title: '30 ngày qua', value: '30days' },
  { title: '90 ngày qua', value: '90days' }
]

// Computed properties
const filteredOrders = computed(() => {
  if (!dataHoaDon.value || !Array.isArray(dataHoaDon.value)) return []
  
  let filtered = [...dataHoaDon.value]

  // Filter by status
  if (activeTab.value !== 'all') {
    filtered = filtered.filter(order => order.trangThai === activeTab.value)
  }

  // Filter by search
  if (filters.value.search) {
    const searchLower = filters.value.search.toLowerCase().trim()
    filtered = filtered.filter(order => 
      order.maHoaDon?.toLowerCase().includes(searchLower)
    )
  }

  // Filter by date range
  if (filters.value.dateRange) {
    const now = new Date()
    let startDate = new Date()
    
    switch (filters.value.dateRange) {
      case 'today':
        startDate.setHours(0, 0, 0, 0)
        break
      case '7days':
        startDate.setDate(startDate.getDate() - 7)
        break
      case '30days':
        startDate.setDate(startDate.getDate() - 30)
        break
      case '90days':
        startDate.setDate(startDate.getDate() - 90)
        break
    }

    filtered = filtered.filter(order => {
      if (!order.ngayDatHang) return false
      const orderDate = new Date(order.ngayDatHang)
      return orderDate >= startDate && orderDate <= now
    })
  }

  return filtered
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredOrders.value.length / itemsPerPage.value)))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage.value, filteredOrders.value.length))
const paginatedOrders = computed(() => {
  const start = startIndex.value
  const end = endIndex.value
  return filteredOrders.value.slice(start, end)
})

// Methods
const loadOrders = async () => {
  loading.value = true
  try {
    const result = await layHoaDonTheoNguoiDung()
    if (result?.data && Array.isArray(result.data)) {
      dataHoaDon.value = result.data
    } else {
      console.error('Invalid data format received:', result)
      dataHoaDon.value = []
    }
  } catch (error) {
    console.error('Error loading orders:', error)
    dataHoaDon.value = []
  } finally {
    loading.value = false
  }
}

const selectOrder = (orderId) => {
  if (selectedOrders.value.has(orderId)) {
    selectedOrders.value.delete(orderId)
  } else {
    selectedOrders.value.add(orderId)
  }
}

const isSelected = (orderId) => selectedOrders.value.has(orderId)

const viewOrderDetails = (orderId) => {
  if (orderId) {
    router.push(`/profile/don-hang/${orderId}`)
  }
}

const canCancel = (status) => {
  return ['pending', 'waiting'].includes(status)
}

const getStatusCount = (status) => {
  if (!Array.isArray(dataHoaDon.value)) return 0
  if (status === 'all') return dataHoaDon.value.length
  return dataHoaDon.value.filter(order => order.trangThai === status).length
}

const getStatusColor = (status) => {
  const statusColors = {
    pending: 'warning',
    'Awaiting Shipment': 'info',
    'In Transit': 'primary',
    'Delivered': 'success',
    'Confirmed': 'success',
    'Cancelled': 'error',
    'Completed': 'success',
    'Paid': 'success',
    'Pending Payment': 'warning'
  }
  return statusColors[status] || 'grey'
}
const getStatusTextColor = (status) => {
  const statusColors = {
    pending: 'warning-darken-2',
    waiting: 'info-darken-2',
    shipping: 'primary-darken-2',
    delivered: 'success-darken-2',
    cancelled: 'error-darken-2',
    completed: 'success-darken-2',
    paid: 'success-darken-2',
    pending_payment: 'warning-darken-2'
  }
  return statusColors[status] || 'grey-darken-2'
}

const getStatusIcon = (status) => {
  const statusItem = orderStatuses.find(s => s.value === status)
  return statusItem ? statusItem.icon : 'mdi-help-circle'
}

const getStatusText = (status) => {
  const statusItem = orderStatuses.find(s => s.value === status)
  return statusItem ? statusItem.text : 'Không xác định'
}

const formattedTime = (dateTime) => {
  if (!dateTime) return '--:--'
  try {
    const date = new Date(dateTime)
    if (isNaN(date.getTime())) return '--:--'
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  } catch (error) {
    console.error('Error formatting time:', error)
    return '--:--'
  }
}

const formatDate = (dateTime) => {
  if (!dateTime) return '---'
  try {
    const date = new Date(dateTime)
    if (isNaN(date.getTime())) return '---'
    const formattedDate = date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    const time = formattedTime(dateTime)
    return `${formattedDate} ${time}`
  } catch (error) {
    console.error('Error formatting date:', error)
    return '---'
  }
}

const formatCurrency = (value) => {
  if (!value || isNaN(value)) return '0 ₫'
  try {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  } catch (error) {
    console.error('Error formatting currency:', error)
    return '0 ₫'
  }
}

// Watchers
watch([filters, activeTab], () => {
  currentPage.value = 1 // Reset to first page when filters change
}, { deep: true })

watch(filteredOrders, (newValue) => {
  // Ensure current page is valid based on new filtered results
  const maxPage = Math.ceil(newValue.length / itemsPerPage.value)
  if (currentPage.value > maxPage && maxPage > 0) {
    currentPage.value = maxPage
  }
})

watch(itemsPerPage, () => {
  currentPage.value = 1 // Reset to first page when items per page changes
})

// Error handling for data loading
const handleError = (error) => {
  console.error('Error in order table:', error)
  // You can implement your error handling logic here
  // For example, showing a notification or error message
}

// Load data on mount
onMounted(async () => {
  try {
    await loadOrders()
  } catch (error) {
    handleError(error)
  }
})

</script>

