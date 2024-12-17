<template>
  <div class="cart-container">
    <ScrollPanel style="height: 500px">
      <div v-for="(item, index) in cart.items" :key="index" class="cart-item">
        <div class="grid">
          <div class="col-4">
            <img :src="item.image" :alt="item.name" class="cart-item-image" />
          </div>
          <div class="col-6">
            <div class="font-bold">{{ item.name }} – {{ item.gioiTinh }} – {{ item.loaiKinh }} – {{ item.chatLieuVo }} – {{ item.loaiMay }} – {{ item.chatLieuDay }}</div>
            <div class="text-sm">{{ item.quantity }} × {{ formatPrice(item.price) }}</div>
          </div>
          <div class="col-2 flex align-items-center justify-content-end">
            <Button 
              icon="pi pi-trash" 
              @click="removeItem(item.id)" 
              severity="danger" 
              text 
              class="delete-button p-0"
            />
          </div>
        </div>
        <Divider v-if="index < cartItems.length - 1" />
      </div>
    </ScrollPanel>

    <div class="mt-4 flex justify-content-between align-items-center">
      <span class="font-medium">Tổng số phụ:</span>
      <span class="font-bold">{{ formatPrice(cart.cartTotal) }}</span>
    </div>

    <Divider class="my-4" />

    <div class="flex justify-content-between">
      <router-link :to="`/product/cart`">
        <Button 
          label="Xem giỏ hàng" 
          outlined 
          class="p-button-outlined"
          @click="viewGioHang()"
        />
      </router-link>
      
      <Button :disabled="cart.items.length === 0"
        label="Thanh toán" 
        severity="danger"
        @click="checkOutCart()"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useCartStore } from '@/store/cartStore';
import { useRouter } from 'vue-router';
import useEmitter from '@/useEmitter';
const emitter = useEmitter()
const router = useRouter()
const cart = useCartStore();
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
  cart.removeFromCart(id);
}
const checkOutCart = ()=>{

  localStorage.setItem("check-out",localStorage.getItem("cart-items"))
  emitter.emit("closeCartModal", false);
  router.push("/product/checkout")
}
const viewGioHang = ()=>{
  cart.loadFromLocalStorage()
  emitter.emit("closeCartModal", false);
}
onMounted(async ()=>{
  await cart.loadFromLocalStorage()
})
</script>

<style scoped>
.cart-container {
  max-width: 400px;
  margin: auto;
  padding: 1rem;
}

.cart-item {
  margin-bottom: 1rem;
}

.cart-item-image {
  width: 100%;
  height: 80px;
  object-fit: contain;
  border-radius: 8px;
}

.delete-button {
  transition: transform 0.2s;
}

.delete-button:hover {
  transform: scale(1.2);
}

:deep(.p-button) {
  text-transform: uppercase;
}

:deep(.p-divider) {
  margin: 1rem 0;
}

:deep(.p-scrollpanel) {
  .p-scrollpanel-wrapper {
    border-radius: 4px;
  }
  .p-scrollpanel-content {
    padding: 1rem;
  }
}
</style>