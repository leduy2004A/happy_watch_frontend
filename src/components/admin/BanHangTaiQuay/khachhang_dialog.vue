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
          <v-btn color="primary" class="ml-4">+ THÊM KHÁCH HÀNG</v-btn>
        </div>
      </v-card-title>
      <v-btn class="my-2" variant="outlined" @click="khachLe()">Khách lẻ</v-btn>
      <v-data-table
        :headers="headers"
        :items="lstKhachHang"
        :search="search"
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
        <template v-slot:item="{ item,index }">
          <tr>
            <td>{{ index+1 }}</td>
            <td>{{ item.email }}</td>
            <td>{{ item.ten }}</td>
            <td>{{ item.dienThoai }}</td>
            <td>{{ item.gioiTinh }}</td>
            <td>
              <v-chip :color="getColor(item.trangThai)" dark>
                {{ item.trangThai }}
              </v-chip>
            </td>
            <td>
              <v-btn color="orange" text @click="selectCustomer(item)">CHỌN</v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
  </template>
  
  <script setup>
  import { onMounted, ref } from "vue";
  import { getKhachHang } from "@/axios/khachhang";
  import { getdiachiTheoKhachHang } from "@/axios/diachi";
  import { useInvoiceStore } from "@/store/invoiceStore";
  import useEmitter from "@/useEmitter";
  import { useKhachHangStore } from '@/store/khachHangStore';
  const khachHangStore = useKhachHangStore()
  import { useToast } from "vue-toastification";
  const emitter = useEmitter()
  const search = ref("");
  const lstKhachHang = ref([])
  const InvoiceStore = useInvoiceStore()
  const toast = useToast()
  onMounted(async ()=>{
    const data = await getKhachHang();
    lstKhachHang.value = data.data
    console.log(lstKhachHang.value)
  })
  const headers = [
    { title: "STT", key: "stt" },
    { title: "Email", key: "email" },
    { title: "Họ tên", key: "hoTen" },
    { title: "Số điện thoại", key: "soDienThoai" },
    { title: "Giới tính", key: "gioiTinh" },
    { title: "Trạng thái", key: "trangThai" },
    { title: "Thao tác", key: "actions", sortable: false },
  ];
  
  const customers = ref([
    {
      stt: 1,
      email: "nhatnguyendzpro@gmail.com",
      hoTen: "Nguyễn Văn Nhật",
      ngaySinh: "01/01/1990",
      soDienThoai: "0261748212",
      gioiTinh: "Nam",
      trangThai: "Hoạt động",
    },
    {
      stt: 2,
      email: "example@gmail.com",
      hoTen: "Nguyễn Văn A",
      ngaySinh: "02/02/1991",
      soDienThoai: "0987654321",
      gioiTinh: "Nữ",
      trangThai: "Hoạt động",
    },
    {
      stt: 3,
      email: "test@gmail.com",
      hoTen: "Trần Thị B",
      ngaySinh: "03/03/1992",
      soDienThoai: "0123456789",
      gioiTinh: "Nữ",
      trangThai: "Không hoạt động",
    },
    {
      stt: 1,
      email: "nhatnguyendzpro@gmail.com",
      hoTen: "Nguyễn Văn Nhật",
      ngaySinh: "01/01/1990",
      soDienThoai: "0261748212",
      gioiTinh: "Nam",
      trangThai: "Hoạt động",
    },
    {
      stt: 2,
      email: "example@gmail.com",
      hoTen: "Nguyễn Văn A",
      ngaySinh: "02/02/1991",
      soDienThoai: "0987654321",
      gioiTinh: "Nữ",
      trangThai: "Hoạt động",
    },
    {
      stt: 3,
      email: "test@gmail.com",
      hoTen: "Trần Thị B",
      ngaySinh: "03/03/1992",
      soDienThoai: "0123456789",
      gioiTinh: "Nữ",
      trangThai: "Không hoạt động",
    },
    {
      stt: 1,
      email: "nhatnguyendzpro@gmail.com",
      hoTen: "Nguyễn Văn Nhật",
      ngaySinh: "01/01/1990",
      soDienThoai: "0261748212",
      gioiTinh: "Nam",
      trangThai: "Hoạt động",
    },
    {
      stt: 2,
      email: "example@gmail.com",
      hoTen: "Nguyễn Văn A",
      ngaySinh: "02/02/1991",
      soDienThoai: "0987654321",
      gioiTinh: "Nữ",
      trangThai: "Hoạt động",
    },
    {
      stt: 3,
      email: "test@gmail.com",
      hoTen: "Trần Thị B",
      ngaySinh: "03/03/1992",
      soDienThoai: "0123456789",
      gioiTinh: "Nữ",
      trangThai: "Không hoạt động",
    },
  ]);
  
  const getColor = (status) => {
    return status === "Hoạt động" ? "green" : "red";
  };
  
  const selectCustomer = async (item) => {
   
    const resultData = await getdiachiTheoKhachHang(InvoiceStore.getHoaDonId,item.id)
    if(resultData.status === 200)
    {
      khachHangStore.idNguoiDung = item.id
      toast.success("Đã thêm khách hàng")
      emitter.emit("diachivakhachhang",resultData.data)
      
    }
    else{
    toast.success("Lỗi chọn khách hàng")
    }
  };
  const khachLe = async () => {
    const resultData = await getdiachiTheoKhachHang(InvoiceStore.getHoaDonId,1)
    if(resultData.status === 200)
    {
      toast.success("Đã thêm khách hàng")
      emitter.emit("diachivakhachhang",resultData.data)
    }
    else{
    toast.success("Lỗi chọn khách hàng")
    }
  };
  </script>
  
  <style scoped>
  .search-box {
    display: flex;
    align-items: center;
  }
  </style>