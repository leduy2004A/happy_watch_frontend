<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-text-field
          v-model="searchQuery"
          label="Tìm kiếm sản phẩm"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          class="search-field"
          hide-details
        ></v-text-field>
      </v-col>

      <v-col cols="12">
        <v-card class="filter-card pa-4 mb-4">
          <v-row dense>
            <v-col v-for="(filter, index) in filters" :key="index" cols="12" sm="6" md="4" lg="2">
              <v-select
                v-model="filter.value"
                :items="filter.items"
                :label="filter.label"
                variant="outlined"
                density="comfortable"
                hide-details
                class="filter-select"
              ></v-select>
            </v-col>
          </v-row>
          
          <v-row class="mt-4">
            <v-col cols="12">
              <div class="price-range-wrapper px-4">
                <div class="d-flex justify-space-between mb-2">
                  <span class="text-subtitle-2">Khoảng giá:</span>
                  <span class="text-subtitle-2 primary--text">
                    {{ formatCurrency(priceRange[0]) }} - {{ formatCurrency(priceRange[1]) }}
                  </span>
                </div>
                <v-range-slider
                  v-model="priceRange"
                  :min="100000"
                  :max="3200000"
                  :step="50000"
                  class="price-slider"
                  hide-details
                ></v-range-slider>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card>
          <v-table class="product-table">
            <thead>
              <tr>
                <th v-for="header in headers" :key="header.key" class="text-center">
                  {{ header.title }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in sanPham" :key="item.id">
                <td class="text-center">
                  <v-img
                    :src="item.hinhAnh[0]"
                    width="80"
                    height="80"
                    cover
                    class="product-image ma-2"
                  >
                    <template v-slot:placeholder>
                      <v-row class="fill-height ma-0" align="center" justify="center">
                        <v-progress-circular indeterminate></v-progress-circular>
                      </v-row>
                    </template>
                  </v-img>
                </td>
                <td>{{ item.tenSanPham + ' - ' + item.maSanPham }}</td>
      
                <td>{{ item.tenMauSac }}</td>
                <td>{{ item.hinhDang }}</td>
                <td class="text-center">{{ item.kichThuoc }}</td>
                <td>{{ item.loaiKinh }}</td>
                <td>{{ item.loaiMay }}</td>
                <td>{{ item.chatLieuVo }}</td>
                <td>{{ item.chatLieuDay }}</td>
                <td class="text-end">
                  <div class="price-column">
                    <div class="original-price">{{ formatCurrency(item.gia) }}</div>
                    <div class="discounted-price">{{ formatCurrency(item.giaSauGiam) }}</div>
                  </div>
                </td>
                <td class="text-center">
                  <v-btn
                    color="primary"
                    variant="elevated"
                    size="small"
                    @click="selectProduct(item)"
                    class="action-button"
                  >
                    Chọn
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { laySanPham } from '@/axios/sanpham';
import { onMounted, ref, computed } from 'vue';
import useEmitter from '@/useEmitter';
const searchQuery = ref('');
const priceRange = ref([100000, 3200000]);
const sanPham = ref([]);
const emitter = useEmitter()
const headers = [
  { title: 'Ảnh', key: 'hinhAnh', align: 'center' },
  { title: 'Tên', key: 'tenSanPham', align: 'start' },
  { title: 'Màu sắc', key: 'tenMauSac', align: 'start' },
  { title: 'Hình dáng', key: 'hinhDang', align: 'start' },
  { title: 'Kích thước', key: 'kichThuoc', align: 'center' },
  { title: 'Loại kính', key: 'loaiKinh', align: 'start' },
  { title: 'Loại máy', key: 'loaiMay', align: 'start' },
  { title: 'Chất liệu vỏ', key: 'chatLieuVo', align: 'start' },
  { title: 'Chất liệu dây', key: 'chatLieuDay', align: 'start' },
  { title: 'Giá', key: 'gia', align: 'end' },
  { title: 'Thao tác', key: 'actions', align: 'center' },
];

const filters = [
  { label: 'Danh mục', value: 'Tất cả', items: ['Tất cả', 'Giày cao cổ', 'Giày thể thao'] },
  { label: 'Màu sắc', value: 'Tất cả', items: ['Tất cả', 'Xanh dương', 'Tím'] },
  { label: 'Chất liệu', value: 'Tất cả', items: ['Tất cả', 'Đế sắt', 'Đế nhựa'] },
  { label: 'Kích cỡ', value: 'Tất cả', items: ['Tất cả', '40', '41'] },
  { label: 'Đế giày', value: 'Tất cả', items: ['Tất cả', 'Đế sắt', 'Đế nhựa'] },
  { label: 'Thương hiệu', value: 'Tất cả', items: ['Tất cả', 'Converse', 'Nike'] },
];

// Thêm computed property để lọc sản phẩm
const filteredProducts = computed(() => {
  return sanPham.value.filter(item => {
    // Lọc theo search query
    const searchLower = searchQuery.value.toLowerCase();
    const matchesSearch = Object.values(item).some(value => 
      String(value).toLowerCase().includes(searchLower)
    );

    // Lọc theo khoảng giá
    const matchesPrice = item.gia >= priceRange.value[0] && 
                        item.gia <= priceRange.value[1];

    return matchesSearch && matchesPrice;
  });
});

onMounted(async () => {
  const data = await laySanPham();
  sanPham.value = data.data;
  console.log(sanPham.value)
});

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: 'VND' 
  }).format(value);
};

const selectProduct = (product) => {
  const data = {
    giaSauGiam : product.giaSauGiam,
    chiTietSanPhamId:product.chiTietSanPhamId
  }
  emitter.emit("chiTietSanPhamId",data)
};
</script>

<style scoped>
.search-field {
  border-radius: 8px;
  background-color: white;
}

.search-field :deep(.v-field__outline__start) {
  border-radius: 8px 0 0 8px;
}

.search-field :deep(.v-field__outline__end) {
  border-radius: 0 8px 8px 0;
}

.filter-card {
  border-radius: 12px;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.filter-select {
  border-radius: 6px;
}

.price-range-wrapper {
  background-color: white;
  border-radius: 8px;
  padding: 16px;
}

.price-slider :deep(.v-slider-track__fill) {
  background-color: var(--v-primary-base);
}

.price-slider :deep(.v-slider-thumb) {
  border: 2px solid var(--v-primary-base);
}

.product-table {
  border-radius: 12px;
  overflow: hidden;
}

.product-image {
  border-radius: 8px;
  transition: transform 0.2s;
}

.product-image:hover {
  transform: scale(1.05);
}

.price-column {
  text-align: right;
}

.original-price {
  color: #9e9e9e;
  text-decoration: line-through;
  font-size: 0.9em;
}

.discounted-price {
  color: var(--v-error-base);
  font-weight: 600;
  font-size: 1.1em;
}

.action-button {
  min-width: 80px;
  text-transform: none;
}

/* Table header styling */
.product-table :deep(thead th) {
  background-color: #f5f5f5 !important;
  color: #333 !important;
  font-weight: 600 !important;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

/* Table row hover effect */
.product-table :deep(tbody tr:hover) {
  background-color: #f8f9fa !important;
}

/* Responsive adjustments */
@media (max-width: 960px) {
  .product-table {
    font-size: 0.9rem;
  }
  
  .product-image {
    width: 60px;
    height: 60px;
  }
}
</style>