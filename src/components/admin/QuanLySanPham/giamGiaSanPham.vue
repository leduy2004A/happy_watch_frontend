<template>
  <div class="card">
    <h4 class="my-4">Phiếu giảm giá</h4>
    
    <div class="grid mb-4">
      <div class="col-10">
        <span class="p-input-icon-left w-full">
          <InputText 
            v-model="voucherStore.search" 
            placeholder="Tìm phiếu giảm giá theo mã hoặc tên"
            class="w-full"
          />
        </span>
      </div>
      <div class="col-2">
        <Button label="Xoá bộ lọc" class="w-full" @click="voucherStore.xoaBoLoc()"></Button>
       
      </div>
      <div class="col-12 md:col-3">
        <Calendar 
          v-model="voucherStore.dateFilter.startDate"
          :showTime="true"
          placeholder="Từ ngày"
          class="w-full"
          dateFormat="dd/mm/yy"
        />
      </div>

      <div class="col-12 md:col-3">
        <Calendar 
          v-model="voucherStore.dateFilter.endDate"
          :showTime="true"
          placeholder="Đến ngày"
          class="w-full"
          dateFormat="dd/mm/yy"
        />
      </div>

      <!-- <div class="col-12 md:col-2">
        <Dropdown
          v-model="voucherStore.selectedType"
          :options="voucherStore.types"
          placeholder="Kiểu"
          class="w-full"
        />
      </div> -->

      <div class="col-12 md:col-4">
        <Dropdown
          v-model="voucherStore.selectedStatus"
          :options="voucherStore.statuses"
          placeholder="Trạng thái"
          class="w-full"
        />
      </div>

      <div class="col-12 md:col-2">
        <Button 
          label="Tạo mới" 
          icon="pi pi-plus" 
          @click="voucherStore.modalPGG = true"
          class="w-full"
        />
      </div>
    </div>

    <DataTable 
      :value="voucherStore.filteredVouchers"
      :paginator="true"
      :rows="voucherStore.itemsPerPage"
      :filters="voucherStore.filters"
      stripedRows
      responsiveLayout="scroll"
      :rowsPerPageOptions="[5,10,20]"
    >
    
      <!-- Columns remain the same, just update the methods to use store -->
   
      <Column field="id" header="STT" sortable></Column>
    <Column field="ma" header="Mã" sortable></Column>
    <!-- <Column field="ten" header="Tên" sortable></Column> -->
    <!-- <Column field="loaiApDung" header="Kiểu" sortable>
      <template #body="slotProps">
        <Tag 
          :severity="slotProps.data.loaiApDung === 'TOAN_BO' ? 'primary' : 'secondary'"
          :value="slotProps.data.loaiApDung === 'TOAN_BO' ? 'Toàn bộ' : 'Cá nhân'"
        />
      </template>
    </Column> -->
    <Column field="discountType" header="Loại" sortable>
      <template #body="slotProps">
        {{ slotProps.data.soTienGiam === null ? 
          slotProps.data.phanTramGiamGia + '%' : 
          voucherStore.formatPrice(slotProps.data.soTienGiam) }}
      </template>
    </Column>
    <!-- <Column field="soLuong" header="Số lượng" sortable></Column> -->
    <Column field="ngayBatDau" header="Ngày bắt đầu" sortable>
      <template #body="slotProps">
        {{ formatDate(slotProps.data.ngayBatDau) }}
        </template></Column>
    <Column field="ngayKetThuc" header="Ngày kết thúc" sortable>
      <template #body="slotProps">
        {{ formatDate(slotProps.data.ngayKetThuc) }}
        </template></Column>
    <Column field="trangThai" header="Trạng thái" sortable>
        <template #body="slotProps">
          <Tag 
            :severity="voucherStore.getStatusColor(slotProps.data.trangThai)"
            :value="slotProps.data.trangThai"
            @click="voucherStore.capNhatTrangThai(slotProps.data)"
          />
        </template>
      </Column>
    <Column field="actions" header="Hành động">
      <template #body="slotProps">
        <Button 
          icon="pi pi-eye" 
          @click="viewVoucher(slotProps.data)"
          severity="secondary" 
          text
        />
      </template>
    </Column>
      <!-- Other columns... -->
    </DataTable>

    <Dialog 
      v-model:visible="voucherStore.displayStatusDialog" 
      modal 
      header="Xác nhận thay đổi trạng thái" 
      :style="{ width: '350px' }"
    >
      <div class="flex align-items-center justify-content-center">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span>Bạn có chắc muốn thay đổi trạng thái thành "Đã kết thúc"?</span>
      </div>
      <template #footer>
        <Button 
          label="Không" 
          icon="pi pi-times" 
          @click="voucherStore.displayStatusDialog = false" 
          text
        />
        <Button 
          label="Có" 
          icon="pi pi-check" 
          @click="handleConfirmStatusChange" 
          severity="danger" 
          autofocus 
        />
      </template>
    </Dialog>

    <dialogTaoGiamGiaSanPham :modal="voucherStore.modalPGG" />
    <dialogSuaPhieuGiamGiaSanPham :modal="voucherStore.modalSuaPGG" :data-k-m="voucherSanPham"/>
  </div>
</template>

<script setup>
import { onMounted,ref } from 'vue'
import { useVoucherStore } from '@/store/voucherSanPhamStore'
import dialogTaoGiamGiaSanPham from './dialogTaoGiamGiaSanPham.vue'
import dialogSuaPhieuGiamGia from './dialogSuaPhieuGiamGia.vue'
import dialogSuaPhieuGiamGiaSanPham from './dialogSuaPhieuGiamGiaSanPham.vue'
import useEmitter from '@/useEmitter'
import { useToast } from 'vue-toastification'

const toast = useToast()
const emitter = useEmitter()
const voucherStore = useVoucherStore()
const voucherSanPham = ref({})
const handleConfirmStatusChange = async () => {
  const result = await voucherStore.confirmStatusChange()
  if (result.status === 200) {
    toast.success("Thay đổi trạng thái thành công")
    voucherStore.displayStatusDialog = false
    await voucherStore.fetchVouchers()
  }
}
const viewVoucher = (voucher) => {

console.log(voucher)
voucherSanPham.value = voucher
voucherStore.modalSuaPGG = true

}
function formattedTime(dateTime) {
  const date = new Date(dateTime);
  const formattedTime = date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false, // Sử dụng định dạng 24 giờ
  });
  return formattedTime
}
function formatDate(dateTime) {
  console.log(dateTime);
  const date = new Date(dateTime);
  const formattedDate = date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const time = formattedTime(dateTime)
  return `${formattedDate} ${time}`;
}
onMounted(async () => {
  emitter.on("close_dialog", value => {
    voucherStore.modalPGG = value
    voucherStore.modalSuaPGG = value
  })
  
  await voucherStore.fetchVouchers()
})
</script>
  
  <style scoped>
  .card {
    padding: 1.5rem;
    border-radius: 0.5rem;
    background: white;
    box-shadow: 0 2px 1px -1px rgba(0,0,0,0.2), 
                0 1px 1px 0 rgba(0,0,0,0.14), 
                0 1px 3px 0 rgba(0,0,0,0.12);
  }
  
  .my-4 {
    margin-top: 1rem;
    margin-bottom: 1rem;
  }
  
  .mb-4 {
    margin-bottom: 1rem;
  }
  </style>