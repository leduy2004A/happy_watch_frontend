<template>
  <div class="surface-section p-5 container">
    <div class="mx-auto" style="max-width: 1200px">
      <h3 class="text-3xl font-medium mb-5">Chi tiết sản phẩm</h3>
      
      <!-- Search Bar -->
      <div class="grid mb-4">
        <div class="col-12">
          <span class="p-input-icon-left w-full">
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
        <Column field="trangThai" header="Trạng thái">
          <template #body="slotProps">
            <Tag 
              :severity="slotProps.data.trangThai === 'Còn hàng' ? 'success' : 'danger'"
              class="text-sm"
              @click="updateTrangThai(slotProps.data)"
            >
              {{ slotProps.data.trangThai }}
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
      <Dialog 
      v-model:visible="displayStatusDialog" 
      modal 
      header="Xác nhận thay đổi trạng thái" 
      :style="{ width: '350px' }"
    >
      <div class="flex align-items-center justify-content-center">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span>Bạn có chắc muốn thay đổi trạng thái của chi tiết sản phẩm này?</span>
      </div>
      <template #footer>
        <Button 
          label="Không" 
          icon="pi pi-times" 
          @click="displayStatusDialog = false" 
          text
        />
        <Button 
          label="Có" 
          icon="pi pi-check" 
          @click="handleConfirmStatusChange()" 
          severity="danger" 
          autofocus 
        />
      </template>
    </Dialog>
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
import { updateTrangThaiChiTietSanPham } from '@/axios/sanpham'
import { useToast } from 'vue-toastification'
const toast = useToast()
const displayStatusDialog = ref(false)
const ctspStore = useCTSPStore()
const route = useRoute()
const emitter = useEmitter()
const store = quanLyCTSPMAIN()
const chiTietSanPhamId = ref(0)
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
  ctspStore.isClose = false
  ctspStore.fetchProductDetails(item.id)
  console.log(item)
}

const open = () => {
  store.setOpenModal(true)
  ctspStore.idCTSP = 0
  ctspStore.product.ma = ""
  ctspStore.isClose = true
  emitter.on("closeModalCTSP", value => {
    store.setOpenModal(value)
  })
}
const updateTrangThai = (data)=>{
  displayStatusDialog.value = true
  chiTietSanPhamId.value = data.id
}
const handleConfirmStatusChange =async ()=>{
  const result = await updateTrangThaiChiTietSanPham(chiTietSanPhamId.value)
  if(result.status === 200)
  {
    displayStatusDialog.value = false
    store.fetchProducts(route.params.id)
    toast.success("Sửa trạng thái thành công")
  }else{
    displayStatusDialog.value = false
    toast.error("Sửa trạng thái thất bại")
  }
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