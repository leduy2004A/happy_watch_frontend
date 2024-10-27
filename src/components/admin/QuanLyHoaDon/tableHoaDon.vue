<template>
  <div>
    <!-- Tab navigation -->
    <v-tabs v-model="activeTab" class="mb-4 invoice-tabs">
      <v-tab value="all" class="text-body-2 font-weight-medium px-4">TẤT CẢ</v-tab>
      <v-tab value="cancelled" class="text-body-2 font-weight-medium px-4">ĐÃ HỦY</v-tab>
      <v-tab value="pending" class="text-body-2 font-weight-medium px-4">CHỜ XÁC NHẬN</v-tab>
      <v-tab value="waiting" class="text-body-2 font-weight-medium px-4">CHỜ GIAO HÀNG</v-tab>
      <v-tab value="shipping" class="text-body-2 font-weight-medium px-4">ĐANG VẬN CHUYỂN</v-tab>
      <v-tab value="delivered" class="text-body-2 font-weight-medium px-4">ĐÃ GIAO HÀNG</v-tab>
      <v-tab value="paid" class="text-body-2 font-weight-medium px-4">ĐÃ THANH TOÁN</v-tab>
      <v-tab value="pending_payment" class="text-body-2 font-weight-medium px-4">CHỜ THANH TOÁN</v-tab>
      <v-tab value="completed" class="text-body-2 font-weight-medium px-4">HOÀN THÀNH</v-tab>
    </v-tabs>

    <!-- Table -->
    <v-table class="invoice-table">
      <thead>
        <tr>
          <th class="text-body-2 font-weight-medium">#</th>
          <th class="text-body-2 font-weight-medium">Mã</th>
          <th class="text-body-2 font-weight-medium">Tổng SP</th>
          <th class="text-body-2 font-weight-medium">Tổng số tiền</th>
          <th class="text-body-2 font-weight-medium">Tên khách hàng</th>
          <th class="text-body-2 font-weight-medium">Ngày tạo</th>
          <th class="text-body-2 font-weight-medium">Loại hoá đơn</th>
          <th class="text-body-2 font-weight-medium">Trạng thái</th>
          <th class="text-body-2 font-weight-medium">Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="invoice in paginatedInvoices" :key="invoice.id">
          <td>{{ calculateIndex(invoice) }}</td>
          <td>{{ invoice.code }}</td>
          <td>{{ invoice.quantity }}</td>
          <td>{{ formatCurrency(invoice.total) }}</td>
          <td>
            <v-chip
              v-if="invoice.customerType === 'guest'"
              color="light-green"
              variant="outlined"
              size="small"
              class="mr-2"
            >Khách lẻ</v-chip>
            <span>{{ invoice.customerName }}</span>
          </td>
          <td>{{ invoice.createdAt }}</td>
          <td>
            <v-chip
              :color="invoice.type === 'offline' ? 'light-green' : 'primary'"
              variant="outlined"
              size="small"
            >
              {{ invoice.type === "offline" ? "Tại quầy" : "Trực tuyến" }}
            </v-chip>
          </td>
          <td>
            <v-chip
              :color="getStatusColor(invoice.status)"
              variant="outlined"
              size="small"
            >{{ invoice.status }}</v-chip>
          </td>
          <td>
            <v-btn
              icon
              variant="text"
              size="x-small"
              color="grey-darken-1"
              @click="viewDetail(invoice.id)"
            >
              <router-link to="bill-detail">
                <v-icon>mdi-eye</v-icon>
              </router-link>
            </v-btn>
          </td>
        </tr>
        <!-- Show empty state when no data -->
        <tr v-if="paginatedInvoices.length === 0">
          <td colspan="9" class="text-center py-4">Không có dữ liệu</td>
        </tr>
      </tbody>
    </v-table>

    <!-- Pagination -->
    <div class="d-flex align-center mt-4">
      <span class="text-body-2 mr-4">
        Xem
        <v-select
          v-model="itemsPerPage"
          :items="[5, 10, 20, 50]"
          variant="outlined"
          density="compact"
          hide-details
          class="d-inline-block mx-2"
          style="width: 70px"
          @update:model-value="handleItemsPerPageChange"
        ></v-select>
        Hoá đơn
      </span>
      <v-pagination
        v-model="page"
        :length="totalPages"
        :total-visible="5"
        class="ml-auto"
        @update:model-value="handlePageChange"
      ></v-pagination>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";

const activeTab = ref("all");
const page = ref(1);
const itemsPerPage = ref(5);

// Sample data with unique IDs
const invoices = ref([
  {
    id: 1,
    code: "HD13",
    quantity: 1,
    total: 157750,
    customerName: "Nguyễn Thị Thùy Dương",
    customerType: "registered",
    createdAt: "21/12/2023 13:48",
    type: "offline",
    status: "Chờ xác nhận",
  },
  {
    id: 2,
    code: "HD10",
    quantity: 6,
    total: 2127500,
    customerName: "Khách lẻ",
    customerType: "guest",
    createdAt: "21/12/2023 13:48",
    type: "offline",
    status: "Hoàn thành",
  },
  {
    id: 3,
    code: "HD14",
    quantity: 3,
    total: 457750,
    customerName: "Trần Văn An",
    customerType: "registered",
    createdAt: "21/12/2023 14:20",
    type: "offline",
    status: "Chờ xác nhận",
  },
  // Add more invoices with unique IDs...
]);

// Filter invoices based on active tab
const filteredInvoices = computed(() => {
  if (activeTab.value === "all") {
    return invoices.value;
  }
  
  const statusMap = {
    cancelled: "Đã hủy",
    pending: "Chờ xác nhận",
    waiting: "Chờ giao hàng",
    shipping: "Đang vận chuyển",
    delivered: "Đã giao hàng",
    paid: "Đã thanh toán",
    pending_payment: "Chờ thanh toán",
    completed: "Hoàn thành"
  };

  return invoices.value.filter(invoice => 
    invoice.status === statusMap[activeTab.value]
  );
});

// Calculate total pages
const totalPages = computed(() => {
  return Math.max(1, Math.ceil(filteredInvoices.value.length / itemsPerPage.value));
});

// Get paginated invoices
const paginatedInvoices = computed(() => {
  const startIndex = (page.value - 1) * itemsPerPage.value;
  const endIndex = startIndex + itemsPerPage.value;
  return filteredInvoices.value.slice(startIndex, endIndex);
});

// Calculate index for each row
const calculateIndex = (invoice) => {
  const index = filteredInvoices.value.indexOf(invoice);
  return index + 1 + (page.value - 1) * itemsPerPage.value;
};

// Format currency
const formatCurrency = (value) => {
  return new Intl.NumberFormat("vi-VN").format(value) + " đ";
};

// Get status color
const getStatusColor = (status) => {
  const colorMap = {
    "Chờ xác nhận": "warning",
    "Hoàn thành": "pink",
    "Chờ giao hàng": "warning",
    "Đã hủy": "error",
    "Đang vận chuyển": "info",
    "Đã giao hàng": "success",
    "Đã thanh toán": "green",
    "Chờ thanh toán": "orange",
  };
  return colorMap[status] || "grey";
};

// Handle page change
const handlePageChange = (newPage) => {
  page.value = newPage;
};

// Handle items per page change
const handleItemsPerPageChange = (newItemsPerPage) => {
  itemsPerPage.value = newItemsPerPage;
  // Reset to first page when changing items per page
  page.value = 1;
};

// Watch for active tab changes
watch(activeTab, () => {
  // Reset to first page when changing tabs
  page.value = 1;
});

// View detail handler
const viewDetail = (id) => {
  console.log("View detail:", id);
};
</script>

<style scoped>
.invoice-tabs {
  border-bottom: 1px solid #e0e0e0;
}
:deep(.v-table) {
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}
:deep(.v-table th) {
  background-color: #f5f5f5 !important;
  color: rgba(0, 0, 0, 0.87) !important;
  font-weight: 500 !important;
  font-size: 0.875rem;
  white-space: nowrap;
}
:deep(.v-table td) {
  font-size: 0.875rem;
  color: rgba(0, 0, 0, 0.87);
  height: 48px;
}
:deep(.v-chip) {
  font-size: 0.75rem !important;
}
:deep(.v-chip--size-small) {
  --v-chip-size: 24px;
}
:deep(.v-pagination .v-btn) {
  min-width: 34px;
  height: 34px;
  padding: 0 6px;
}
:deep(.v-select .v-field) {
  border-radius: 4px;
}
</style>