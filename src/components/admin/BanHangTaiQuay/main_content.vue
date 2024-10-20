<template>
    <div class="main_content">
        <v-card class="card-banhang">
            <h3>Bán hàng</h3>
            <them_hoa_don></them_hoa_don>
            <Them_san_pham></Them_san_pham>
            <tongtien></tongtien>
        </v-card>
        
    </div>
</template>
<script setup>
import them_hoa_don from './them_hoa_don.vue';
import Them_san_pham from './them_san_pham.vue';
import tongtien from './tongtien.vue';
</script>
<style scoped>
    .main_content{
        padding: 10px 10px;
        height: 100%;
    }
    .card-banhang{
        height: 100%;
        width: 100%;
        padding: 40px 20px;
    }
</style>