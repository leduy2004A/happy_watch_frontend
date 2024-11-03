<template>
  <div>
    <!-- Loading spinner khi đang tải dữ liệu -->
    <div v-if="store.isLoading" class="d-flex justify-center align-center" style="height: 200px">
      <v-progress-circular indeterminate color="orange"></v-progress-circular>
    </div>

    <!-- Chỉ hiện template khi đã load xong dữ liệu -->
    <v-card v-else-if="store.hasOrderData" class="pa-4">
      <!-- Action Buttons -->
      <v-row>
        <v-col cols="6" class="d-flex justify-start">
          <v-btn color="orange" class="mr-2" @click="store.confirmDelivery">
            Xác nhận giao hàng
          </v-btn>
          <v-btn color="red" @click="store.cancelOrder">
            Hủy đơn
          </v-btn>
        </v-col>
        <v-col cols="6" class="d-flex justify-end">
          <v-btn outlined color="orange" @click="viewDetails">
            Chi tiết
          </v-btn>
          <v-btn outlined color="orange" class="ml-2" @click="store.updateOrder">
            Cập nhật
          </v-btn>
        </v-col>
      </v-row>

      <!-- Order Information -->
      <v-divider class="my-4"></v-divider>
      <h5 class="mb-4">Thông tin đơn hàng - Đơn tại quầy</h5>
      <v-row>
        <v-col cols="4">
          <p><strong>Mã:</strong> {{ store.orderDetail.maHoaDon }}</p>
          <p><strong>Số điện thoại người nhận:</strong> 0355512589</p>
        </v-col>
        <v-col cols="4">
          <p><strong>Tên khách hàng:</strong> {{ store.orderDetail.nguoiDung.ten }}</p>
          <p>
            <strong>Trạng thái:</strong>
            <v-chip color="orange lighten-4" text-color="orange" outlined>
              {{ store.orderDetail.trangThai }}
            </v-chip>
          </p>
        </v-col>
        <v-col cols="4">
          <p>
            <strong>Loại:</strong>
            <v-chip color="blue lighten-4" text-color="blue" outlined>
              Giao hàng
            </v-chip>
          </p>
          <p><strong>Tên người nhận:</strong> Địa chỉ 12</p>
        </v-col>
      </v-row>
    </v-card>

    <!-- Hiển thị thông báo nếu không tìm thấy dữ liệu -->
    <v-alert v-else type="warning" class="mt-4">
      Không tìm thấy thông tin đơn hàng
    </v-alert>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { quanLyChiTietHoaDon } from '@/store/quanLyChiTietHoaDonStore';

const route = useRoute();
const store = quanLyChiTietHoaDon();

onMounted(async () => {
  await store.fetchOrderDetail(route.params.ma);
});

const viewDetails = () => {
  // Xem chi tiết đơn hàng
  console.log("Xem chi tiết đơn hàng");
};
</script>

<style scoped>
.v-card {
  max-width: 100%;
  margin: auto;
}
</style>