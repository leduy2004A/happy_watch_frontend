<template>
    <div class="card">
      <!-- Search and Filter Section -->
      <h4 class="my-4">Phiếu giảm giá</h4>
      
      <div class="grid mb-4">
        <div class="col-12">
          <span class="p-input-icon-left w-full">
            <InputText 
              v-model="search" 
              placeholder="Tìm phiếu giảm giá theo mã hoặc tên"
              class="w-full"
            />
          </span>
        </div>
  
        <div class="col-12 md:col-3">
          <Calendar 
            v-model="dateFilter.startDate"
            :showTime="true"
            placeholder="Từ ngày"
            class="w-full"
            dateFormat="dd/mm/yy"
          />
        </div>
  
        <div class="col-12 md:col-3">
          <Calendar 
            v-model="dateFilter.endDate"
            :showTime="true"
            placeholder="Đến ngày"
            class="w-full"
            dateFormat="dd/mm/yy"
          />
        </div>
  
        <div class="col-12 md:col-2">
          <Dropdown
            v-model="selectedType"
            :options="types"
            placeholder="Kiểu"
            class="w-full"
          />
        </div>
  
        <div class="col-12 md:col-2">
          <Dropdown
            v-model="selectedStatus"
            :options="statuses"
            placeholder="Trạng thái"
            class="w-full"
          />
        </div>
  
        <div class="col-12 md:col-2">
          <Button 
            label="Tạo mới" 
            icon="pi pi-plus" 
            @click="createNew"
            class="w-full"
          />
        </div>
      </div>
  
      <!-- Data Table -->
      <DataTable 
        :value="filteredVouchers"
        :paginator="true"
        :rows="itemsPerPage"
        :filters="filters"
        stripedRows
        responsiveLayout="scroll"
        :rowsPerPageOptions="[5,10,20]"
      >
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
              formatPrice(slotProps.data.soTienGiam) }}
          </template>
        </Column>
        <!-- <Column field="soLuong" header="Số lượng" sortable></Column> -->
        <Column field="ngayBatDau" header="Ngày bắt đầu" sortable></Column>
        <Column field="ngayKetThuc" header="Ngày kết thúc" sortable></Column>
        <Column field="trangThai" header="Trạng thái" sortable>
          <template #body="slotProps">
            <Tag 
              :severity="getStatusColor(slotProps.data.trangThai)"
              :value="slotProps.data.trangThai"
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
      </DataTable>
    </div>
    
    <dialogTaoGiamGiaSanPham :modal="modalPGG"></dialogTaoGiamGiaSanPham>
    <dialogSuaPhieuGiamGia :modal="modalSuaPGG"></dialogSuaPhieuGiamGia>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  import dialogTaoGiamGiaSanPham from './dialogTaoGiamGiaSanPham.vue'
  import dialogSuaPhieuGiamGia from './dialogSuaPhieuGiamGia.vue'
  import { layTatCaKhuyenMaiSanPham } from '@/axios/khuyenmai'
  import useEmitter from '@/useEmitter'
  
  const emitter = useEmitter()
  const search = ref('')
  const dateFilter = ref({
    startDate: '',
    endDate: ''
  })
  const modalSuaPGG = ref(false)
  const selectedType = ref(null)
  const selectedStatus = ref(null)
  const itemsPerPage = ref(5)
  const modalPGG = ref(false)
  const vouchers = ref([])
  
  const types = ['Tất cả', 'Cá nhân', 'Toàn bộ']
  const statuses = ['Tất cả', 'Đang diễn ra', 'Kết thúc', 'Chưa bắt đầu']
  
  const filters = computed(() => ({
    global: { value: search.value, matchMode: 'contains' }
  }))
  
  const filteredVouchers = computed(() => {
    let filtered = [...vouchers.value]
  
    if (selectedType.value && selectedType.value !== 'Tất cả') {
      filtered = filtered.filter(v => v.loaiApDung === (selectedType.value === 'Toàn bộ' ? 'TOAN_BO':'CA_NHAN'))
    }
  
    if (selectedStatus.value && selectedStatus.value !== 'Tất cả') {
      filtered = filtered.filter(v => v.status === selectedStatus.value)
    }
  
    if (dateFilter.value.startDate && dateFilter.value.endDate) {
      const start = new Date(dateFilter.value.startDate)
      const end = new Date(dateFilter.value.endDate)
      filtered = filtered.filter(v => {
        const voucherStart = new Date(v.startDate)
        const voucherEnd = new Date(v.endDate)
        return voucherStart >= start && voucherEnd <= end
      })
    }
  
    return filtered
  })
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'Còn hiệu lực': return 'success'
      case 'Hết hiệu lực': return 'danger'
      case 'Chưa bắt đầu': return 'warning'
      default: return 'info'
    }
  }
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }
  
  const createNew = () => {
    modalPGG.value = true
  }
  
  const viewVoucher = (voucher) => {
    console.log(voucher)
    modalSuaPGG.value = true
  }
  
  onMounted(async () => {
    emitter.on("close_dialog", value => {
      modalPGG.value = value
      modalSuaPGG.value = value
    })
    
    const result = await layTatCaKhuyenMaiSanPham()
    if(result.status === 200) {
      vouchers.value = result.data
    }
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