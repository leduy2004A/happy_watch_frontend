<template>
  <v-card class="product-list pa-4" flat>
    <div class="d-flex justify-space-between">
      <h5 class="text-h6 font-weight-bold">Danh sách sản phẩm</h5>
      <v-btn @click="openDialog" color="green" v-if="useQuanLyCacNut.nutThemSanPham">Thêm sản phẩm</v-btn>
    </div>

    <v-divider class="mb-4"></v-divider>
    
    <div v-for="product in store.getFormattedPrices" 
         :key="product.id" 
         class="product-item mb-4">
      <v-row align="center">
        <v-col cols="12" sm="2">
          <v-img
            :src="product.hinhAnh"
            :alt="product.name"
            height="100"
            contain
            class="bg-grey-lighten-2 rounded"
          ></v-img>
        </v-col>
        
        <v-col cols="12" sm="4">
          <div class="product-info">
            <h3 class="text-subtitle-1 font-weight-medium mb-1">{{ product.tenSanPham }} - {{ product.gioiTinh }} - {{ product.loaiKinhSanPham }} - {{ product.chatLieuVoSanPham }} - {{ product.loaiMaySanPham }} - {{ product.chatLieuDaySanPham }}</h3>
            <div class="text-red-500 mb-1">{{ product.formattedPrice }}</div>
            <div class="text-body-2 text-grey">Dòng sản phẩm: {{ product.maSanPham }}</div>
            <div class="text-body-2 text-grey">Phân loại: {{ product.maSanPhamChiTiet }}</div>
          </div>
        </v-col>
        
        <v-col cols="12" sm="3">
          <div class="d-flex align-center justify-center">
            <v-btn
              density="comfortable"
              icon="mdi-minus"
              variant="outlined"
              v-if="useQuanLyCacNut.nutTruSanPham"
              @click="store.decreaseQuantity(product)"
              :disabled="product.soLuong <= 1"
            ></v-btn>
            
            <div class="mx-4 text-body-1">{{ product.soLuong }}</div>
            
            <v-btn
              density="comfortable"
              icon="mdi-plus"
              variant="outlined"
              v-if="useQuanLyCacNut.nutCongSanPham"
              @click="store.increaseQuantityDSSPHoaDon(product)"
            ></v-btn>
          </div>
        </v-col>
        
        <v-col cols="12" sm="3" class="text-right">
          <div class="text-red-500 text-h6 font-weight-bold">
            {{ product.formattedTotalPrice }}
                  <v-btn flat color="red" @click="huySanPhamKhoiHoaDon(product)" v-if="useQuanLyCacNut.nutHuySanPhamTrongHoaDon">
            <v-icon >mdi-delete-circle</v-icon>
          </v-btn>
          </div>
    
          
        </v-col>
      </v-row>
      <v-divider class="mt-4"></v-divider>
    </div>
  </v-card>
  <dialog_sanpham :modal="store.getShowDialog"></dialog_sanpham>
</template>

<script setup>
import { quanLyCacNut } from '@/store/quanLyCacNut';
const useQuanLyCacNut = quanLyCacNut()
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { danhSachSanPhamHoaDonStore } from '@/store/danhSachSanPhamHoaDonStore';
import dialog_sanpham from '../BanHangTaiQuay/dialog_sanpham.vue';
import useEmitter from '@/useEmitter';
const emitter = useEmitter();
const route = useRoute();
const store = danhSachSanPhamHoaDonStore();

const openDialog = () => {
  store.toggleDialog(true);
  emitter.on("close_dialog", data => {
    store.toggleDialog(data);
  });
}
const huySanPhamKhoiHoaDon = async (product)=>{
  await store.xoaSanPham(product.chiTietHoaDonId)

}
onMounted(async () => {
  await store.fetchProducts(route.params.ma);
});
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
</style>