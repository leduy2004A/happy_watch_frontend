<template>
   <div class="order-details flex-grow-1 pr-md-4" style="min-width: 280px; flex-basis: 60%;">
          <!-- Delivery Info -->
          <v-card class="mb-6" elevation="0">
            <v-card-title class="py-2 px-4">
              <v-icon left color="primary">mdi-truck-delivery-outline</v-icon>
              Thông tin giao hàng
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="pt-4">
              <div class="delivery-info">
                <div class="mb-2">
                  <div class="font-weight-medium">{{ dataDiaChi.tenNguoiNhan }}</div>
                  <div>{{ dataDiaChi.dienThoai }}</div>
                </div>
                <div class="grey--text">
                    {{ dataDiaChi.xaPhuongThiTran }}, {{ dataDiaChi.quanHuyen }}, {{ dataDiaChi.diaChiCuThe }}, {{ dataDiaChi.tinhThanhPho }}
                </div>
              </div>
            </v-card-text>
          </v-card>
  
          <!-- Products List -->

        </div>
</template>
<script setup>
  import { thongTinGiaoHang } from '@/axios/quanlihoadon';
  import { useRoute } from 'vue-router';
  const route = useRoute()
import { onMounted, ref } from 'vue';
const dataDiaChi = ref({

})
  onMounted(async ()=>{
    const result =await thongTinGiaoHang(route.params.ma)
    if(result.status === 200)
    {
      dataDiaChi.value = result.data
    }
  })
</script>
<style scoped>
    
</style>