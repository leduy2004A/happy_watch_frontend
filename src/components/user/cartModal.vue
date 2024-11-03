<template>
  <v-container>
    <v-list height="500">
      <template v-for="(item, index) in cart.items" :key="index">
        <v-list-item>
          <v-row>
            <v-col cols="4">
              <v-img :src="item.image" class="rounded-lg" contain></v-img>
            </v-col>
            <v-col cols="6">
              <div class="font-weight-medium">{{ item.name }}</div>
              <div class="text-body-2">{{ item.quantity }} × {{ formatPrice(item.price) }}</div>
            </v-col>
            <v-col cols="2" class="d-flex align-center justify-end">
         
                <v-icon class="delete-icon" @click="removeItem(item.id)">mdi-delete</v-icon>
           
            </v-col>
          </v-row>
        </v-list-item>
        <v-divider v-if="index < cartItems.length - 1"></v-divider>
      </template>
    </v-list>

    <v-row class="mt-4" justify="space-between" align="center">
      <v-col cols="auto" class="font-weight-medium">Tổng số phụ:</v-col>
      <v-col cols="auto" class="font-weight-bold">{{ formatPrice(cart.cartTotal) }}</v-col>
    </v-row>

    <v-divider class="my-4"></v-divider>

    <v-row justify="space-between">
      <v-btn outlined color="black" class="text-uppercase">Xem giỏ hàng</v-btn>
      <v-btn color="red" dark class="text-uppercase">Thanh toán</v-btn>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useCartStore } from '@/store/cartStore';
const cart = useCartStore()
const cartItems = ref([
  {
    name: "ĐỒNG HỒ CITIZEN AU1080-20A NAM ECO-DRIVE DÂY VẢI",
    quantity: 1,
    price: 5040000,
    image: "https://cdn.pixabay.com/photo/2023/04/26/17/59/wrist-watch-7953062_640.jpg",
  },
  {
    name: "ĐỒNG HỒ OMEGA SEAMASTER",
    quantity: 1,
    price: 12530000,
    image: "https://cdn.pixabay.com/photo/2023/04/26/17/59/wrist-watch-7953062_640.jpg",
  },
  // Thêm các sản phẩm khác ở đây...
]);

const totalPrice = computed(() => {
  return cartItems.value.reduce((total, item) => total + item.price * item.quantity, 0);
});

function formatPrice(value) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
}

function removeItem(id) {
  cart.removeFromCart(id)
}
</script>

<style scoped>
.v-card {
  max-width: 400px;
  margin: auto;
}
.v-img {
  height: 80px;
}
.delete-icon {
  font-size: 20px;
  transition: transform 0.2s;
}
.delete-icon:hover {
  transform: scale(1.2);
}
</style>
