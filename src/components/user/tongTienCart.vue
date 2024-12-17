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
          <v-btn color="red" class="white--text" block @click="checkOutCart()" :disabled="cart.items.length === 0">
            TIẾN HÀNH THANH TOÁN
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
  </template>
  
  <script setup>
import { ref } from 'vue';
import { useCheckOutStore } from '@/store/checkOutStore';
import { useCartStore } from '@/store/cartStore';
const cart = useCartStore()
const checkOutStore = useCheckOutStore()
import { useRouter } from 'vue-router';
const router = useRouter()
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
const checkOutCart = ()=>{
  const data =JSON.parse(localStorage.getItem("cart-items")) 
  localStorage.setItem("check-out",localStorage.getItem("cart-items"))
  
//   const dataPickList = data.map(product => ({
//   productGoc: product,
//   soLuongChon: product.quantity,
//   tongCanNang: product.quantity * product.canNang  // Tính toán tongCanNang
// }));

//   // // Thêm sản phẩm mới vào trước
//   // productSelect.value.push(dataPick)

//   // Sau đó mới tính tổng cân nặng
//   const tongCanNangList = dataPickList.reduce((total, item) => {
//     return total + item.tongCanNang
//   }, 0)
  
//   console.log(tongCanNangList)
//   checkOutStore.tongCanNang = tongCanNangList
  
//   // Thêm vào store
//   checkOutStore.addProduct(dataPickList)
  
//   console.log(checkOutStore.products)
  router.push("/product/checkout")
}
// Định nghĩa hàm proceedToCheckout
</script>

  
  <style scoped>
  .v-btn {
    font-weight: bold;
  }
  </style>
  