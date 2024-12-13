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
import { huyHoaDonTheoMaHoaDon } from '@/axios/sanpham';
import { useToast } from 'vue-toastification';
const toast = useToast()
import { onMounted } from 'vue';
const route = useRoute()
onMounted(async ()=>{
    if (route.query.code === "00" && route.query.status === "CANCELLED") {
    const result = await huyHoaDonTheoMaHoaDon(route.query.maHoaDon)
    if(result.status === 200)
    {
        toast.success("Đã huỷ hoá đơn!")
    }
}
})

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