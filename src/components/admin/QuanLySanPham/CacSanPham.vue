<template>
  <div class="card">
    <h3 class="my-5">Sản Phẩm</h3>
    <div class="flex flex-wrap justify-content-between align-items-center mb-4">
      <!-- Search bar -->
      <span class="p-input-icon-left">
        <i class="pi pi-search" />
        <InputText
          v-model="productStore.search"
          placeholder="Nhập tên sản phẩm để tìm..."
          class="p-inputtext-sm"
        />
      </span>

      <div class="flex flex-wrap gap-2">
        <!-- Status filter -->
        <SelectButton
          v-model="productStore.statusFilter"
          :options="statusOptions"
          optionLabel="label"
          optionValue="value"
          class="mr-2"
        />

        <!-- Action buttons -->
        <Button
          icon="pi pi-file-excel"
          class="p-button-outlined p-button-success"
          @click="exportExcel"
          size="small"
        >
          Export Excel
        </Button>

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
        field="status"
        header="Trạng thái"
        alignHeader="center"
      >
        <template #body="slotProps">
          <Tag
            :severity="getStatusSeverity(slotProps.data.status)"
            :value="slotProps.data.status"
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
        </template>
      </Column>
    </DataTable>
  </div>
  <dialog_them-san-pham :modal="modalThemSanPham" />
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

const statusOptions = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Đang bán', value: 'selling' },
  { label: 'Ngừng bán', value: 'stopped' }
]

const filters = ref({})

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
</style>