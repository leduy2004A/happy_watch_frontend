<template>
    <v-container>
          <div class="main-cuaHang">
        
        <cuaHangBoLoc class="boLoc"></cuaHangBoLoc>
        <sanPhamCuaHang class="sanPham"></sanPhamCuaHang>
    </div>  
    </v-container>

</template>
<script setup>
import cuaHangBoLoc from './cuaHangBoLoc.vue';
import sanPhamCuaHang from './sanPhamCuaHang.vue';
</script>
<style scoped>
    .main-cuaHang{
        display: flex;
        
    }
    .boLoc{
        flex: 1;
        margin-top: 220px;
    }
    .sanPham{
        flex:3
    }
</style>