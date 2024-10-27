<template>
    <div class="main_content">
        <v-card class="card-banhang">
      <h3>Bán hàng</h3>
          <tim-kiem-hoa-don></tim-kiem-hoa-don>
          <table-hoa-don class="mt-10"></table-hoa-don>
    </v-card>
        
    </div>
</template>
<script setup>
import timKiemHoaDon from './timKiemHoaDon.vue';
import tableHoaDon from './tableHoaDon.vue';
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