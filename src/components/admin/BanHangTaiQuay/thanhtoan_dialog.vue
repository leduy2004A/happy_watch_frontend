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
          v-model="customerPayment"
          label="Tiền khách đưa"
          type="number"
          outlined
          dense
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
        >
          XÁC NHẬN
        </v-btn>
      </v-card-actions>
    </v-card>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { thanhtoan } from '@/axios/thanhtoan';
  import useEmitter from '@/useEmitter';
  const props = defineProps({
    hoaDonId:Number
  })
  const totalAmount = ref(2127500);
const paymentMethod = ref('Tiền mặt');
const customerPayment = ref(0);
const hoaDonId = ref(0)
const transactions = ref([
]);
const remainingAmount = computed(() => {
  const totalPaid = transactions.value.reduce((sum, transaction) => sum + transaction.amount, 0);
  return Math.max(totalAmount.value - totalPaid, 0);
});

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const closePayment = () => {
  // Implement close logic
  console.log('Close payment');
};

const confirmPayment = async () => {
  // Implement payment confirmation logic
  const dataPayment = {
    tienKhachDua:customerPayment.value,
    phuongThuc:paymentMethod.value,
    hoaDonId:props.hoaDonId
  }
  const resultPayment = await (await thanhtoan(dataPayment)).data.thanhToan
  transactions.value.push(resultPayment)
  // console.log(resultPayment)
  // console.log('Payment confirmed');
};

const removeTransaction = (index) => {
  transactions.value.splice(index, 1);
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