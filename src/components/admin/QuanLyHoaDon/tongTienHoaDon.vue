<template>
    <v-card flat class="order-summary pa-4">
      <v-row>
        <!-- Cột bên trái -->
        <v-col cols="12" md="6">
          <div class="d-flex align-center mb-4">
            <div class="text-subtitle-1 text-grey-darken-1 mr-4">Phiếu giảm giá:</div>
            <div class="text-subtitle-1">{{ voucher || 'kkkjkjk' }}</div>
          </div>
          <div class="d-flex align-center">
            <div class="text-subtitle-1 text-grey-darken-1 mr-4">Giảm giá từ cửa hàng:</div>
            <div class="text-subtitle-1">{{ storeDiscount }}%</div>
          </div>
        </v-col>
  
        <!-- Cột bên phải -->
        <v-col cols="12" md="6">
          <div class="d-flex justify-space-between align-center mb-4">
            <div class="text-subtitle-1 text-grey-darken-1">Tổng tiền hàng:</div>
            <div class="text-subtitle-1">{{ formatPrice(subTotal) }}</div>
          </div>
          
          <div class="d-flex justify-space-between align-center mb-4">
            <div class="text-subtitle-1 text-grey-darken-1">Giảm giá:</div>
            <div class="text-subtitle-1">{{ formatPrice(discount) }}</div>
          </div>
  
          <div class="d-flex justify-space-between align-center mb-4">
            <div class="text-subtitle-1 text-grey-darken-1">Phí vận chuyển:</div>
            <v-text-field
              v-model="shippingFee"
              density="compact"
              variant="outlined"
              hide-details
              class="shipping-input"
              style="max-width: 150px"
            ></v-text-field>
          </div>
  
          <v-divider class="my-4"></v-divider>
  
          <div class="d-flex justify-space-between align-center">
            <div class="text-subtitle-1 font-weight-bold">Tổng tiền:</div>
            <div class="text-h6 font-weight-bold text-red-500">{{ formatPrice(total) }}</div>
          </div>
        </v-col>
      </v-row>
    </v-card>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  
  // State
  const voucher = ref('kkkjkjk')
  const storeDiscount = ref(0)
  const subTotal = ref(950000)
  const discount = ref(95000)
  const shippingFee = ref('59003')
  
  // Computed
  const total = computed(() => {
    return subTotal.value - discount.value + parseInt(shippingFee.value || 0)
  })
  
  // Methods
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }
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