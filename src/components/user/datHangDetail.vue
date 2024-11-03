<template>
    <v-app>
      <v-main>
        <v-container>
          <!-- Tiêu đề và thông tin sản phẩm -->
          <v-row class="">
            <v-col>
              <h1 class="brand">DOXA</h1>
              <h2 class="product-title">{{ useChiTietStore.chiTietSanPham.tenSanPham }} – {{ useChiTietStore.chiTietSanPham.gioiTinh }} – {{ useChiTietStore.chiTietSanPham.loaiKinh }} – {{ useChiTietStore.chiTietSanPham.chatLieuVo }} – {{ useChiTietStore.chiTietSanPham.loaiMay }} – {{ useChiTietStore.chiTietSanPham.chatLieuDay }}</h2>
              <p class="product-code">Mã Số Sản Phẩm: {{ useChiTietStore.chiTietSanPham.ma }}</p>
              <p class="price">{{formatPrice(useChiTietStore.chiTietSanPham.giaSauGiam) }}</p>
              <p class="description">Mẫu Doxa D173TCM khoác lên phong cách đẳng cấp khi mặt số với thiết kế tinh xảo đính kèm các viên kim cương nổi bật trên nền kính Sapphire thời trang sang trọng phối cùng mẫu dây đeo demi.</p>
            </v-col>
          </v-row>
          <phan-loai-mau></phan-loai-mau>
          <!-- Các nút chức năng -->
          <v-row  class="button-group mt-4">
            <v-col >
              <v-btn color="grey darken-1" block class="mb-2">Xem Showroom Còn Hàng</v-btn>
              <v-btn color="red darken-2" block class="mb-2">Thêm Vào Giỏ Hàng</v-btn>
              <v-btn color="blue darken-1" block class="mb-2">Trả Góp Qua Thẻ (Visa, Master, JCB)</v-btn>
              <v-btn color="blue darken-3" block class="mb-2">Mua Trả Góp - Duyệt Hồ Sơ Trong 3 Phút</v-btn>
            </v-col>
          </v-row>
          
          <!-- Thông tin bổ sung -->
          <v-row class="text-center mt-4">
            <v-col>
              <p class="payment-info">Có thanh toán: Trả góp khi mua Online (Qua thẻ tín dụng)</p>
              <p class="hotline">Gọi đặt mua: <strong>1900.6777</strong> (8:00 - 1:30)</p>
            </v-col>
          </v-row>
        </v-container>
      </v-main>
    </v-app>
  </template>
  
  <script setup>
import phanLoaiMau from './phanLoaiMau.vue';
import { useChiTietSanPhamStore } from '@/store/chiTietSanPhamStore';
const useChiTietStore = useChiTietSanPhamStore()
const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price)
}
  </script>
  
  <style scoped>
  .brand {
    font-weight: bold;
    font-size: 24px;
    color: black;
  }
  .product-title {
    font-weight: bold;
    font-size: 18px;
    color: #333;
  }
  .product-code {
    font-size: 14px;
    color: #666;
  }
  .price {
    font-weight: bold;
    font-size: 24px;
    color: red;
  }
  .description {
    font-size: 14px;
    color: #777;
  }
  .button-group .v-btn {
    color: white;
    font-weight: bold;
    font-size: 16px;
  }
  .payment-info, .hotline {
    font-size: 14px;
    color: #666;
  }
  .hotline strong {
    color: #333;
  }
  </style>
  