<template>
    <v-container>
            <div class="mainThanhToan">
        <thanhToan class="thanhtoan"></thanhToan>
        <tongTien class="tongtien"></tongTien>
    </div>
    </v-container>

</template>
<script setup>
import thanhToan from './thanhToan.vue';
import tongTien from './tongTien.vue';
import { useRoute } from 'vue-router';
const route = useRoute()
if (route.query.code === "00" && route.query.status === "CANCELLED") {
    
}
</script>
<style scoped>
    .mainThanhToan{
        display: flex;
    }
    .thanhtoan{
        flex: 1;
    }
    .tongtien{
        flex: 1;
    }
</style>