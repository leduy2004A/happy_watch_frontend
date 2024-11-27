<template>
  <v-container>
    <h3 class="my-10">Chi tiết sản phẩm</h3>
    <!-- Search Bar -->
    <v-row>
      <v-col cols="12">
        <v-text-field
          v-model="store.search"
          prepend-inner-icon="mdi-magnify"
          label="Nhập mã sản phẩm để tìm..."
          variant="outlined"
          density="comfortable"
        ></v-text-field>
      </v-col>
    </v-row>

    <!-- Filters -->
    <v-row>
      <v-col cols="12" sm="6" md="3" v-for="(filter, key) in store.filterOptions" :key="key">
        <v-select
          v-model="store.filters[key]"
          :items="filter.options"
          :label="filter.label"
          variant="outlined"
          density="comfortable"
        ></v-select>
      </v-col>
    </v-row>

    <!-- Price Range -->
    <v-row>
      <v-col cols="12">
        <div class="text-subtitle-1 mb-2">
          Khoảng giá: {{ store.formatPrice(store.priceRange[0]) }} - {{ store.formatPrice(store.priceRange[1]) }}
        </div>
        <v-slider
          v-model="store.priceRange[0]"
          :min="0"
          :max="2000000"
          :step="100000"
          label="Giá thấp nhất"
          hide-details
          class="mb-2"
        ></v-slider>
        <v-slider
          v-model="store.priceRange[1]"
          :min="0"
          :max="2000000"
          :step="100000"
          label="Giá cao nhất"
          hide-details
        ></v-slider>
      </v-col>
    </v-row>

    <v-btn flat color="primary" class="my-10" @click="open">Thêm</v-btn>
    
    <!-- Products Table -->
    <v-data-table
      :headers="headers"
      :items="store.filteredProducts"
      :search="store.search"
      :items-per-page="10"
    >
      <template v-slot:item.hinhAnhChiTiet="{ item }">
        <v-img
          :src="item.hinhAnhChiTiet"
          width="70"
          height="70"
          cover
        ></v-img>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-icon
          size="small"
          class="me-2"
          @click="editItem(item)"
        >
          mdi-pencil
        </v-icon>
      </template>

      <template v-slot:item.gia="{ item }">
        {{ store.formatPrice(item.gia) }}
      </template>
      <template v-slot:item.giaSauGiam="{ item }">
        <v-chip
          :color="item.giaSauGiam !== null ? 'success' : 'error'"
          size="small"
        >
          {{ item.giaSauGiam !== null ? store.formatPrice(item.giaSauGiam) : 'Không có khuyến mãi' }}
        </v-chip>
      </template>
    </v-data-table>
  </v-container>
  <dialog_themchitietsanpham :modal="store.openModalCTSP"></dialog_themchitietsanpham>
</template>

<script setup>
import { onMounted } from 'vue'
import dialog_themchitietsanpham from './dialog_themchitietsanpham.vue'
import useEmitter from '@/useEmitter'
import { useRoute } from 'vue-router'
import { quanLyCTSPMAIN } from '@/store/quanLyCTSPMain'
import { useCTSPStore } from '@/store/quanLyChiTietSanPhamStore'
const ctspStore = useCTSPStore()
const route = useRoute()
const emitter = useEmitter()
const store = quanLyCTSPMAIN()

const headers = [
  { title: 'Ảnh', key: 'hinhAnhChiTiet', sortable: false },
  { title: 'Mã', key: 'ma', align: 'start' },
  { title: 'Màu sắc', key: 'mauSac' },
  { title: 'Loại máy', key: 'loaiMay' },
  { title: 'Chất liệu vỏ', key: 'chatLieuVo' },
  { title: 'Chất liệu dây', key: 'chatLieuDay' },
  { title: 'Xuất xứ', key: 'xuatXu' },
  { title: 'Số lượng', key: 'soLuong' },
  { title: 'Giá', key: 'gia' },
  { title: 'Giá khuyến mãi', key: 'giaSauGiam' },
  { title: 'Thao tác', key: 'actions', sortable: false },
]

onMounted(async () => {
  await store.fetchProducts(route.params.id)
  emitter.on("closeModalThemSanPham", value => {
    store.setOpenModal(value)
  })
})

const editItem = (item) => {
  store.openModalCTSP = true
  ctspStore.fetchProductDetails(item.id)
  console.log(item)
}

const open = () => {
  store.setOpenModal(true)
  emitter.on("closeModalCTSP", value => {
    store.setOpenModal(value)
  })
}
</script>