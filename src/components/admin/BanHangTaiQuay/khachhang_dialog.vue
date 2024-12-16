<template>
  <v-card>
    <v-card-title>
      Tìm kiếm khách hàng
      <v-spacer></v-spacer>
      <div class="search-box">
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Tìm kiếm tên hoặc sđt hoặc email" 
          single-line
          hide-details
        ></v-text-field>
      </div>
    </v-card-title>
    <v-btn class="my-2" variant="outlined" @click="khachLe()">Khách lẻ</v-btn>
    <v-data-table
      :headers="headers"
      :items="filteredKhachHang"
      :items-per-page="5"
      class="elevation-1"
    >
      <template v-slot:header="{ props: { headers } }">
        <thead>
          <tr>
            <th v-for="header in headers" :key="header.key">
              {{ header.title }}
            </th>
          </tr>
        </thead>
      </template>
      <template v-slot:item="{ item, index }">
        <tr>
          <td>{{ index+1 }}</td>
          <td>{{ item.email }}</td>
          <td>{{ item.ten }}</td>
          <td>{{ item.dienThoai }}</td>
          <td>{{ item.gioiTinh }}</td>
          <td>
            <v-btn color="orange" text @click="selectCustomer(item)">CHỌN</v-btn>
          </td>
        </tr>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { getKhachHang } from "@/axios/khachhang";
import { getdiachiTheoKhachHang } from "@/axios/diachi";
import { useInvoiceStore } from "@/store/invoiceStore";
import useEmitter from "@/useEmitter";
import { useKhachHangStore } from '@/store/khachHangStore';
import { useToast } from "vue-toastification";

const khachHangStore = useKhachHangStore();
const emitter = useEmitter();
const search = ref("");
const lstKhachHang = ref([]);
const InvoiceStore = useInvoiceStore();
const toast = useToast();

const filteredKhachHang = computed(() => {
  if (!search.value) return lstKhachHang.value;
  
  const searchTerm = search.value.toLowerCase();
  return lstKhachHang.value.filter(customer => 
    customer.email?.toLowerCase().includes(searchTerm) ||
    customer.ten?.toLowerCase().includes(searchTerm) ||
    customer.dienThoai?.toLowerCase().includes(searchTerm)
  );
});

onMounted(async () => {
  const data = await getKhachHang();
  lstKhachHang.value = data.data;
});

const headers = [
  { title: "STT", key: "stt" },
  { title: "Email", key: "email" },
  { title: "Họ tên", key: "hoTen" },
  { title: "Số điện thoại", key: "soDienThoai" },
  { title: "Giới tính", key: "gioiTinh" },
  { title: "Thao tác", key: "actions", sortable: false },
];

const selectCustomer = async (item) => {
  const resultData = await getdiachiTheoKhachHang(InvoiceStore.getHoaDonId, item.id);
  if(resultData.status === 200) {
    khachHangStore.idNguoiDung = item.id;
    toast.success("Đã thêm khách hàng");
    emitter.emit("diachivakhachhang", resultData.data);
  } else {
    toast.error("Lỗi chọn khách hàng");
  }
};

const khachLe = async () => {
  const resultData = await getdiachiTheoKhachHang(InvoiceStore.getHoaDonId, 1);
  if(resultData.status === 200) {
    toast.success("Đã thêm khách hàng");
    emitter.emit("diachivakhachhang", resultData.data);
  } else {
    toast.error("Lỗi chọn khách hàng");
  }
};
</script>

<style scoped>
.search-box {
  display: flex;
  align-items: center;
}
</style>