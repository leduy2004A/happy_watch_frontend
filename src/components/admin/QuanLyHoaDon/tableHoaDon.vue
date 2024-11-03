<template>
  <div>
    <!-- Loading overlay -->
    <v-overlay :model-value="store.isLoading" class="align-center justify-center">
      <v-progress-circular
        indeterminate
        color="primary"
      ></v-progress-circular>
    </v-overlay>

    <!-- Error alert -->
    <v-alert
      v-if="store.error"
      type="error"
      closable
      class="mb-4"
    >
      {{ store.error }}
    </v-alert>

    <!-- Tab navigation -->
    <v-tabs v-model="store.activeTab" class="mb-4 invoice-tabs">
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

    <!-- Refresh button -->
    <v-btn
      icon
      variant="text"
      class="mb-4"
      :disabled="store.isLoading"
      @click="handleRefresh"
    >
      <v-icon>mdi-refresh</v-icon>
    </v-btn>

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
        <tr v-for="invoice in store.paginatedInvoices" :key="invoice.id">
          <td>{{ store.calculateIndex(invoice) }}</td>
          <td>{{ invoice.ma }}</td>
          <td>{{ invoice.quantity }}</td>
          <td>{{ store.formatCurrency(invoice.gia) }}</td>
          <td>
            <v-chip
              v-if="invoice.customerType === 'guest'"
              color="light-green"
              variant="outlined"
              size="small"
              class="mr-2"
            >Khách lẻ</v-chip>
            <span>{{ invoice.tenNguoiNhan }}</span>
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
              :color="store.getStatusColor(invoice.trangThai)"
              variant="outlined"
              size="small"
            >{{ invoice.trangThai }}</v-chip>
          </td>
          <td>
            <v-btn
              icon
              variant="text"
              size="x-small"
              color="grey-darken-1"
              @click="store.viewDetail(invoice.id)"
            >
              <router-link :to="`bill-detail/${invoice.ma}`">
                <v-icon>mdi-eye</v-icon>
              </router-link>
            </v-btn>
          </td>
        </tr>
        <!-- Show empty state when no data -->
        <tr v-if="store.paginatedInvoices.length === 0">
          <td colspan="9" class="text-center py-4">Không có dữ liệu</td>
        </tr>
      </tbody>
    </v-table>

    <!-- Pagination -->
    <div class="d-flex align-center mt-4">
      <span class="text-body-2 mr-4">
        Xem
        <v-select
          v-model="store.itemsPerPage"
          :items="[5, 10, 20, 50]"
          variant="outlined"
          density="compact"
          hide-details
          class="d-inline-block mx-2"
          style="width: 70px"
          @update:model-value="store.setItemsPerPage"
        ></v-select>
        Hoá đơn
      </span>
      <v-pagination
        v-model="store.page"
        :length="store.totalPages"
        :total-visible="5"
        class="ml-auto"
        @update:model-value="store.setPage"
      ></v-pagination>
    </div>
  </div>
</template>

<script setup>
import { quanLyHoaDonStore } from '@/store/quanLyhoaDonStore';
import { onMounted, watch } from 'vue';
import { useToast } from 'vue-toastification';
const toast = useToast()
const store = quanLyHoaDonStore();

onMounted(async () => {
  try {
    await store.fetchData();
  } catch (error) {
    console.error('Failed to fetch invoices:', error);
  }
});

const handleTabChange = async (tab) => {
  store.setActiveTab(tab);
  try {
    await store.fetchData();
  } catch (error) {
    console.error('Failed to fetch invoices after tab change:', error);
  }
};

const handleRefresh = async () => {
  try {
    await store.refreshData();
    toast.success('Dữ liệu đã được cập nhật');
  } catch (error) {
    console.error('Failed to refresh data:', error);
  }
};

watch(() => store.activeTab, (newTab) => {
  store.setActiveTab(newTab);
});
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