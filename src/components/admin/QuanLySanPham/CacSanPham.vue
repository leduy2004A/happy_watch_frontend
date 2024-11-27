<template>
  <v-card class="pa-4 py-10" flat>
    <h3 class="my-10">Sản Phẩm</h3>
    <div class="d-flex flex-wrap justify-space-between align-center mb-4">
      <!-- Search bar -->
      <v-text-field
        v-model="productStore.search"
        prepend-inner-icon="mdi-magnify"
        label="Nhập tên sản phẩm để tìm..."
        single-line
        hide-details
        density="comfortable"
        variant="outlined"
        class="search-field"
      ></v-text-field>

      <div class="d-flex flex-wrap gap-2">
        <!-- Status filter -->
        <v-btn-toggle
          v-model="productStore.statusFilter"
          mandatory
          class="mr-2"
        >
          <v-btn value="all" size="small">Tất cả</v-btn>
          <v-btn value="selling" size="small">Đang bán</v-btn>
          <v-btn value="stopped" size="small">Ngừng bán</v-btn>
        </v-btn-toggle>

        <!-- Action buttons -->
        <v-btn
          prepend-icon="mdi-microsoft-excel"
          color="success"
          variant="outlined"
          size="small"
          @click="exportExcel"
        >
          Export Excel
        </v-btn>

        <v-btn
          prepend-icon="mdi-plus"
          color="primary"
          size="small"
          @click="addNew"
        >
          Thêm mới
        </v-btn>
      </div>
    </div>

    <v-data-table
      :headers="headers"
      :items="productStore.computedItems"
      :search="productStore.search"
      :items-per-page="5"
      density="comfortable"
      :loading="productStore.loading"
    >
    <template v-slot:item.stt="{ item }">
    {{ item.stt }}
  </template>

  <!-- Status Column -->
  <!-- <template v-slot:item.status="{ item }">
    <v-chip
      :color="getStatusColor(item)"
      :text-color="getStatusTextColor(item)"
      size="small"
    >
      {{ item }}
    </v-chip>
  </template> -->

  <!-- Actions Column -->
  <template v-slot:item.actions="{ item }">
    <v-btn
      icon="mdi-eye"
      variant="text"
      size="small"
      color="primary"
      @click="viewDetails(item)"
    ></v-btn>
  </template>
    </v-data-table>
  </v-card>
  <dialog_them-san-pham :modal="modalThemSanPham"></dialog_them-san-pham>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import dialog_themSanPham from './dialog_themSanPham.vue'
import useEmitter from '@/useEmitter'
import { useDanhSachSP } from '@/store/danhSachSanPhamStore'
import { useRouter } from 'vue-router'
const router = useRouter()
const emitter = useEmitter()
const productStore = useDanhSachSP()
const modalThemSanPham = ref(false)

const headers = [
  { title: 'STT', key: 'stt', align: 'center', width: '80px' },
  { title: 'Tên sản phẩm', key: 'ten', sortable: true },
  { title: 'Ngày thêm', key: 'createdAt', sortable: true },
  { title: 'Số lượng', key: 'soLuong', align: 'center', sortable: true },
  { title: 'Trạng thái', key: 'status', align: 'center' },
  { title: 'Thao tác', key: 'actions', align: 'center', sortable: false }
]

const getStatusColor = (status) => {
  switch (status) {
    case 'Đang bán':
      return 'success'
    case 'Ngừng bán':
      return 'error'
    default:
      return 'grey'
  }
}

const getStatusTextColor = (status) => {
  switch (status) {
    case 'Đang bán':
      return 'success'
    case 'Ngừng bán':
      return 'error'
    default:
      return 'grey'
  }
}

const exportExcel = () => {
  console.log('Exporting to Excel...')
}

const addNew = () => {
  modalThemSanPham.value = true
}

const viewDetails = (item) => {
  console.log('Viewing details for:', item) 
  router.push(`product-danhsach/${item.id}`)
}

onMounted(async () => {
  emitter.on("closeModalThemSanPham", value => {
    modalThemSanPham.value = value
  })
  await productStore.fetchProducts()
})
</script>

<style scoped>
.search-field {
  max-width: 300px;
}

.gap-2 {
  gap: 8px;
}

:deep(.v-data-table) {
  border-radius: 8px;
}

:deep(.v-data-table-header) {
  background-color: rgb(var(--v-theme-surface-variant));
}
</style>