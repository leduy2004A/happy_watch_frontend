<template>
  <v-container>
    <div class="detail">
      <hinhAnhDetail class="hinhAnh"></hinhAnhDetail>
      <datHangDetail class="datHang"></datHangDetail>
    </div>
    <moTaSanPham></moTaSanPham>
    <thongSo></thongSo>
    
  </v-container>
  <thuongDuocMua class="mt-10"></thuongDuocMua>
</template>
<script setup>
import moTaSanPham from "./moTaSanPham.vue";
import hinhAnhDetail from "./hinhAnhDetail.vue";
import datHangDetail from "./datHangDetail.vue";
import thongSo from "./thongSo.vue";
import thuongDuocMua from "./thuongDuocMua.vue";
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
