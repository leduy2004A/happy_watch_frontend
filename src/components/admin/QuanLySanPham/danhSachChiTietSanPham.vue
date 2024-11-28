<template>
  <div class="surface-section p-5 container">
    <div class="mx-auto" style="max-width: 1200px">
      <h3 class="text-3xl font-medium mb-5">Chi tiết sản phẩm</h3>
      
      <!-- Search Bar -->
      <div class="grid mb-4">
        <div class="col-12">
          <span class="p-input-icon-left w-full">
            <i class="pi pi-search" />
            <InputText 
              v-model="store.search" 
              class="w-full"
              placeholder="Nhập mã sản phẩm để tìm..."
            />
          </span>
        </div>
      </div>

      <!-- Filters -->
      <div class="grid mb-4">
        <div class="col-12 sm:col-6 md:col-3" v-for="(filter, key) in store.filterOptions" :key="key">
          <Dropdown
            v-model="store.filters[key]"
            :options="filter.options"
            :placeholder="filter.label"
            class="w-full"
          />
        </div>
      </div>

      <!-- Price Range -->
      <div class="grid mb-4">
        <div class="col-12">
          <div class="text-lg mb-2">
            Khoảng giá: {{ store.formatPrice(store.priceRange[0]) }} - {{ store.formatPrice(store.priceRange[1]) }}
          </div>
          <Slider 
            v-model="store.priceRange" 
            :min="0" 
            :max="2000000" 
            :step="100000" 
            range 
            class="mb-4"
          />
        </div>
      </div>

      <Button 
        label="Thêm" 
        class="mb-4" 
        @click="open"
      />
      
      <!-- Products Table -->
      <DataTable
        :value="store.filteredProducts"
        :paginator="true"
        :rows="10"
        :filters="filters"
        filterDisplay="menu"
        :globalFilterFields="['ma']"
        dataKey="id"
        class="p-datatable-sm"
        responsiveLayout="scroll"
      >
        <Column field="hinhAnhChiTiet" header="Ảnh" :sortable="false">
          <template #body="slotProps">
            <img 
              :src="slotProps.data.hinhAnhChiTiet" 
              :alt="slotProps.data.ma"
              width="70" 
              height="70" 
              style="object-fit: cover"
            />
          </template>
        </Column>
        <Column field="ma" header="Mã" sortable></Column>
        <Column field="mauSac" header="Màu sắc" sortable></Column>
        <Column field="loaiMay" header="Loại máy" sortable></Column>
        <Column field="chatLieuVo" header="Chất liệu vỏ" sortable></Column>
        <Column field="chatLieuDay" header="Chất liệu dây" sortable></Column>
        <Column field="xuatXu" header="Xuất xứ" sortable></Column>
        <Column field="soLuong" header="Số lượng" sortable></Column>
        <Column field="gia" header="Giá" sortable>
          <template #body="slotProps">
            {{ store.formatPrice(slotProps.data.gia) }}
          </template>
        </Column>
        <Column field="giaSauGiam" header="Giá khuyến mãi">
          <template #body="slotProps">
            <Tag 
              :severity="slotProps.data.giaSauGiam !== null ? 'success' : 'danger'"
              class="text-sm"
            >
              {{ slotProps.data.giaSauGiam !== null ? store.formatPrice(slotProps.data.giaSauGiam) : 'Không có khuyến mãi' }}
            </Tag>
          </template>
        </Column>
        <Column header="Thao tác" :sortable="false" style="min-width: 100px">
          <template #body="slotProps">
            <Button 
              icon="pi pi-pencil" 
              severity="secondary" 
              text 
              rounded
              @click="editItem(slotProps.data)"
            />
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
  <dialog_themchitietsanpham :modal="store.openModalCTSP"></dialog_themchitietsanpham>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import dialog_themchitietsanpham from './dialog_themchitietsanpham.vue'
import useEmitter from '@/useEmitter'
import { useRoute } from 'vue-router'
import { quanLyCTSPMAIN } from '@/store/quanLyCTSPMain'
import { useCTSPStore } from '@/store/quanLyChiTietSanPhamStore'

const ctspStore = useCTSPStore()
const route = useRoute()
const emitter = useEmitter()
const store = quanLyCTSPMAIN()
const filters = ref({
  global: { value: null, matchMode: 'contains' }
})

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

<style scoped>
.container {
  margin: 0 auto;
  padding: 2rem;
}

:deep(.p-datatable) {
  box-shadow: 0 2px 1px -1px rgba(0,0,0,0.2), 
              0 1px 1px 0 rgba(0,0,0,0.14), 
              0 1px 3px 0 rgba(0,0,0,0.12);
  border-radius: 6px;
}

:deep(.p-datatable .p-datatable-header) {
  background: #f8f9fa;
  padding: 1rem;
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
  background: #f8f9fa;
  padding: 1rem;
}

:deep(.p-datatable .p-datatable-tbody > tr > td) {
  padding: 1rem;
}

:deep(.p-button) {
  margin-right: 0.5rem;
}

:deep(.p-dropdown) {
  width: 100%;
}

:deep(.p-inputtext) {
  padding: 0.75rem;
}
</style>