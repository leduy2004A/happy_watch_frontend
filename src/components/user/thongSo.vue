<template>
  <v-container>
    <!-- Heading -->
    <v-row>
      <v-col>
        <h2 class="text-h6 font-weight-bold">THÔNG SỐ KĨ THUẬT</h2>
        <v-divider></v-divider>
      </v-col>
    </v-row>

    <!-- Specifications List -->
    <v-row class="specifications-list">
      <v-col
        cols="12"
        md="6"
        v-for="(spec, index) in formattedSpecifications"
        :key="index"
      >
        <v-row>
          <v-col cols="6" class="font-weight-bold text-grey darken-1">{{
            spec.label
          }}</v-col>
          <v-col cols="6" class="text-right font-weight-bold">{{
            spec.value
          }}</v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed } from "vue";
import { useChiTietSanPhamStore } from "@/store/chiTietSanPhamStore";
const useChiTietStore = useChiTietSanPhamStore()
// Giả sử bạn đã có data từ API
const productDetail = ref({
  id: 1,
  ma: "CTSP01",
  gia: 1000000.0,
  giaSauGiam: 900000.0,
  kichThuoc: "40mm",
  chongNuoc: "5ATM",
  xuatXu: "Nhật Bản",
  baoHanh: "12 tháng",
  soLuong: 8,
  canNang: 150,
  mauSac: "Đỏ",
  loaiMay: "Automatic",
  chatLieuVo: "Thép không gỉ",
  chatLieuDay: "Da",
  loaiKinh: "Kính sapphire",
  hinhDang: "Tròn",
  hinhAnhUrls: [
    "https://th.bing.com/th/id/OIP.Zwq5bd4WcBsnBLeQfFpvYgHaE7?w=955&h=635&rs=1&pid=ImgDetMain",
    "https://th.bing.com/th/id/OIP.idC1L05Lb8K4PD9JW0DXiQHaHa?w=1500&h=1500&rs=1&pid=ImgDetMain",
  ],
});

const formattedSpecifications = computed(() => {
  return [
    { label: "Mã sản phẩm", value: useChiTietStore.chiTietSanPham.ma },
    { label: "Kích thước", value: useChiTietStore.chiTietSanPham.kichThuoc },
    { label: "Độ chịu nước", value: useChiTietStore.chiTietSanPham.chongNuoc },
    { label: "Xuất xứ", value: useChiTietStore.chiTietSanPham.xuatXu },
    { label: "Bảo hành", value: useChiTietStore.chiTietSanPham.baoHanh },
    { label: "Cân nặng", value: `${useChiTietStore.chiTietSanPham.canNang}g` },
    { label: "Màu sắc", value: useChiTietStore.chiTietSanPham.mauSac },
    { label: "Loại máy", value: useChiTietStore.chiTietSanPham.loaiMay },
    { label: "Chất liệu vỏ", value: useChiTietStore.chiTietSanPham.chatLieuVo },
    { label: "Chất liệu dây", value: useChiTietStore.chiTietSanPham.chatLieuDay },
    { label: "Loại kính", value: useChiTietStore.chiTietSanPham.loaiKinh },
    { label: "Hình dáng", value: useChiTietStore.chiTietSanPham.hinhDang },
    { label: "Giới tính", value: useChiTietStore.chiTietSanPham.gioiTinh },
  ];
});
</script>

<style scoped>
.text-h6 {
  color: #673ab7;
  margin-bottom: 20px;
}

.specifications-list {
  background-color: #f7f7f7;
  padding: 20px;
  border-radius: 8px;
}

.specifications-list .v-row {
  border-bottom: 1px solid #e0e0e0;
  padding: 10px 0;
}

.specifications-list .v-row:last-child {
  border-bottom: none;
}
</style>
