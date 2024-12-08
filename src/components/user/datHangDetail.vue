<template>
    <v-app>
      <v-main>
        <v-container>
          <!-- Tiêu đề và thông tin sản phẩm -->
          <v-row class="">
            <v-col>
              <h1 class="brand">{{ useChiTietStore.chiTietSanPham.thuongHieu }}</h1>
              <h2 class="product-title">{{ useChiTietStore.chiTietSanPham.tenSanPham }} – {{ useChiTietStore.chiTietSanPham.gioiTinh }} – {{ useChiTietStore.chiTietSanPham.loaiKinh }} – {{ useChiTietStore.chiTietSanPham.chatLieuVo }} – {{ useChiTietStore.chiTietSanPham.loaiMay }} – {{ useChiTietStore.chiTietSanPham.chatLieuDay }}</h2>
              <p class="product-code">Mã Số Sản Phẩm: {{ useChiTietStore.chiTietSanPham.ma }}</p>
              <p class="price">{{formatPrice(useChiTietStore.chiTietSanPham.giaSauGiam) }}</p>
              <p class="description">{{ useChiTietStore.chiTietSanPham.moTaChiTiet }}</p>
            </v-col>
          </v-row>
          <phan-loai-mau></phan-loai-mau>
          <!-- Các nút chức năng -->
          <v-row  class="button-group mt-4">
            <v-col >
              <v-btn color="red darken-2" block class="mb-2" @click="addToCart(useChiTietStore.chiTietSanPham)" >Thêm Vào Giỏ Hàng</v-btn>
              <v-btn color="blue darken-1" block class="mb-2" @click="muaNgay(useChiTietStore.chiTietSanPham)">Mua Ngay</v-btn>
            </v-col>
          </v-row>
          
          <!-- Thông tin bổ sung -->
          <v-row class="text-center mt-4">
            <v-col>
              <p class="hotline">Gọi đặt mua: <strong>0355512589</strong> (SD-56 support)</p>
            </v-col>
          </v-row>
        </v-container>
      </v-main>
    </v-app>
  </template>
  
  <script setup>
import phanLoaiMau from './phanLoaiMau.vue';
import { useChiTietSanPhamStore } from '@/store/chiTietSanPhamStore';
import { useCartStore } from "@/store/cartStore";
import useEmitter from '@/useEmitter';
import { useRouter } from 'vue-router';
const router = useRouter()
const emitter = useEmitter()
const useChiTietStore = useChiTietSanPhamStore()
const cart = useCartStore()
const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price)
}
const addToCart = (product) => {
  emitter.emit("openModalCart", true);
  cart.addToCart(product);
};
const muaNgay = (product) => {
  const data = [{
    
    id: product.id,
    name:  product.name + '–'+  product.gioiTinh+ '–' +  product.loaiKinh + '–'+ product.chatLieuVo + '-'+ product.loaiMay + '–' +  product.chatLieuDay ,
    price: product.price,
    image: product.image,
    canNang: product.canNang,
    code: product.code,
    quantity: 1,
  }];
  localStorage.setItem("check-out",JSON.stringify(data))
  router.push("/product/checkout");
};
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
  