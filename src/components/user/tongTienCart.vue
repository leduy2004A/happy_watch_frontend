<template>
    <v-card class="pa-4" outlined>
      <v-row>
        <v-col>
          <h3>Cộng giỏ hàng</h3>
        </v-col>
      </v-row>
      <v-divider></v-divider>
      
      <v-row class="mt-4">
        <v-col cols="6">Tạm tính</v-col>
        <v-col cols="6" class="text-right">{{ formatPrice(cart.cartTotal) }}</v-col>
      </v-row>
      
      <v-divider></v-divider>
      
      <v-row class="mt-4">
        <v-col cols="6">Tổng</v-col>
        <v-col cols="6" class="text-right">{{ formatPrice(cart.cartTotal) }}</v-col>
      </v-row>
      
      <v-row class="mt-4">
        <v-col>
          <v-btn color="red" class="white--text" block @click="proceedToCheckout">
            TIẾN HÀNH THANH TOÁN
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
  </template>
  
  <script setup>
import { ref } from 'vue';
import { useCartStore } from '@/store/cartStore';
const cart = useCartStore()
// Khai báo props
const props = defineProps({
  subtotal: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
});

// Định nghĩa hàm formatPrice
const formatPrice = (value) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

// Định nghĩa hàm proceedToCheckout
const proceedToCheckout = () => {
  alert("Đang chuyển đến trang thanh toán...");
};
</script>

  
  <style scoped>
  .v-btn {
    font-weight: bold;
  }
  </style>
  