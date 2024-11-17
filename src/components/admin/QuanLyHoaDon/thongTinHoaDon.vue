<template>
  <div>
    <!-- Loading spinner khi đang tải dữ liệu -->
    <div
      v-if="store.isLoading"
      class="d-flex justify-center align-center"
      style="height: 200px"
    >
      <v-progress-circular indeterminate color="orange"></v-progress-circular>
    </div>

    <!-- Chỉ hiện template khi đã load xong dữ liệu -->
    <v-card v-else-if="store.hasOrderData" class="pa-4">
      <!-- Action Buttons -->
      <v-row>
        <v-col cols="6" class="d-flex justify-start">
          <v-btn
            color="orange"
            class="mr-2"
            @click="chuyenTrangThai()"
            v-if="useQuanLyCacNut.nutDaXacNhan"
          >
            {{ timelineStore.nutTrangThai }}
          </v-btn>
          <v-btn
            color="red"
            @click="huyHoaDonDi()"
            v-if="useQuanLyCacNut.nutHuyDon"
          >
            Hủy đơn
          </v-btn>
        </v-col>
        <v-col cols="6" class="d-flex justify-end">
          <v-btn
            outlined
            color="orange"
            @click="viewDetails"
            v-if="useQuanLyCacNut.nutChiTiet"
          >
            Chi tiết
          </v-btn>
          <v-btn
            outlined
            color="orange"
            class="ml-2"
            @click="revertTrangThai()"
            v-if="useQuanLyCacNut.nutQuayLaiTrangTruocDo"
          >
            Quay lại trạng thái trước đó
          </v-btn>
        </v-col>
      </v-row>

      <!-- Order Information -->
      <v-divider class="my-4"></v-divider>
      <div class="info">
        <h5 class="mb-4">Thông tin đơn hàng</h5>
        <h5 class="mb-4" v-if="useQuanLyCacNut.nutCapNhat">
          <v-btn color="primary" @click="capNhatDiaChi()">Cập nhật</v-btn>
        </h5>
      </div>

      <v-row>
        <v-col cols="4">
          <p><strong>Mã:</strong> {{ store.orderDetail.maHoaDon }}</p>
          <p>
            <strong>Số điện thoại người nhận:</strong>
            {{ store.orderDetail.dienThoai }}
          </p>
        </v-col>
        <v-col cols="4">
          <p>
            <strong>Tên khách hàng:</strong>
            {{ store.orderDetail.tenKhachHang }}
          </p>
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
              {{ store.orderDetail.loaiHoaDon }}
            </v-chip>
          </p>
          <p>
            <strong>Tên người nhận:</strong>
            {{ store.orderDetail.tenNguoiNhan }}
          </p>
        </v-col>
      </v-row>
    </v-card>

    <!-- Hiển thị thông báo nếu không tìm thấy dữ liệu -->
    <v-alert v-else type="warning" class="mt-4">
      Không tìm thấy thông tin đơn hàng
    </v-alert>
    <dialog_diachi :modal="modalDialog"></dialog_diachi>
  </div>
</template>

<script setup>
import dialog_diachi from "./dialog_diachi.vue";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { quanLyCacNut } from "@/store/quanLyCacNut";
const useQuanLyCacNut = quanLyCacNut();
import { quanLyChiTietHoaDon } from "@/store/quanLyChiTietHoaDonStore";
import { useTimelineStore } from "@/store/timelineStore";
import { useToast } from "vue-toastification";
const toast = useToast();
import Sweetalert2 from "sweetalert2";
import useEmitter from "@/useEmitter";
const emitter = useEmitter();
const timelineStore = useTimelineStore();
const route = useRoute();
const store = quanLyChiTietHoaDon();
const modalDialog = ref(false);
onMounted(async () => {
  await store.fetchOrderDetail(route.params.ma);
  emitter.on("closeModalDiaChi", (data) => {
    modalDialog.value = data;
  });
});

const viewDetails = () => {
  // Xem chi tiết đơn hàng
  console.log("Xem chi tiết đơn hàng");
};
const chuyenTrangThai = async () => {
  const { value: text } = await Sweetalert2.fire({
    input: "textarea",
    inputLabel: "Ghi Chú",
    inputPlaceholder: "Nhập ghi chú...",
    inputAttributes: {
      "aria-label": "Type your message here",
    },
    showCancelButton: true,
  });
  if (text === "" || text) {
    const data = {
      maHoaDon: route.params.ma,
      ghiChu: text,
    };
    await timelineStore.addTimeLine(data);
    await useQuanLyCacNut.layTrangThai();
    await store.fetchOrderDetail(route.params.ma);
  }
};
const revertTrangThai = async () => {
  const { value: text } = await Sweetalert2.fire({
    input: "textarea",
    inputLabel: "Ghi Chú",
    inputPlaceholder: "Nhập ghi chú...",
    inputAttributes: {
      "aria-label": "Type your message here",
    },
    showCancelButton: true,
  });
  if (text === "" || text) {
    const data = {
      maHoaDon: route.params.ma,
      ghiChu: text,
    };
    await timelineStore.revertTrangThai(data);
    await useQuanLyCacNut.layTrangThai();
    await store.fetchOrderDetail(route.params.ma);
  }
};
const huyHoaDonDi = async () => {
  Sweetalert2.fire({
    title: "Bạn có muốn huỷ hoá đơn không?",
    showCancelButton: true,
    confirmButtonText: "Có",
  }).then(async (result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      await store.cancelOrder();
      await useQuanLyCacNut.layTrangThai();
      await store.fetchOrderDetail(route.params.ma);
    }
  });
};
const capNhatDiaChi = () => {
  modalDialog.value = true;
};
</script>

<style scoped>
.v-card {
  max-width: 100%;
  margin: auto;
}
.info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
