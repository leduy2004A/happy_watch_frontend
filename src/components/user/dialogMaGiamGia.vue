<template>
   <Dialog 
      header="Xác nhận Mã Ưu Đãi" 
      v-model:visible="isModalVisible" 
      :modal="true" 
      :closable="false" 
      :draggable="false" 
      :resizable="true" 
    
      class="modal-dialog"
    >
     <div class="promotion-codes">

    <!-- Mã khuyến mãi công khai -->
    <div class="section">
      <h3>Mã khuyến mãi công khai</h3>
      <div v-for="code in maKhuyenMaiCongKhai" :key="code.id" class="code-card">
        <div class="code-info">
          <div class="discount-text">{{ code.ten }}</div>
          <div class="code">{{ code.ma }}</div>
          <div class="expiry">Khuyến mãi từ giá: {{ formatPrice(code.khuyenMaiTuGia)  }}</div>
          <div class="expiry">Số giảm: {{ code.phanTramGiamGia + '%'||code.soTienGiam   }}</div>
          <div class="expiry">HSD: {{ formatDate(code.ngayBatDau) }} - {{ formatDate(code.ngayKetThuc) }}</div>
        </div>
        <Button 
          :icon="code.selected ? 'pi pi-check' : 'pi pi-plus'"
          :class="['p-button-rounded', code.selected ? 'p-button-success' : 'p-button-text']"
          @click="selectCode(code)"
        />
      </div>
    </div>

    <!-- Mã khuyến mãi cá nhân -->
    <div class="section">
      <h3>Mã khuyến mãi cá nhân</h3>
      <div v-for="code in maKhuyenMaiCaNhan" :key="code.id" class="code-card">
        <div class="code-info">
          <div class="discount-text">{{ code.ten }}</div>
          <div class="code">{{ code.ma }}</div>
          <div class="expiry">Khuyến mãi từ giá: {{formatPrice(code.khuyenMaiTuGia)  }}</div>
          <div class="expiry">Số giảm: {{ code.phanTramGiamGia + '%'||code.soTienGiam   }}</div>
          <div class="expiry">HSD: {{ formatDate(code.ngayBatDau) }} - {{ formatDate(code.ngayKetThuc) }}</div>
        </div>
        <Button 
          :icon="code.selected ? 'pi pi-check' : 'pi pi-plus'"
          :class="['p-button-rounded', code.selected ? 'p-button-success' : 'p-button-text']"
          @click="selectCode(code)"
        />
      </div>
    </div>

    <Button 
      label="Tiếp tục" 
      class="continue-btn"
      :disabled="!selectedCode"
      @click="continueNhe"
    />
  </div> 
  <template #footer>
      <Button label="Đóng" @click="closeDialog" class="p-button-secondary" />
    </template>
  </Dialog>

</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import useEmitter  from '@/useEmitter';
import { useToast } from 'vue-toastification';
const toast = useToast()
const emitter = useEmitter()
import { getKhuyenMaiCongKhai,getKhuyenMaiCaNhan } from '@/axios/giamGia';
const isModalVisible = ref(false)
import { useCheckOutStore } from '@/store/checkOutStore';
const checkoutStore = useCheckOutStore()
const maKhuyenMaiCongKhai = ref([])
const maKhuyenMaiCaNhan = ref([])
// Dữ liệu danh sách mã khuyến mãi
const props = defineProps({
  modalMGG:Boolean
})
const publicCodes = ref([
  {
    id: 1,
    code: 'GG304',
    description: 'Giảm 10% cho đơn từ đ100,000 Tới đa đ200,000',
    expiry: '2024-05-12T19:34:00',
    selected: false
  }
])

const personalCodes = ref([
  {
    id: 2,
    code: 'giảm giá tháng 4',
    description: 'Giảm 15% cho đơn từ đ1,000,000 Tới đa đ150,000',
    expiry: '2024-05-12T19:39:00',
    selected: false
  }
])
watch(() => props.modalMGG, (newValue) => {
      isModalVisible.value = newValue
});
// Mã khuyến mãi được chọn
const selectedCode = ref(null)
const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };
// Hàm chọn mã khuyến mãi
const selectCode = (code) => {
  // Bỏ chọn tất cả các mã trong cả ba danh sách
  [...publicCodes.value, ...personalCodes.value, ...maKhuyenMaiCongKhai.value,...maKhuyenMaiCaNhan.value].forEach(c => {
    c.selected = false;
  });

  // Chọn mã hiện tại
  code.selected = true;
  selectedCode.value = code;
};
// Định dạng ngày hết hạn
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Hàm đóng dialog
const closeDialog = () => {
  isModalVisible.value = false
  emitter.emit("closeDialog",false)
  console.log('Đóng dialog')
}

// Hàm tiếp tục xử lý
const continueNhe = () => {
  const tongTien = checkoutStore.tinhTongTienHang(); // Tính tổng tiền
  const phanTramGiam = selectedCode.value.phanTramGiamGia;
  const soTienGiam = selectedCode.value.soTienGiam;
  const khuyenMaiTuGia = selectedCode.value.khuyenMaiTuGia;

  if (tongTien < khuyenMaiTuGia) {
    toast.error("Sản phẩm không đủ điều kiện áp dụng mã");
  } else {
    checkoutStore.countCode = selectedCode.value.ma
    checkoutStore.idDiscount = selectedCode.value.id
    // Nếu là khuyến mãi phần trăm, tính số tiền giảm
    if (phanTramGiam) {
      checkoutStore.discount = (tongTien * phanTramGiam) / 100;
      isModalVisible.value = false
      emitter.emit("closeDialog",false)
      toast.success("Thêm khuyến mãi thành công")
    } else if (soTienGiam) {
      checkoutStore.discount = soTienGiam; // Nếu là khuyến mãi cố định
      isModalVisible.value = false
      emitter.emit("closeDialog",false)
      toast.success("Thêm khuyến mãi thành công")
    } else {
      isModalVisible.value = false
      emitter.emit("closeDialog",false)
      checkoutStore.discount = 0; // Không có giảm giá
    }
  }
};
onMounted(async ()=>{
  const result = await getKhuyenMaiCongKhai()
  const resutlCaNhan = await getKhuyenMaiCaNhan()
  if(result.status === 200)
  {
    maKhuyenMaiCongKhai.value = result.data.map((code) => ({
      ...code,
      selected: false
    }));
    console.log(maKhuyenMaiCongKhai.value)
  }
  if(resutlCaNhan.status === 200)
  {
    maKhuyenMaiCaNhan.value = resutlCaNhan.data.map((code) => ({
      ...code,
      selected: false
    }));
  }
})
</script>

<style scoped>
.promotion-codes {
  padding: 1rem;
  max-width: 700px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.section {
  margin-bottom: 1.5rem;
}

.section h3 {
  color: #666;
  margin-bottom: 1rem;
}

.code-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.code-info {
  flex: 1;
}

.discount-text {
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.code {
  color: #2196F3;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.expiry {
  font-size: 0.8rem;
  color: #666;
}

.continue-btn {
  width: 100%;
  margin-top: 1rem;
}
</style>
