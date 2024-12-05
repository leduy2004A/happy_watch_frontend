<template>
  <v-card class="product-list pa-4" variant="outlined" v-if="products?.chiTietTraHangList">
    <h5 class="text-h6 font-weight-bold">Danh sách sản phẩm trả hàng</h5>
    <v-divider class="mb-4"></v-divider>
    
    <div v-for="product in products.chiTietTraHangList" :key="product.idChiTietSanPham" class="product-item mb-4">
      <v-row align="center">
        <v-col cols="12" sm="2">
          <v-img
            :src="product.hinhAnh"
            height="100"
            contain
            class="bg-grey-lighten-2 rounded"
          ></v-img>
        </v-col>
        
        <v-col cols="12" sm="4">
          <div class="product-info">
            <h3 class="text-subtitle-1 font-weight-medium mb-1">{{ product.chiTietSanPhamDayDuDTO.tenSanPham }}</h3>
            <div class="text-body-2 text-grey">Phân Loại: {{ product.chiTietSanPhamDayDuDTO.ma }}</div>
            <div class="text-body-2 text-grey">x{{ product.soLuongTra }}</div>
          </div>
        </v-col>
        
        <v-col cols="12" sm="3">
          <p>{{ product.ghiChu }}</p>
        </v-col>
        
        <v-col cols="12" sm="3" class="text-right">
          <div class="text-red-500 text-h6 font-weight-bold">
            {{ formatPrice(product.giaTriHoan) }}
          </div>
        </v-col>
      </v-row>
      <v-divider class="mt-4"></v-divider>
    </div>
    <div class="tongtien">
      <b>Tổng tiền hoàn trả</b>
      <b>{{ formatPrice(products.tongGiaTriHoan) }}</b>
    </div>
    
  </v-card>
</template>
  <script setup>
  import { onMounted, ref } from 'vue';
  import { layTraHang } from '@/axios/quanlihoadon';
  import { useRoute } from 'vue-router';
  const route = useRoute()
  const products = ref({});
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };
  
  const increaseQuantity = (product) => {
    if (product.selectedQuantity < product.quantity) {
      product.selectedQuantity++;
    }
  };
  
  const decreaseQuantity = (product) => {
    if (product.selectedQuantity > 1) {
      product.selectedQuantity--;
    }
  };
  onMounted(async ()=>{
    const result = await layTraHang(route.params.ma)
    if(result.status === 200)
    {
      products.value = result.data
      console.log(products.value)
    }
    console.log(products.value)
  })
  </script>
  
  <style scoped>
  .product-list {
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .product-item {
    transition: all 0.3s ease;
  }
  
  .product-item:hover {
    background-color: rgb(250, 250, 250);
  }
  
  .product-info {
    line-height: 1.5;
  }
  .tongtien{
    display: flex;
    justify-content: space-between;
    font-size: 20px;
    color: orange;
  }
  </style>