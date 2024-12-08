<template>
  <v-container class="cart-container">
    <v-row class="text-center">
      <v-col>
        <h2 class="cart-title">GIỎ HÀNG</h2>
      </v-col>
    </v-row>

    <v-row class="cart-header py-4">
      <v-col cols="5">Sản phẩm</v-col>
      <v-col cols="2">Giá</v-col>
      <v-col cols="3" class="text-center">Số lượng</v-col>
      <v-col cols="2" class="text-center">Tạm tính</v-col>
    </v-row>

    <v-divider class="mb-4"></v-divider>

    <v-row v-for="(item, index) in store.items" :key="index" class="cart-item align-center py-4">
      <v-col cols="1">
        <v-icon @click="removeItem(item.id)" class="remove-icon">mdi-close</v-icon>
      </v-col>
      <v-col cols="4" class="d-flex align-center">
        <img :src="item.image" width="80" class="mr-3 product-image" />
        <div class="product-name">{{ item.name }} – {{ item.gioiTinh }} – {{ item.loaiKinh }} – {{ item.chatLieuVo }} – {{ item.loaiMay }} – {{ item.chatLieuDay }}</div>
      </v-col>
      <v-col cols="2" class="product-price">{{ formatPrice(item.price) }}</v-col>
      <v-col cols="3" class="text-center">
        <div class="d-flex justify-center align-center">
          <v-btn icon small @click="decrementQuantity(item.id,item.quantity)">
            <v-icon>mdi-minus</v-icon>
          </v-btn>
          <input
            v-model="item.quantity"
            @change="changeQuantity(item.id,item.quantity)"
            type="number"
            min="1"
            class="quantity-input mx-2"
            style="width: 50px; text-align: center;"
          />
          <v-btn icon small @click="incrementQuantity(item.id,item.quantity)">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </div>
      </v-col>
      <v-col cols="2" class="product-subtotal text-center">{{ formatPrice(item.price * item.quantity) }}</v-col>
    </v-row>

    <v-divider class="my-4"></v-divider>

  </v-container>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useCartStore } from '@/store/cartStore';
const store = useCartStore()
const discountCode = ref('');
const cartItems = ref([
  {
    image: 'https://images.pexels.com/photos/1120275/pexels-photo-1120275.jpeg?cs=srgb&dl=pexels-philip-lindvall-300724-1120275.jpg&fm=jpg',
    name: 'ĐỒNG HỒ CITIZEN AU1080-20A NAM ECO-DRIVE DÂY VẢI',
    price: 5040000,
    quantity: 1,
    subtotal: 5040000,
  },
  {
    image: 'https://images.pexels.com/photos/1120275/pexels-photo-1120275.jpeg?cs=srgb&dl=pexels-philip-lindvall-300724-1120275.jpg&fm=jpg',
    name: 'ĐỒNG HỒ TISSOT T063.907.11.058.00 NAM TỰ ĐỘNG DÂY INOX',
    price: 21940000,
    quantity: 2,
    subtotal: 43880000,
  },
]);

function formatPrice(value) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
}

function updateSubtotal(index) {
  cartItems.value[index].subtotal = cartItems.value[index].price * cartItems.value[index].quantity;
}

function incrementQuantity(id,quantity) {
  quantity++;
  store.updateQuantity(id,quantity)
  updateSubtotal(index);
}

function decrementQuantity(id,quantity) {
  if (quantity > 1) {
    quantity--;
    store.updateQuantity(id,quantity)
    updateSubtotal(index);
  }
}

function removeItem(id) {
  store.removeFromCart(id)
}

function applyDiscount() {
  alert(`Mã ưu đãi "${discountCode.value}" đã được áp dụng!`);
}

function updateCart() {
  alert('Giỏ hàng đã được cập nhật!');
}
const changeQuantity = (id,item)=>{
  console.log(id)
  store.updateQuantity(id,item)
}
onMounted(async ()=>{
  await store.loadFromLocalStorage()
})
</script>


<style scoped>
.cart-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
}

.cart-title {
  font-size: 2rem;
  font-weight: bold;
  color: #ff5722;
  margin-bottom: 1.5rem;
}

.cart-header {
  background-color: #eee;
  font-weight: bold;
  border-radius: 8px;
  padding: 1rem;
  color: #333;
}

.cart-item {
  border-bottom: 1px solid #e0e0e0;
  transition: background-color 0.3s ease;
}
.cart-item:hover {
  background-color: #f1f1f1;
  border-radius: 8px;
}

.remove-icon {
  cursor: pointer;
  color: #ff5722;
  transition: color 0.3s ease;
}
.remove-icon:hover {
  color: #e53935;
}

.product-image {
  border-radius: 8px;
  border: 1px solid #ddd;
}

.product-name {
  font-weight: 500;
  color: #333;
}

.product-price,
.product-subtotal {
  font-weight: 500;
  color: #333;
}

.quantity-input {
  max-width: 50px;
  text-align: center;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 4px;
}

.cart-actions {
  align-items: center;
}

.discount-input {
  max-width: 200px;
}

.apply-btn,
.update-btn {
  background-color: #ff5722;
  color: white;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}
.apply-btn:hover,
.update-btn:hover {
  background-color: #e53935;
}
</style>