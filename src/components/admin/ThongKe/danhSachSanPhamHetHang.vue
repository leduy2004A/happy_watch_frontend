<template>

  <div class="">
    <div class="title-header">
            <h4>Danh sách sản phẩm sắp hết hàng</h4>
      <InputText  placeholder="Nhập số lượng" type="number" v-model="inputQuantity"  @blur="onInputQuantityChange()" />
    </div>

  <DataTable :value="products" :paginator="true" :rows="5" responsive-layout="scroll"
               striped-rows class="p-datatable-lg" v-model:filters="filters">
      <Column field="image" header="Ảnh" style="width: 100px">
        <template #body="slotProps">
          <img :src="slotProps.data.urlImages" :alt="slotProps.data.name" width="50" />
        </template>
      </Column>
      <Column field="maCTSP" header="Tên sản phẩm" sortable>
        <template #filter="{ filterModel, filterCallback }">
          <InputText v-model="filterModel.value" @input="filterCallback()" placeholder="Tìm theo tên" />
        </template>
        <template #body="slotProps">
          {{ slotProps.data.ten }} - {{ slotProps.data.gioiTinh }} - {{ slotProps.data.loaiKinh }} - {{ slotProps.data.chatLieuVo }} - {{ slotProps.data.loaiMay }} - {{ slotProps.data.chatLieuDay }}
        </template>
      </Column>
      <Column field="tongSoLuong" header="Số lượng" sortable />
      <Column field="giaSanPham" header="Giá tiền" sortable>
        <template #body="slotProps">
          {{ formatCurrency(slotProps.data.giaSanPham) }}
        </template>
      </Column>
    
    </DataTable>
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import { getThongKeSanPhamSapHetHang } from '@/axios/thongKe';
// Danh sách sản phẩm giả lập
const products = ref([
  {
    image: '/path-to-image/balen-grey.jpg',
    name: 'Balen Grey 2023 - Tím - Bạc - Đế nhựa - Giày lười - Balenciaga',
    quantity: 18,
    price: 550000,
    size: '40,41,42',
  },
  {
    image: '/path-to-image/nike-air.jpg',
    name: 'Nike Air Force 1 - Trắng - Da - Giày thể thao',
    quantity: 25,
    price: 3200000,
    size: '38,39,40,41',
  },
  {
    image: '/path-to-image/adidas-ultra.jpg',
    name: 'Adidas Ultra Boost - Đen - Dệt kim - Giày chạy bộ',
    quantity: 10,
    price: 4200000,
    size: '40,41,42,43',
  },
  {
    image: '/path-to-image/converse-classic.jpg',
    name: 'Converse Classic - Đỏ - Vải - Giày cổ cao',
    quantity: 50,
    price: 900000,
    size: '37,38,39,40',
  },
  {
    image: '/path-to-image/vans-old-skool.jpg',
    name: 'Vans Old Skool - Đen Trắng - Vải - Giày trượt ván',
    quantity: 15,
    price: 1100000,
    size: '38,39,40,41,42',
  },
]);
const inputQuantity = ref(10);
// Biến trạng thái


// Bộ lọc
const filters = ref({
  name: { value: null, matchMode: 'contains' },
  price: { value: null, matchMode: 'gte' },
  quantity: { value: null, matchMode: 'gte' },
});

// Dữ liệu biểu đồ

// Hàm thiết lập loại bộ lọc

onMounted(async()=>{
  products.value = (await getThongKeSanPhamSapHetHang(inputQuantity.value)).data
})
// Định dạng tiền tệ
const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value);
};

// Xuất dữ liệu sang Excel
const exportToExcel = () => {
  console.log('Export to Excel!');
};
const onInputQuantityChange =async () => {
  console.log('Số lượng nhập vào:', inputQuantity.value);
  products.value = (await getThongKeSanPhamSapHetHang(inputQuantity.value)).data
};
</script>
<style scoped>
    .title-header{
      display: flex;
      justify-content: space-between;
    }
</style>