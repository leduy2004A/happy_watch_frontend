<template>
  <v-card class="payment-history-card" variant="outlined">
    <!-- Header Section -->
    <div class="header-section d-flex justify-space-between align-center">
      <h5 class="text-h6 font-weight-bold">Lịch sử thanh toán</h5>
    </div>
    
    <v-divider class="my-4"></v-divider>

    <!-- Search and Table Section -->
    <div class="table-section">
      <v-data-table
        :headers="header"
        :items="paymentData"
        :search="search"
        :items-per-page="5"
        class="payment-table elevation-0"
        :footer-props="{
          'items-per-page-options': [5, 10, 15],
          'items-per-page-text': 'Số dòng mỗi trang'
        }"
      >
        <!-- Amount Column -->
        <template v-slot:item.amount="{ item }">
          <span class="font-weight-medium">{{ formatCurrency(item.amount) }}</span>
        </template>

        <!-- Time Column -->
        <template v-slot:item.time="{ item }">
          <div class="time-cell">
            <span class="date">{{ formatDate(item.time) }}</span>
            <span class="time">{{ formatTime(item.time) }}</span>
          </div>
        </template>

        <!-- Transaction Type Column -->
        <template v-slot:item.transactionType="{ item }">
          <v-chip
            small
            :color="getTransactionTypeColor(item.transactionType)"
            class="transaction-chip"
            outlined
          >
            {{ item.transactionType }}
          </v-chip>
        </template>

        <!-- Payment Method Column -->
        <template v-slot:item.paymentMethod="{ item }">
          <v-chip
            small
            :color="getPaymentMethodColor(item.paymentMethod)"
            class="payment-method-chip"
            outlined
          >
            {{ item.paymentMethod }}
          </v-chip>
        </template>

        <!-- Status Column -->
        <template v-slot:item.status="{ item }">
          <v-chip
            small
            :color="getStatusColor(item.status)"
            class="status-chip"
            outlined
          >
            {{ item.status }}
          </v-chip>
        </template>
      </v-data-table>
    </div>
  </v-card>
</template>

<script setup>
import { ref } from 'vue';

// Define reactive variables
const search = ref('');
const header = ref([
  { title: 'Số tiền', align: 'start', key: 'amount' },    // text -> title, value -> key
  { title: 'Thời gian', align: 'start', key: 'time' },
  { title: 'Loại giao dịch', align: 'center', key: 'transactionType' },
  { title: 'PTTT', align: 'center', key: 'paymentMethod' },
  { title: 'Trạng thái', align: 'center', key: 'status' },
  { title: 'Ghi chú', align: 'start', key: 'note' },
  { title: 'Nhân viên xác nhận', align: 'start', key: 'staff' },
]);

const paymentData = ref([
  {
    amount: 835253,
    time: '2023-12-21 14:34:16',
    transactionType: 'Thanh toán',
    paymentMethod: 'Tiền mặt',
    status: 'Thành công',
    note: '-',
    staff: 'Nguyễn Văn Nhật'
  },
  // Thêm dữ liệu mẫu khác nếu cần
]);

// Define methods
function formatCurrency(value) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(value);
}

function formatDate(dateTime) {
  const date = new Date(dateTime);
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

function formatTime(dateTime) {
  const date = new Date(dateTime);
  return date.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

function getTransactionTypeColor(type) {
  return {
    'Thanh toán': 'indigo lighten-4 indigo--text',
    'Hoàn tiền': 'purple lighten-4 purple--text'
  }[type] || 'grey lighten-4 grey--text';
}

function getPaymentMethodColor(method) {
  return {
    'Tiền mặt': 'orange lighten-4 orange--text',
    'Chuyển khoản': 'blue lighten-4 blue--text'
  }[method] || 'grey lighten-4 grey--text';
}

function getStatusColor(status) {
  return {
    'Thành công': 'green lighten-4 green--text',
    'Thất bại': 'red lighten-4 red--text',
    'Đang xử lý': 'amber lighten-4 amber--text'
  }[status] || 'grey lighten-4 grey--text';
}
</script>


<style scoped>
.payment-history-card {
  max-width: 100%;
  margin: auto;
}
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.search-bar {
  max-width: 250px;
}
.payment-table {
  margin-top: 20px;
}

.payment-history-card {
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05) !important;
}

.header-section {
  margin-bottom: 20px;
}

.header-section h5 {
  color: #1e293b;
  font-size: 1.25rem !important;
  letter-spacing: 0.25px;
}

.v-divider {
  border-color: rgba(0, 0, 0, 0.08);
}

.search-field {
  max-width: 300px;
}

.payment-table {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
}

.payment-table :v-deep .v-data-table__wrapper {
  border-radius: 8px;
  overflow: hidden;
}

.payment-table :v-deep .v-data-table-header {
  background-color: #f8fafc !important;
}

.payment-table :v-deep .v-data-table-header th {
  font-weight: 600 !important;
  color: #475569 !important;
  text-transform: uppercase;
  font-size: 0.75rem !important;
  letter-spacing: 0.5px;
  padding: 16px !important;
  white-space: nowrap;
  border-bottom: 1px solid #e2e8f0 !important;
}

.payment-table :v-deep .v-data-table__wrapper td {
  padding: 16px !important;
  font-size: 0.875rem;
  color: #1e293b;
  border-bottom: 1px solid #e2e8f0 !important;
}

.time-cell {
  display: flex;
  flex-direction: column;
}

.time-cell .date {
  color: #1e293b;
  font-weight: 500;
}

.time-cell .time {
  color: #64748b;
  font-size: 0.75rem;
  margin-top: 2px;
}

.transaction-chip,
.payment-method-chip,
.status-chip {
  font-size: 0.75rem !important;
  height: 24px !important;
}

.v-chip {
  font-weight: 500 !important;
}


.payment-table :v-deep .v-data-table__wrapper tr:hover {
  background-color: #f8fafc !important;
}


.payment-table :v-deep .v-data-footer {
  border-top: 1px solid #e2e8f0;
  background-color: #f8fafc;
}

/* Responsive adjustments */

</style>