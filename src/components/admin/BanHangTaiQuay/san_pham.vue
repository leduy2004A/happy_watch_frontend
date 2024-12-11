<template>
  <div v-for="(product, index) in cartStore.products" :key="index" class="product">
    <img class="product-image" :src="product.hinhAnh" alt="product" />
    
    <div class="product-info">
      <h3 class="product-name">{{ product.tenSanPham }}– {{ product.gioiTinh }} – {{ product.loaiKinhSanPham }} – {{ product.chatLieuVoSanPham }} – {{ product.loaiMaySanPham }} – {{ product.chatLieuDaySanPham }}</h3>
      <p class="old-price">
        <s>{{ cartStore.parseMoney(product.giaSanPham) }}</s>
      </p>
      <p class="new-price">{{ cartStore.parseMoney(product.giaTungSanPham) }}</p>
      <p class="product-size">Màu sắc sản phẩm: {{ product.mauSacSanPham }}</p>
    </div>

    <div class="additional-info">
      <p class="new-price">
        {{ cartStore.parseMoney(cartStore.productTotalPrice(product)) }}
      </p>
    </div>

    <div class="product-quantity">
      <button 
        class="quantity-btn" 
        @click="cartStore.decreaseQuantity(index, product)"
      >-</button>
      <span class="quantity">{{ product.soLuong }}</span>
      <button 
        class="quantity-btn" 
        @click="cartStore.increaseQuantity(index, product)"
      >+</button>
    </div>

    <v-btn class="delete-btn" @click="cartStore.removeProduct(index,product)">
      <v-icon>mdi-trash-can</v-icon>
    </v-btn>
  </div>

  <!-- Total Price Section -->
  <div class="total-price-container">
    <p class="total-label">Tổng tiền</p>
    <p class="total-price">{{ cartStore.parseMoney(cartStore.totalPrice) }}</p>
  </div>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { useSanPhamTrongHoaDonStore } from '@/store/sanPhamTrongHoaDonStore'
import useEmitter from '@/useEmitter'

const props = defineProps({
  lstSanPham: Array,
  hoa_don_id: Number
})

const emitter = useEmitter()
const cartStore = useSanPhamTrongHoaDonStore()

onMounted(() => {
  // Khởi tạo giỏ hàng với dữ liệu từ props
  cartStore.initializeCart(props.lstSanPham, props.hoa_don_id)
  
  // Lắng nghe sự kiện cập nhật sản phẩm
  emitter.on("resultSanPhamHoaDon", data => {
    cartStore.products = data.chiTietHoaDons
  })
})
// Watch thay đổi tổng tiền
watch(() => cartStore.totalPrice, async (newValue) => {
  if (newValue) {
    const result = await cartStore.updateCart()
    emitter.emit("tongsanpham", result)
  }
})
</script>

<style scoped>
.product {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid #ddd;
  width: 100%;
}

.product-checkbox {
  margin-right: 10px;
  flex-shrink: 0;
}

.product-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  margin-right: 10px;
}

.product-info {
  flex-grow: 1;
  margin-right: 10px;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.discount-label {
  background-color: #66cc33;
  color: white;
  font-weight: bold;
  padding: 2px 5px;
  font-size: 12px;
  border-radius: 3px;
  display: inline-block;
  width: fit-content;
}

.product-name {
  margin: 0;
  font-size: 16px;
  font-weight: normal;
}

.old-price {
  font-size: 14px;
  color: gray;
  margin: 0;
}

.new-price {
  color: red;
  font-weight: bold;
  font-size: 16px;
  margin: 0;
}

.product-size {
  font-size: 13px;
  color: #666;
}

.additional-info {
  margin-right: 10px;
  font-size: 14px;
  color: #333;
}

.product-quantity {
  display: flex;
  align-items: center;
  gap: 10px;
}

.quantity-btn {
  border: 1px solid #ccc;
  padding: 5px;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9f9f9;
  cursor: pointer;
  font-size: 18px;
  border-radius: 50%;
}

.quantity {
  font-size: 16px;
  font-weight: bold;
}

.delete-btn {
  background-color: transparent;
  border: none;
  color: red;
  cursor: pointer;
  font-size: 20px;
  padding: 0;
  margin-left: 10px;
}

.total-price-container {
  display: flex;
  justify-content: flex-end;
  padding: 10px 0;
}

.total-label {
  font-weight: bold;
  margin-right: 10px;
}

.total-price {
  color: red;
  font-weight: bold;
  font-size: 18px;
}
</style>
