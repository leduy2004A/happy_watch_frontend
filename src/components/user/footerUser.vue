<template>
    <v-footer class="bg-black px-4 py-8">
      <v-container>
        <!-- Main Footer Content -->
        <v-row>
          <!-- Links Sections -->
          <v-col cols="12" md="8">
            <v-row>
              <!-- Liên Kết Section -->
              <v-col cols="12" sm="3">
                <h3 class="text-white text-uppercase mb-4">Liên Kết</h3>
                <v-list class="bg-transparent pa-0">
                  <v-list-item
                    v-for="(item, i) in lienKetItems"
                    :key="i"
                    :title="item"
                    class="px-0"
                    density="compact"
                    link
                    text-color="grey"
                  ></v-list-item>
                </v-list>
              </v-col>
  
              <!-- Danh Mục Section -->
              <v-col cols="12" sm="3">
                <h3 class="text-white text-uppercase mb-4">Danh Mục</h3>
                <v-list class="bg-transparent pa-0">
                  <v-list-item
                    v-for="(item, i) in danhMucItems"
                    :key="i"
                    :title="item"
                    class="px-0"
                    density="compact"
                    link
                    text-color="grey"
                  ></v-list-item>
                </v-list>
              </v-col>
  
              <!-- Chính Sách Section -->
              <v-col cols="12" sm="3">
                <h3 class="text-white text-uppercase mb-4">Chính Sách</h3>
                <v-list class="bg-transparent pa-0">
                  <v-list-item
                    v-for="(item, i) in chinhSachItems"
                    :key="i"
                    :title="item"
                    class="px-0"
                    density="compact"
                    link
                    text-color="grey"
                  ></v-list-item>
                </v-list>
              </v-col>
  
              <!-- Hỗ Trợ Section -->
              <v-col cols="12" sm="3">
                <h3 class="text-white text-uppercase mb-4">Hỗ Trợ</h3>
                <v-list class="bg-transparent pa-0">
                  <v-list-item
                    v-for="(item, i) in hoTroItems"
                    :key="i"
                    :title="item"
                    class="px-0"
                    density="compact"
                    link
                    text-color="grey"
                  ></v-list-item>
                </v-list>
              </v-col>
            </v-row>
          </v-col>
  
          <!-- Newsletter Section -->
          <v-col cols="12" md="4">
            <h3 class="text-white text-uppercase mb-4">
              Nhận tất cả các tin tức mới nhất.
            </h3>
            <v-form @submit.prevent="subscribe">
              <v-text-field
                v-model="email"
                label="Nhập email..."
                variant="outlined"
                density="compact"
                bg-color="white"
                hide-details
                class="subscribe-input"
              >
                <template v-slot:append>
                  <v-btn
                    color="black"
                    class="text-uppercase"
                    height="40"
                  >
                    Đăng ký
                  </v-btn>
                </template>
              </v-text-field>
            </v-form>
          </v-col>
        </v-row>
  
        <!-- Bottom Footer -->
        <v-divider class="my-6 border-opacity-25"></v-divider>
        
        <v-row align="center">
          <v-col cols="12" md="6">
            <div class="text-grey text-body-2">
              © Thiết kế và lập trình bởi 
              <a href="#" class="text-decoration-none text-grey">
                MONA.Media / Website
              </a>
            </div>
          </v-col>
          <v-col cols="12" md="6" class="text-md-right">
            <v-row justify="end" no-gutters>
              <v-img
                v-for="(payment, i) in payments"
                :key="i"
                :src="payment"
                max-width="60"
                class="mx-2"
                aspect-ratio="3/2"
                cover
              ></v-img>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-footer>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const email = ref('')
  
  const lienKetItems = [
    'TRANG CHỦ',
    'GIỚI THIỆU',
    'CỬA HÀNG',
    'TIN TỨC',
    'LIÊN HỆ'
  ]
  
  const danhMucItems = [
    'DANH MỤC SẢN PHẨM',
    'DANH MỤC TIN TỨC',
    'CHÍNH SÁCH HOÀN TRẢ',
    'FAQ'
  ]
  
  const chinhSachItems = [
    'CHÍNH SÁCH MUA HÀNG',
    'CHÍNH SÁCH HOÀN TRẢ',
    'ĐIỀU KHOẢN VÀ ĐIỀU KIỆN',
    'CHÍNH SÁCH BẢO MẬT'
  ]
  
  const hoTroItems = [
    'FAQ',
    'VẬN CHUYỂN',
    'TÀI KHOẢN',
    'TUYỂN DỤNG',
    'TẠP CHÍ'
  ]
  
  const payments = [
    '/path/to/paypal.png',
    '/path/to/payoneer.png',
    '/path/to/visa.png',
    '/path/to/delivery.png'
  ]
  
  const subscribe = () => {
    // Xử lý logic đăng ký nhận tin tức
    console.log('Subscribing email:', email.value)
  }
  </script>
  
  <style scoped>
  .v-list-item {
    min-height: 32px !important;
  }
  
  .v-list-item:hover {
    color: white !important;
  }
  
  .subscribe-input :deep(.v-field__append-inner) {
    padding-top: 0;
  }
  
  .text-md-right {
    text-align: right;
  }
  
  @media (max-width: 960px) {
    .text-md-right {
      text-align: left;
      margin-top: 1rem;
    }
  }
  </style>