<template>
  <div v-for="(product, index) in sanPham" :key="index" class="product">
    <input type="checkbox" class="product-checkbox" />

    <img class="product-image" :src="product.hinhAnh[0]" alt="product" />

    <div class="product-info">
      <div class="discount-label">{{ product.discount }}%</div>
      <h3 class="product-name">{{ product.tenSanPham }}</h3>
      <p class="old-price"><s>{{ parseMoney(product.giaSanPham) }}</s></p>
      <p class="new-price">{{ parseMoney(product.giaTungSanPham) }}</p>
      <p class="product-size">Màu sắc sản phẩm: {{ product.mauSacSanPham }}</p>
    </div>

    <div class="additional-info">
      <p class="new-price">{{ parseMoney(productTotalPrice(product)) }}</p>
    </div>

    <div class="product-quantity">
      <button class="quantity-btn" @click="decreaseQuantity(index,product)">-</button>
      <span class="quantity">{{ product.soLuong }}</span>
      <button class="quantity-btn" @click="increaseQuantity(index,product)">+</button>
    </div>

    <v-btn class="delete-btn" @click="removeProduct(index)">
      <v-icon>mdi-trash-can</v-icon>
    </v-btn>
  </div>

  <!-- Total Price Section -->
  <div class="total-price-container">
    <p class="total-label">Tổng tiền</p>
    <p class="total-price">{{ parseMoney(totalPrice) }}</p>
  </div>
</template>

<script setup>
import { addSoLuongSanPham } from '@/axios/hoadon';
import { truSoLuongSanPham } from '@/axios/hoadon';
import { getSanPhamTheoHoaDon } from '@/axios/hoadon';
import useEmitter from '@/useEmitter';
const emitter = useEmitter()
const props = defineProps({
  lstSanPham:Array,
  hoa_don_id:Number
})
import { ref, computed, onMounted, watch } from 'vue'
const sanPham = ref([...props.lstSanPham])
const tongDataSanPham = ref({...props.tongSanPhamTrongHoaDon})
onMounted(()=>{
  emitter.on("resultSanPhamHoaDon",data=>{
    sanPham.value = data.chiTietHoaDons
})
})
const products = ref([
  {
    name: 'Balenc Grey 2023 Bạc Đế nhựa',
    pricePerUnit: 137500,
    oldPrice: 250000,
    quantity: 1,
    size: 41,
    discount: 45,
    image: 'https://donghoolevs.vn/wp-content/uploads/2022/10/hinh-anh-chinh-5-5.jpg',
  },
  // Add more products here if needed
  {
    name: 'Another Product',
    pricePerUnit: 100000,
    oldPrice: 200000,
    quantity: 2,
    size: 42,
    discount: 50,
    image: 'https://donghoolevs.vn/wp-content/uploads/2022/10/hinh-anh-chinh-5-5.jpg',
  }
])

const totalPrice = computed(() => {
  return sanPham.value.reduce((sum, product) => sum + product.giaSanPham * product.soLuong, 0)
})

const productTotalPrice = (product) => {
  return product.giaSanPham * product.soLuong
}

const parseMoney = (money) => {
  return money.toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND'
  })
}

const increaseQuantity = async (index, product) => {
  try {
    await addSoLuongSanPham(product.chiTietHoaDonId)
    // Cập nhật state local thay vì props
    sanPham.value[index].soLuong++
  } catch (error) {
    console.error('Lỗi khi tăng số lượng:', error)
  }
}

const decreaseQuantity = async (index, product) => {
  try {
    if (sanPham.value[index].soLuong > 1) {
      await truSoLuongSanPham(product.chiTietHoaDonId)
      // Cập nhật state local thay vì props 
      sanPham.value[index].soLuong--
    }
  } catch (error) {
    console.error('Lỗi khi giảm số lượng:', error) 
  }
}

const removeProduct = (index) => {
  products.value.splice(index, 1)
}
watch(totalPrice, async (newQuestion, oldQuestion) => {
  if(newQuestion)
  {
    const result = (await getSanPhamTheoHoaDon(props.hoa_don_id)).data;
    emitter.emit("tongsanpham",result)
   
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
