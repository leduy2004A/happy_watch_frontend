<template>
  <div class="card">
    <h3 class="my-5">Sản Phẩm</h3>
    <div class="flex flex-wrap justify-content-between align-items-center mb-4">
      <!-- Search bar -->
      <span class="p-input-icon-left">
        <InputText
          v-model="productStore.search"
          placeholder="Nhập tên sản phẩm để tìm..."
          class="p-inputtext-md"
        />
      </span>

      <div class="flex flex-wrap gap-2 button-sp">
        <!-- Status filter -->
        <SelectButton
          v-model="productStore.statusFilter"
          :options="statusOptions"
          optionLabel="label"
          optionValue="value"
          class="mr-2"
        />

        <!-- Action buttons -->
        <!-- <Button
          icon="pi pi-file-excel"
          class="p-button-outlined p-button-success"
          @click="exportExcel"
          size="small"
        >
          Export Excel
        </Button> -->

        <Button
          icon="pi pi-plus"
          
          @click="addNew"
          size="small"
        >
          Thêm mới
        </Button>
      </div>
    </div>

    <DataTable
      :value="productStore.computedItems"
      :loading="productStore.loading"
      :rows="5"
      :filters="filters"
      stripedRows
      paginator
      class="p-datatable-sm"
      responsiveLayout="scroll"
    >
      <!-- STT Column -->
      <Column
        field="stt"
        header="STT"
        style="width: 80px"
        alignHeader="center"
      />
      <Column field="ma" header="Mã" sortable></Column>
      <!-- Product Name Column -->
      <Column
        field="ten"
        header="Tên sản phẩm"
        :sortable="true"
      />

      <!-- Created Date Column -->
      <Column
        field="createdAt"
        header="Ngày thêm"
        :sortable="true"
      />

      <!-- Quantity Column -->
      <Column
        field="soLuong"
        header="Số lượng"
        :sortable="true"
        alignHeader="center"
      />

      <!-- Status Column -->
      <Column
        field="trangThai"
        header="Trạng thái"
        alignHeader="center"
      >
        <template #body="slotProps">
          <Tag
            :severity="getStatusSeverity(slotProps.data.trangThai)"
            :value="slotProps.data.trangThai"
            @click="thayDoiTrangThaiSanPham(slotProps.data)"
          />
        </template>
      </Column>

      <!-- Actions Column -->
      <Column
        header="Thao tác"
        alignHeader="center"
        style="width: 100px"
      >
        <template #body="slotProps">
          <Button
            icon="pi pi-eye"
            class="p-button-text p-button-rounded"
            @click="viewDetails(slotProps.data)"
          />
          <Button
            icon="pi pi-pencil"
            class="p-button-text p-button-rounded"
            @click="updateSanPham(slotProps.data)"
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
        <span>Bạn có chắc muốn thay đổi trạng thái?</span>
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
  <dialog_them-san-pham :modal="modalThemSanPham" />
  <dialogSuaSanPham :modal="modalSuaSanPham" :data-san-pham="data"></dialogSuaSanPham>
</template>

<script setup>
import { onMounted, ref,watch } from 'vue'
import dialog_themSanPham from './dialog_themSanPham.vue'
import dialogSuaSanPham from './dialogSuaSanPham.vue'
import useEmitter from '@/useEmitter'
import { updateTrangThaiSanPham } from '@/axios/sanpham'
import { useDanhSachSP } from '@/store/danhSachSanPhamStore'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
const toast = useToast()
const data = ref({})
const router = useRouter()
const emitter = useEmitter()
const productStore = useDanhSachSP()
const modalThemSanPham = ref(false)
const modalSuaSanPham = ref(false)
const displayStatusDialog = ref(false)
const idSanPham = ref(0)
const statusOptions = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Đang bán', value: 'selling' },
  { label: 'Ngừng bán', value: 'stopped' }
]

const filters = ref({})
watch(
  () => productStore.search,
  () => {
    productStore.setSearch(productStore.search)
  }
)

watch(
  () => productStore.statusFilter,
  () => {
    productStore.setStatusFilter(productStore.statusFilter)
  }
)
const getStatusSeverity = (status) => {
  switch (status) {
    case 'Đang bán':
      return 'success'
    case 'Ngừng bán':
      return 'danger'
    default:
      return 'info'
  }
}
const thayDoiTrangThaiSanPham = (trangThai)=>{
  displayStatusDialog.value = true
  idSanPham.value = trangThai.id

}
const handleConfirmStatusChange =async ()=>{
  const result = await updateTrangThaiSanPham(idSanPham.value)
  if(result.status === 200)
  {
    toast.success("Thay đổi trạng thái thành công")
    await productStore.fetchProducts()
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
const updateSanPham = (item)=>{
  console.log(item)
  data.value = item
  modalSuaSanPham.value = true
}
onMounted(async () => {
  emitter.on("closeModalThemSanPham", value => {
    modalThemSanPham.value = value
    modalSuaSanPham.value = value
  })
  await productStore.fetchProducts()
})
</script>

<style scoped>
.card {
  padding: 1.5rem;
}

:deep(.p-datatable) {
  border-radius: 8px;
  box-shadow: 0 2px 1px -1px rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 1px 3px 0 rgba(0,0,0,.12);
}

:deep(.p-datatable-header) {
  background: var(--surface-ground);
}

.my-5 {
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
}

.gap-2 {
  gap: 0.5rem;
}
.button-sp .p-button{
  width: 80px;
}
</style>