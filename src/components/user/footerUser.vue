<template>

  <div class="footer">
    <v-container>
        <div class="grid">
      <!-- Main Footer Content -->
      <div class="col-12 md:col-8">
        <div class="grid">
          <!-- Liên Kết Section -->  
          <div class="col-12 sm:col-3">
            <h3 class="mb-4">LIÊN KẾT</h3>
            <ul class="list-none p-0 m-0">
              <li v-for="(item, i) in lienKetItems" :key="i" class="mb-2">
                <a href="#" class="hover:text-white">{{ item }}</a>
              </li>
            </ul>
          </div>

          <!-- Danh Mục Section -->
          <div class="col-12 sm:col-3">
            <h3 class="mb-4">DANH MỤC</h3>
            <ul class="list-none p-0 m-0">
              <li v-for="(item, i) in danhMucItems" :key="i" class="mb-2">
                <a href="#" class="hover:text-white">{{ item }}</a>
              </li>
            </ul>
          </div>

          <!-- Chính Sách Section -->
          <div class="col-12 sm:col-3">
            <h3 class="mb-4">CHÍNH SÁCH</h3>
            <ul class="list-none p-0 m-0">
              <li v-for="(item, i) in chinhSachItems" :key="i" class="mb-2">
                <a href="#" class="hover:text-white">{{ item }}</a>
              </li>
            </ul>
          </div>

          <!-- Hỗ Trợ Section -->
          <div class="col-12 sm:col-3">
            <h3 class="mb-4">HỖ TRỢ</h3>
            <ul class="list-none p-0 m-0">
              <li v-for="(item, i) in hoTroItems" :key="i" class="mb-2">
                <a href="#" class="hover:text-white">{{ item }}</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Newsletter Section -->
      <div class="col-12 md:col-4">
        <h3 class="mb-4">NHẬN TẤT CẢ CÁC TIN TỨC MỚI NHẤT.</h3>
        <form @submit.prevent="subscribe">
          <div class="p-inputgroup">
            <InputText v-model="email" placeholder="Nhập email..." />
            <Button label="ĐĂNG KÝ" type="submit" />
          </div>
        </form>
      </div>

      <!-- Bottom Footer -->
      <div class="col-12">
        <Divider class="my-6" />
        
        <div class="grid">
          <div class="col-12 md:col-6">
            <p class="text-gray-400 text-sm">
              © Thiết kế và lập trình bởi
              <a href="#" class="no-underline text-gray-400">SD-56 team</a>
            </p>
          </div>
          <div class="col-12 md:col-6 md:text-right">
            <div class="flex justify-content-end flex-wrap">
              <Image v-for="(payment, i) in payments" 
                     :key="i"
                     :src="payment"
                     width="60"
                     class="mx-2" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </v-container>

  </div>
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
  console.log('Subscribing email:', email.value)
}
</script>

<style scoped>
.footer {
  background-color: black;
  padding: 2rem;
}

h3 {
  color: white;
  text-transform: uppercase;
}

a {
  color: #9ca3af;
  text-decoration: none;
  transition: color 0.2s;
}

.p-inputgroup {
  .p-inputtext {
    background: white;
  }
  
  .p-button {
    background: black;
    border: 1px solid white;
  }
}

@media (max-width: 768px) {
  .md\:text-right {
    text-align: left;
    margin-top: 1rem;
  }
}
</style>