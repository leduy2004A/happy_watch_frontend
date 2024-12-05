<template>
  <v-container>
    <div class="detail">
      <hinhAnhDetail class="hinhAnh"></hinhAnhDetail>
      <datHangDetail class="datHang"></datHangDetail>
    </div>
    <moTaSanPham></moTaSanPham>
    <thongSo></thongSo>
    
  </v-container>
  <giamGiaSau class="mt-10"></giamGiaSau>
</template>
<script setup>
import moTaSanPham from "./moTaSanPham.vue";
import hinhAnhDetail from "./hinhAnhDetail.vue";
import datHangDetail from "./datHangDetail.vue";
import thongSo from "./thongSo.vue";
import thuongDuocMua from "./thuongDuocMua.vue";
import giamGiaSau from "./giamGiaSau.vue";
</script>
<style scoped>
.detail {
  display: flex;

}
.hinhAnh {
  flex: 1;
}
.datHang {
  flex: 1;
}
</style>
