<template>
    <div class="main_content">
        <v-card class="card-banhang">
            <timeline></timeline>
            <thong-tin-hoa-don class="mt-10"></thong-tin-hoa-don>
            <lich-su-thanh-toan class="mt-10"></lich-su-thanh-toan>
            <danh-sach-san-pham class="mt-10"></danh-sach-san-pham>
            <danh-sach-san-pham-hoan-hang class="mt-6"></danh-sach-san-pham-hoan-hang>
            <tong-tien-hoa-don class="mt-6"></tong-tien-hoa-don>
    </v-card>
        
    </div>
</template>
<script setup>
import timeline from './timeline.vue';
import thongTinHoaDon from './thongTinHoaDon.vue';
import lichSuThanhToan from './lichSuThanhToan.vue';
import danhSachSanPham from './danhSachSanPham.vue';
import danhSachSanPhamHoanHang from './danhSachSanPhamHoanHang.vue';
import tongTienHoaDon from './tongTienHoaDon.vue';
</script>
<style scoped>
    .main_content {
  padding: 10px 10px;
  height: 100%;
}
.card-banhang {
  height: 100%;
  width: 100%;
  padding: 40px 20px;
}
</style>