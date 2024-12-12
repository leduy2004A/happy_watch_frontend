<template>
  <v-card flat class="order-summary pa-4">
    <v-row>
      <!-- Cột bên trái -->
      <v-col cols="12" md="6">
        <div class="d-flex align-center mb-4">
          <div class="text-subtitle-1 text-grey-darken-1 mr-4">Phiếu giảm giá:</div>
          <div class="text-subtitle-1">{{ store.voucher || 'kkkjkjk' }}</div>
        </div>
      </v-col>

      <!-- Cột bên phải -->
      <v-col cols="12" md="6">
        <div class="d-flex justify-space-between align-center mb-4">
          <div class="text-subtitle-1 text-grey-darken-1">Tổng tiền hàng:</div>
          <div class="text-subtitle-1">{{ store.formatPrice(store.subTotal) }}</div>
        </div>
        
        <div class="d-flex justify-space-between align-center mb-4">
          <div class="text-subtitle-1 text-grey-darken-1">Giảm giá:</div>
          <div class="text-subtitle-1">{{ store.formatPrice(store.discount) }}</div>
        </div>

        <div class="d-flex justify-space-between align-center mb-4">
          <div class="text-subtitle-1 text-grey-darken-1">Phí vận chuyển:</div>
          <div class="text-h6 font-weight-bold text-red-500">
            {{ store.formatPrice(store.shippingFee) }}
          </div>
        </div>

        <v-divider class="my-4"></v-divider>

        <div class="d-flex justify-space-between align-center">
          <div class="text-subtitle-1 font-weight-bold">Tổng tiền:</div>
          <div class="text-h6 font-weight-bold text-red-500">
            {{ store.formatPrice(store.total) }}
          </div>
        </div>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useOrderSummaryStore } from '@/store/orderSumaryStore'

const route = useRoute()
const store = useOrderSummaryStore()

onMounted(async () => {
  await store.fetchOrderData(route.params.ma)
})
</script>
  
  <style scoped>
  .order-summary {
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .shipping-input :deep(.v-field__input) {
    text-align: right;
  }
  
  /* Đảm bảo text field không bị overflow */
  .shipping-input {
    min-width: 120px;
  }
  
  @media (max-width: 600px) {
    .order-summary {
      padding: 16px;
    }
  }
  </style>