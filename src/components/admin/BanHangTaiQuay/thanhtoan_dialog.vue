<template>
  <v-card class="payment-card" elevation="2">
    <v-card-title class="text-center">
      THANH TOÁN
    </v-card-title>
    <v-card-text>
      <div class="d-flex justify-space-between mb-4">
        <span>Tổng tiền hàng</span>
        <span class="red--text">{{ formatCurrency(totalAmount) }}</span>
      </div>
      <v-btn-toggle v-model="paymentMethod" mandatory class="d-flex mb-4">
        <v-btn value="Chuyển khoản" class="flex-grow-1" color="pink lighten-4">
          CHUYỂN KHOẢN
        </v-btn>
        <v-btn value="Tiền mặt" class="flex-grow-1" color="green">
          TIỀN MẶT
        </v-btn>
      </v-btn-toggle>
      <v-text-field
        v-model="rawValue"
        label="Tiền khách đưa"
        @keydown="handleKeyDown"
        @input="handleInput"
        ref="inputField"
        outlined
        dense
      ></v-text-field>
      <v-text-field
      v-if="paymentMethod === 'Chuyển khoản'"
        label="Mã Giao Dịch"
        ref="inputField"
        outlined
        dense
        v-model="maGiaoDich"
      ></v-text-field>
      <div class="table-container">
        <table class="payment-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Mã giao dịch</th>
              <th>Phương thức</th>
              <th>Số tiền</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(transaction, index) in transactions" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ transaction.maGiaoDich }}</td>
              <td>{{ transaction.phuongThuc }}</td>
              <td>{{ formatCurrency(transaction.soTien) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="d-flex justify-space-between mb-4">
        <span>Tiền thiếu</span>
        <span class="red--text">{{ formatCurrency(remainingAmount) }}</span>
      </div>
    </v-card-text>
    <v-card-actions>
      <v-btn
        color="green"
        block
        large
        @click="confirmPayment"
        v-if="unseenButon"
      >
        XÁC NHẬN
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { ref, computed, nextTick, watch } from 'vue';
import { thanhtoan } from '@/axios/thanhtoan';
import { useOrderStore } from '@/store/tienStore';
import { useAddressStore } from '@/store/diaChiStore';
import { useToast } from 'vue-toastification';
const toast = useToast()
const tienStore = useOrderStore();
const diaChiStore = useAddressStore();
const inputField = ref(null);
const unseenButon = ref(true)
const props = defineProps({
  hoaDonId: Number
});
const maGiaoDich = ref("")
const totalAmount = ref(2127500);
const paymentMethod = ref('Tiền mặt');
const customerPayment = ref(0);
const rawValue = ref('');
const transactions = ref([]);
totalAmount.value = tienStore.totalAmountValue
const remainingAmount = computed(() => {
  return Math.max(totalAmount.value - customerPayment.value, 0);
});
watch(rawValue,(newVal,oldVal)=>{
  if(newVal)
  {
    tienStore.setTienKhachTra(parseCurrencyToNumber(newVal))
  }
})
watch(transactions.value,(newVal,oldVal)=>{
  console.log(newVal)
  if(newVal)
  {
    unseenButon.value = false
  }
})
const formatCurrency = (value) => {
  if (!value && value !== 0) return '';
  return new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};
const parseCurrencyToNumber = (rawValue) => {
  // Loại bỏ tất cả các ký tự không phải số (bao gồm dấu phân cách hàng nghìn)
  const numericString = rawValue.replace(/[^\d]/g, '');
  
  // Chuyển đổi chuỗi đã làm sạch thành số
  const numberValue = parseInt(numericString, 10) || 0;
  
  return numberValue;
};
const handleKeyDown = (event) => {
  // Cho phép các phím điều hướng, xóa, số
  const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
  if (!allowedKeys.includes(event.key) && !/^\d$/.test(event.key)) {
    event.preventDefault();
  }
};

const handleInput = (event) => {
  // Lấy vị trí con trỏ hiện tại
  const cursorPosition = event.target.selectionStart;
  
  // Chỉ giữ lại số
  let value = event.target.value.replace(/[^\d]/g, '');
  
  // Chuyển thành số
  const numericValue = parseInt(value) || 0;
  customerPayment.value = numericValue;
  
  // Cập nhật giá trị hiển thị
  rawValue.value = formatCurrency(numericValue);
  
  // Đặt lại vị trí con trỏ sau khi cập nhật giá trị
  nextTick(() => {
    if (inputField.value.$el.querySelector('input')) {
      const input = inputField.value.$el.querySelector('input');
      const newPosition = Math.max(0, Math.min(cursorPosition, rawValue.value.length));
      input.setSelectionRange(newPosition, newPosition);
    }
  });
};

const confirmPayment = async () => {
  const dataPayment = {
    tienKhachDua: customerPayment.value,
    phuongThuc: paymentMethod.value,
    hoaDonId: props.hoaDonId,
    tenKhachHang: diaChiStore.formData.ten,
    gia: tienStore.totalAmountValue,
    maGiaoDich:maGiaoDich.value
  };
  console.log(dataPayment);
  try{
    const resultPayment =  await thanhtoan(dataPayment);
    if(resultPayment.status == 200)
    {
      toast.success("Thanh toán thành công")
      transactions.value.push(resultPayment.data.thanhToan);
    }

  }catch(error){
    console.log(error)
   const errorMessage = error.response?.data || "Có lỗi xảy ra khi thanh toán";
    toast.error(errorMessage);
  }
 
};
</script>
  
<style scoped>
.payment-card {
  position: relative;
}
.close-button {
  position: absolute;
  top: 8px;
  right: 8px;
}
.table-container {
  max-height: 200px;
  overflow-y: auto;
  margin-bottom: 1rem;
}
.payment-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
}
.payment-table th,
.payment-table td {
  border: 1px solid #e0e0e0;
  padding: 8px;
  text-align: left;
}
.payment-table th {
  background-color: #f9a825;
  color: white;
  font-weight: bold;
}
.payment-table tr:nth-child(even) {
  background-color: #f5f5f5;
}
.payment-table tr:hover {
  background-color: #eeeeee;
}
</style>