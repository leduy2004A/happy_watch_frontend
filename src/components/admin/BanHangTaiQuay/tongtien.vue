<template>
 
    <div class="khachhang">
  <h2 class="card-title">Khách hàng</h2>
  <v-btn prepend-icon="$vuetify" variant="outlined" @click="openModal()">
  Chọn khách hàng
</v-btn>
  
</div>
<hr class="mb-10"/>
<div class="khachhang">
  <h2 class="card-title">Tên khách hàng</h2>
  <v-chip>
    {{ diachi && diachi.nguoiDung && diachi.nguoiDung.ten ? diachi.nguoiDung.ten : 'Khách lẻ' }}
</v-chip>
<div class="switch-group">
    <v-switch label="Giao hàng"></v-switch>
  </div>
</div>
<hr class="mb-10"/>
<div class="hoadon">
  <div class="diachi">
    <dia_chi_khach_hang :diachi="diachi"></dia_chi_khach_hang>
  </div>
  <div class="order-summary-card">

  <h2 class="card-title">Thông tin đơn hàng</h2>
  
  <div class="input-group">
    <label for="discount-code">Phiếu giảm giá</label>
    <input type="text" id="discount-code" class="input-field" v-model="discountCode" placeholder="Nhập phiếu giảm giá" >
  </div>

  <div class="input-group">
    <label for="order-amount">Tiền hàng</label>
    <input type="text" id="order-amount" class="input-field" v-model="orderAmountFormatted" placeholder="Tiền hàng" disabled>
  </div>

  <div class="input-group">
    <label for="shipping-fee">Phí vận chuyển</label>
    <input type="text" id="shipping-fee" class="input-field" v-model="shippingFeeFormatted" placeholder="Phí vận chuyển" disabled>
  </div>

  <div class="input-group">
    <label for="discount-amount">Giảm giá</label>
    <input type="text" id="discount-amount" class="input-field" v-model="discountAmountFormatted" placeholder="Giảm giá" disabled>
  </div>

  <hr />

  <div class="total-row">
    <h3 class="total-title">Tổng số tiền</h3>
    <h3 class="total-amount">{{ totalAmount(dataTongTien.tongTienSauKhuyenMai + shippingFee) }}</h3>
  </div>

  <hr />

  <div class="input-group">
    <label for="amount-paid">Khách thanh toán</label>
    <v-icon @click="phuongThucThanhToan()">mdi-cash-100</v-icon>
  </div>

  <div class="remaining-row" v-if="false">
    <h3 class="remaining-title">Tiền thiếu</h3>
    <h3 class="remaining-amount">{{ remainingAmount }}</h3>
  </div>

  <hr />

  <button class="confirm-button" @click="confirmOrder()">Xác nhận đặt hàng</button>
</div>
 
</div>



<dialog_khachhang :modal="modal"></dialog_khachhang>
 <dialog_thanhtoan :modal="modalThanhToan" :hoaDonId="hoaDonId"></dialog_thanhtoan>
</template>

<script setup>
import { getPhiShip } from '@/axios/giaohangnhanh';
import dia_chi_khach_hang from './dia_chi_khach_hang.vue';
import { ref, computed,onMounted } from 'vue';
import dialog_khachhang from './dialog_khachhang.vue';
import dialog_thanhtoan from './dialog_thanhtoan.vue';
import useEmitter from '@/useEmitter';
const emitter = useEmitter()
const modal = ref(false)
const modalThanhToan = ref(false)
const customerName = ref('');
const discountCode = ref('');
const orderAmount = ref(2377500); // Ví dụ về số tiền ban đầu
const shippingFee = ref(0); // Ví dụ về phí vận chuyển
const discountAmount = ref(475500); // Ví dụ về giảm giá
const amountPaid = ref(0);
const isDelivery = ref(false);
const diachi = ref({})
const dataTongTien = ref({})
const hoaDonId = ref(0)
onMounted(()=>{
  emitter.on("close_dialog",data=>{
    modal.value = data
  })
  emitter.on("close_dialogthanhtoan",data=>{
    modalThanhToan.value = data
  })
  emitter.on("diachivakhachhang",data=>{
    diachi.value = data
    console.log(diachi.value)
  })
  emitter.on("tongsanpham",data=>{
    dataTongTien.value = data
    console.log(dataTongTien.value)
    discountCode.value = data.maKhuyenMaiTotNhat
    orderAmount.value = data.tongTienHoaDon;
    discountAmount.value = data.giaGiamTotNhat
  })
  emitter.on("dataShip",async data=>{
    const dataShip = {
      district: data.district,
      ward:data.ward,
      weight: dataTongTien.value.tongCanNang,
      name: 'Đồng hồ',
    }
    const result = await (await getPhiShip(dataShip)).data
    shippingFee.value = result.data.total
  })
  emitter.on("addTab",data=>{
    hoaDonId.value = data
  })
})
// Hàm chọn khách hàng
const selectCustomer = () => {
  // Logic để chọn khách hàng
  alert('Chọn khách hàng');
};

// Tạo computed property cho tổng tiền đã định dạng
const orderAmountFormatted = computed(() => {
  return orderAmount.value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
});

const shippingFeeFormatted = computed(() => {
  return shippingFee.value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
});

const discountAmountFormatted = computed(() => {
  return discountAmount.value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
});

// Tạo computed property cho tổng tiền thanh toán
const totalAmount = (data) => {
  const amount = Number(data) || 0; // Chuyển đổi data thành số hoặc đặt giá trị mặc định là 0
  return amount.toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND'
  });
}
// Tạo computed property cho tiền còn lại
const remainingAmount = computed(() => {
  return (totalAmount.value - amountPaid.value).toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND'
  });
});

// Tạo một property định dạng cho amountPaid
const amountPaidFormatted = computed({
  get() {
    return amountPaid.value.toLocaleString('vi-VN');
  },
  set(value) {
    // Loại bỏ dấu phẩy và cập nhật giá trị
    amountPaid.value = parseInt(value.replace(/,/g, ''), 10) || 0;
  }
});

const formatAmountPaid = (event) => {
  // Cập nhật định dạng khi nhập
  const value = event.target.value.replace(/\D/g, ''); // Chỉ giữ lại số
  amountPaid.value = parseInt(value, 10) || 0; // Cập nhật giá trị
};

const confirmOrder = () => {
  emitter.emit("orderClick")
  alert('Đặt hàng thành công!');
};
const openModal = ()=>{
  modal.value = true
}
const phuongThucThanhToan = ()=>{
  modalThanhToan.value = true
}
</script>

<style scoped>
.v-switch .v-selection-control {
    min-height: 0;
}
.khachhang{
  display: flex;
  justify-content: space-between;
}
.hoadon{
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.order-summary-card {
  padding: 20px;
  border-radius: 12px; /* Góc tròn */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* Bóng đổ */
  background-color: #ffffff; /* Màu nền trắng */
  width: 500px; /* Chiều rộng tối đa */
  /* margin: auto; Căn giữa */
}

.card-title {
  color: #3f51b5; /* Màu tiêu đề */
  font-size: 22px; /* Kích thước chữ tiêu đề */
  font-weight: 600; /* Đậm */
  margin-bottom: 16px; /* Khoảng cách dưới tiêu đề */
}

.input-group {
  margin-bottom: 16px; /* Khoảng cách giữa các input */
}

.input-group label {
  display: block; /* Đảm bảo label chiếm một dòng */
  margin-bottom: 8px; /* Khoảng cách giữa label và input */
}

.input-field {
  width: 100%; /* Chiều rộng 100% */
  padding: 8px; /* Padding cho input */
  border: 1px solid #ddd; /* Đường viền nhẹ */
  border-radius: 4px; /* Góc tròn */
  background-color: #f9f9f9; /* Màu nền nhẹ cho input */
}

.total-row, .remaining-row {
  margin-top: 16px; /* Khoảng cách giữa tổng và các ô input khác */
}

.total-title, .remaining-title {
  color: #333; /* Màu tối cho tiêu đề tổng số tiền */
  font-weight: 500;
  font-size: 18px; /* Kích thước chữ lớn hơn */
}

.total-amount, .remaining-amount {
  color: #f44336; /* Màu đỏ cho tổng số tiền */
  font-size: 24px; /* Kích thước chữ lớn hơn */
  font-weight: 700; /* Đậm hơn */
}

.confirm-button {
  margin-top: 20px; /* Khoảng cách trên nút */
  width: 100%; /* Chiều rộng 100% */
  background-color: #3f51b5; /* Màu xanh cho nút xác nhận */
  color: #ffffff; /* Màu chữ trắng */
  border: none; /* Không có viền */
  border-radius: 5px; /* Góc tròn cho nút */
  padding: 10px; /* Padding cho nút */
  font-size: 16px; /* Kích thước chữ cho nút */
  cursor: pointer; /* Con trỏ khi hover */
}

.confirm-button:hover {
  background-color: #303f9f; /* Màu tối hơn khi hover */
}

.delivery-switch {
  margin-left: 8px; /* Khoảng cách bên trái cho switch */
}

</style>
