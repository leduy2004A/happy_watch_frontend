<template>
  <v-card class="payment-history-card" variant="outlined">
    <!-- Header Section -->
    <div class="header-section d-flex justify-space-between align-center">
      <h5 class="text-h6 font-weight-bold">Lịch sử thanh toán</h5>
      <v-btn 
        color="warning" 
        @click="store.setModalThanhToan(true)" 
        v-if="useQuanLyCacNut.nutThanhToan"
      >
        Thanh toán
      </v-btn>
    </div>

    <v-divider class="my-4"></v-divider>

    <!-- Search and Table Section -->
    <div class="table-section">
      <v-data-table
        :headers="store.headers"
        :items="store.paymentData"
        :search="store.search"
        :items-per-page="5"
        class="payment-table elevation-0"
        :footer-props="{
          'items-per-page-options': [5, 10, 15],
          'items-per-page-text': 'Số dòng mỗi trang',
        }"
      >
        <!-- Amount Column -->
        <template v-slot:item.soTien="{ item }">
          <span class="font-weight-medium">
            {{ store.formatCurrency(item.soTien) }}
          </span>
        </template>

        <!-- Time Column -->
        <template v-slot:item.ngayThanhToan="{ item }">
          <div class="time-cell">
            <span class="date">{{ store.formatDate(item.ngayThanhToan) }}</span>
            <span class="time">{{ store.formattedTime(item.ngayThanhToan) }}</span>
          </div>
        </template>

        <!-- Transaction Type Column -->
        <template v-slot:item.transactionType="{ item }">
          <v-chip
            small
            :color="store.getTransactionTypeColor(item.transactionType)"
            class="transaction-chip"
            outlined
          >
            {{ item.transactionType }}
          </v-chip>
        </template>

        <!-- Payment Method Column -->
        <template v-slot:item.phuongThuc="{ item }">
          <v-chip
            small
            :color="store.getPaymentMethodColor(item.phuongThuc)"
            class="payment-method-chip"
            outlined
          >
            {{ item.phuongThuc }}
          </v-chip>
        </template>

        <!-- Status Column -->
        <template v-slot:item.status="{ item }">
          <v-chip
            small
            :color="store.getStatusColor(item.status)"
            class="status-chip"
            outlined
          >
            {{ item.status }}
          </v-chip>
        </template>
      </v-data-table>
    </div>
  </v-card>
  <dialog-thanh-toan-hoa-don
    :modal="store.modalThanhToan"
  ></dialog-thanh-toan-hoa-don>
</template>

<script setup>
import { onMounted,watch } from "vue";
import { usePaymentHistoryStore } from '@/store/paymentHistoryStore';
import { quanLyCacNut } from '@/store/quanLyCacNut';
import DialogThanhToanHoaDon from "./DialogThanhToanHoaDon.vue";
import useEmitter from "@/useEmitter";
import { useRoute } from "vue-router";

const store = usePaymentHistoryStore();
const useQuanLyCacNut = quanLyCacNut();
const emitter = useEmitter();
const route = useRoute();

onMounted(async () => {
  emitter.on("close_dialogthanhtoan", (data) => {
    store.setModalThanhToan(data);
  });
  
  await store.fetchPaymentHistory(route.params.ma);
});
// watch(() => route.params.ma, async (newVal) => {
//   if (newVal) {
//     try {
//       await store.fetchPaymentHistory(newVal);
//     } catch (error) {
//       // Xử lý lỗi
//     }
//   }
// }, {
//   immediate: true // Gọi ngay lập tức khi component mounted
// });
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
