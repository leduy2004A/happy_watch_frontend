<template>
     <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card class="pa-4">
      <!-- Close Button -->
      <v-btn
        icon
        variant="text"
        size="small"
        color="grey-darken-1"
        class="close-button"
        @click="closeDialog"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>

      <!-- Product Title -->
      <v-card-title class="text-h6 pb-2">
        {{ product.tenSanPham +" "+ product.maSanPham }}
      </v-card-title>

      <!-- Product Details -->
      <v-card-text class="pt-2">
        <v-row dense>
          <v-col cols="12">
            <div class="d-flex justify-space-between">
              <span class="text-grey-darken-1">Kích Thước:</span>
              <span>{{ product.kichThuoc }}</span> 
            </div>
          </v-col>
          
          <v-col cols="12">
            <div class="d-flex justify-space-between">
              <span class="text-grey-darken-1">Xuất xứ:</span>
              <span>{{ product.xuatXu }}</span> 
            </div>
          </v-col>

          <!-- Price -->
          <v-col cols="12">
            <div class="d-flex align-center">
              <span class="text-decoration-line-through text-grey mr-2">
                {{ formatCurrency(product.gia) }}
              </span>
              <span class="text-red font-weight-bold text-h6">
                {{ formatCurrency(product.giaSauGiam) }} 
              </span>
            </div>
          </v-col>

          <!-- Size -->
          <v-col cols="12">
            <div class="d-flex align-center">
              <span class="text-grey-darken-1">Màu sắc: 
                {{ product.tenMauSac }}
              </span>
            </div>
          </v-col>

          <!-- Quantity Selector -->
          <v-col cols="12">
            <div class="d-flex align-center">
              <span class="text-grey-darken-1 mr-4">Số lượng:</span>
              <div class="quantity-selector d-flex">
                <v-btn
                  variant="outlined"
                  density="comfortable"
                  icon
                  size="small"
                  :disabled="quantity <= 1"
                  @click="decrementQuantity"
                >
                  <v-icon>mdi-minus</v-icon>
                </v-btn>
                <v-text-field
                  v-model="quantity"
                  type="number"
                  density="compact"
                  variant="outlined"
                  hide-details
                  class="quantity-input"
                  
                  min="1"
               
                  style="width: 60px"
                ></v-text-field>
                <v-btn
                  variant="outlined"
                  density="comfortable"
                  icon
                  size="small"
                 
                  @click="incrementQuantity"
                >
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
                <!-- <span class="ml-4 text-red"> -->
                  <!-- {{ product.stock }} -->
                   <!-- sản phẩm có sẵn</span> -->
              </div>
            </div>
          </v-col>
        </v-row>
      </v-card-text>

      <!-- Action Button -->
      <v-card-actions class="pt-4">
        <v-btn
          block
          color="orange"
          @click="confirmSelection"
         
        >
          XÁC NHẬN
        </v-btn>
      </v-card-actions>
    </v-card>
    </v-dialog>
</template>
<script setup>
import useEmitter from '@/useEmitter';
import { onMounted, ref, watch } from 'vue';
import { useProductStore } from '@/store/sanPhamStore'
import { useRoute } from 'vue-router';
import { useToast } from 'vue-toastification';
const toast = useToast()
import { addSanPhamVaoHoaDon } from '@/axios/hoadon';
const route = useRoute()
import { danhSachSanPhamHoaDonStore } from '@/store/danhSachSanPhamHoaDonStore';
const danhSachSanPhamStore = danhSachSanPhamHoaDonStore()
 import { useOrderSummaryStore } from '@/store/orderSumaryStore'
const summaryStore = useOrderSummaryStore()
const productStore = useProductStore()
const props = defineProps({
  dialog: Boolean,
  product: Object
})
const dataAdd = ref({
  hoaDonId: 0,
  chiTietSanPhamId: 0,
  gia: 0,
  soLuong:0
})
const emitter = useEmitter()
const dialog = ref(false)
const product = ref({})
const quantity = ref(1) // Thêm biến quantity với giá trị mặc định là 1
onMounted(()=>{
  emitter.on("closeChonSanPham",data =>{
    dialog.value = data
    emitter.emit("closeDialog",false)
  })
})
// Hàm tăng số lượng
const incrementQuantity = () => {
  // Giả sử product.soLuongTon là số lượng tồn kho
  quantity.value++
  if (quantity.value < product.value.soLuongTon) {
    
  }
}

// Hàm giảm số lượng
const decrementQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

// Thêm validator cho input số lượng
const validateQuantity = (event) => {
  const value = parseInt(event.target.value)
  if (isNaN(value) || value < 1) {
    quantity.value = 1
  } else if (value > product.value.soLuongTon) {
    quantity.value = product.value.soLuongTon
  } else {
    quantity.value = value
  }
}

watch(() => props.dialog, (newVal) => {
  if (newVal === true) {
    console.log(newVal)
    dialog.value = newVal
    product.value = props.product
    quantity.value = 1 // Reset quantity khi mở dialog
    console.log(product.value)
  }
})

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(value)
}

// Hàm xác nhận chọn sản phẩm
const confirmSelection =async () => {
 
  // Xử lý logic khi xác nhận chọn sản phẩm với số lượng
  
  if(route.query.id)
  {
    dataAdd.value.hoaDonId = route.query.id
    dataAdd.value.chiTietSanPhamId = product.value.chiTietSanPhamId
    dataAdd.value.gia = product.value.giaSauGiam
    dataAdd.value.soLuong = quantity.value
    try{
          const dataResult = await addSanPhamVaoHoaDon(dataAdd.value)
    if(dataResult.status === 200)
    {
      toast.success("Thêm sản phẩm thành công")
      await danhSachSanPhamStore.fetchProducts(route.params.ma)
      await summaryStore.fetchOrderData(route.params.ma)
      console.log(productStore.products)
      emitter.emit("closeChonSanPham",false)
    }
    }catch(e){
     toast.error( e.response.data.message)
    }

  }
  else{
   
    const data = {
    giaSauGiam: product.value.giaSauGiam,
    chiTietSanPhamId: product.value.chiTietSanPhamId,
    soLuong:quantity.value
  }
  emitter.emit("chiTietSanPhamId", data)
  }

  // Thêm emit event hoặc xử lý khác ở đây
}
const closeDialog = ()=>{
  dialog.value = false
  emitter.emit("closeDialog",false)
}
</script>
<style scoped>
    .quantity-selector{
      align-items: center;
    }
</style>