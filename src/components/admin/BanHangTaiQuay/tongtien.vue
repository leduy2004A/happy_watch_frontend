<template>
  <div class="khachhang" v-if="hoaDonStore.hoaDonId !=0">
    <h2 class="card-title">Khách hàng</h2>
    <v-btn prepend-icon="$vuetify" variant="outlined" @click="store.openModal()" v-if="store.isChonKhach">
      Chọn khách hàng
    </v-btn>
  </div>
  
  <hr class="mb-10" />
  
  <div class="khachhang" v-if="hoaDonStore.hoaDonId !=0">
    <h2 class="card-title">Tên khách hàng</h2>
    <v-chip>{{store.diachi.ten || store.customerInfo }}</v-chip>
    <!-- <v-chip>{{  store.diachi.ten }}</v-chip> -->
    <div class="switch-group">
      <v-switch v-model="store.isDelivery" label="Giao hàng" inset color="orange" :disabled="store.isDisable"></v-switch>
    </div>
  </div>
  
  <hr class="mb-10"/>
  
  <div class="hoadon" v-if="hoaDonStore.hoaDonId !=0">
    
    <div class="diachi">
      <transition name="fade-slide">
        <dia_chi_khach_hang :diachi="store.diachi" v-if="store.isDelivery"></dia_chi_khach_hang>
      </transition>
      
    </div>
    
    <div class="order-summary-card">
      <h2 class="card-title">Thông tin đơn hàng</h2>
      
      <div class="input-group">
        <label for="discount-code">Phiếu giảm giá</label>
        <input 
          type="text" 
          id="discount-code" 
          class="input-field" 
          v-model="store.discountCode" 
          placeholder="Nhập phiếu giảm giá"
          disabled
        >
      </div>

      <div class="input-group">
        <label for="order-amount">Tiền hàng</label>
        <input 
          type="text" 
          id="order-amount" 
          class="input-field" 
          :value="store.orderAmountFormatted" 
          placeholder="Tiền hàng" 
          disabled
        >
      </div>

      <div class="input-group">
        <label for="shipping-fee">Phí vận chuyển</label>
        <input 
          type="text" 
          id="shipping-fee" 
          class="input-field" 
          :value="store.shippingFeeFormatted" 
          placeholder="Phí vận chuyển" 
          disabled
        >
      </div>

      <div class="input-group">
        <label for="discount-amount">Giảm giá</label>
        <input 
          type="text" 
          id="discount-amount" 
          class="input-field" 
          :value="store.discountAmountFormatted" 
          placeholder="Giảm giá" 
          disabled
        >
      </div>

      <hr />

      <div class="total-row">
        <h3 class="total-title">Tổng số tiền</h3>
        <h3 class="total-amount">{{ store.formatCurrency(store.totalAmountValue) }}</h3>
      </div>

      <hr />

      <div class="input-group">
        <label for="amount-paid">Khách thanh toán</label>
        <v-icon @click="store.openThanhToanModal()">mdi-cash-100</v-icon>
      </div>

      <div class="remaining-row">
        <h3 class="remaining-title">Tiền thừa</h3>
        <h3 class="remaining-amount">{{ store.formatCurrency(store.tinhTienThua())}}</h3>
      </div>

      <hr />

      <v-btn class="confirm-button" @click="handleConfirmOrder" :disabled="(!diaChiStore.valid) && store.isDelivery">
        Xác nhận đặt hàng
      </v-btn>
    </div>
  </div>

  <dialog_khachhang :modal="store.modal"></dialog_khachhang>
  <dialog_thanhtoan 
    :modal="store.modalThanhToan" 
    :hoaDonId="store.hoaDonId"
  ></dialog_thanhtoan>
</template>

<script setup>
import Sweetalert2 from "sweetalert2";
import { useToast } from 'vue-toastification'
import { onMounted } from 'vue'
import { useOrderStore } from '@/store/tienStore'

import dia_chi_khach_hang from './dia_chi_khach_hang.vue'
import dialog_khachhang from './dialog_khachhang.vue'
import dialog_thanhtoan from './dialog_thanhtoan.vue'
import useEmitter from '@/useEmitter'
import { watch } from 'vue'
import { useInvoiceStore } from "@/store/invoiceStore";
import { useAddressStore } from "@/store/diaChiStore";
import {useLoading} from 'vue-loading-overlay'
import { useExportPdf } from './exportPdf'
import { useSanPhamTrongHoaDonStore } from '@/store/sanPhamTrongHoaDonStore'
const sanPhamHoaDonStore =useSanPhamTrongHoaDonStore()
const { exportToPdf } = useExportPdf()
const $loading = useLoading({
    // options
    loader:'bars',
    lockScroll:false,
    color:'orange'
});
const hoaDonStore = useInvoiceStore();
const emitter = useEmitter()
const store = useOrderStore()
const diaChiStore = useAddressStore()
const toast = useToast()
const handleConfirmOrder = async () => {
    if(store.isDelivery == false) {
      Sweetalert2.fire({
        title: "Bạn có muốn xác nhận không?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Xác nhận",
        denyButtonText: `Không !`,
      }).then(async (result) => {
        if (result.isConfirmed) {

            
        let loader = null;
        if(store.isDelivery)
        {
             try {
            loader = $loading.show();
            const result = await diaChiStore.xacNhanDonHang()
            console.log(result)
            if(result.result.status == 200) {
                toast.success("Đã xác nhận đơn hàng")
                const dataExportPdf = {
                  tenKhachHang:store.customerInfo,
                  diaChiNhanHang:"Tại cửa hàng",
                  nhanVien:"",
                  hoaDonId:hoaDonStore.hoaDonId,
                  maHoaDon:hoaDonStore.maHoaDon,
                  ngayTao:hoaDonStore.ngayTao,
                  products: sanPhamHoaDonStore.products,
                  tienHang:store.orderAmountFormatted,
                  giamGia:store.discountAmountFormatted,
                  phiGiaoHang:store.shippingFeeFormatted,
                  tongTien:store.formatCurrency(store.totalAmountValue)
                }
                exportToPdf(dataExportPdf)
                // Thêm delay trước khi reload
                await new Promise(resolve => setTimeout(resolve, 2000));
                window.location.href = window.location.href
                console.log(result.data)
            }
        } catch (error) {
            toast.error(error.response.data || error.response)
        } finally {
            // Kiểm tra nếu loader tồn tại thì mới hide
            if (loader) {
                loader.hide()
            }
        }
        }else{
          try {
            loader = $loading.show();
            const result = await diaChiStore.xacNhanDonHangTaiQuay()
            console.log(result)
            if(result.result.status == 200) {
                toast.success("Đã xác nhận đơn hàng")
                const dataExportPdf = {
                  tenKhachHang:store.customerInfo,
                  diaChiNhanHang:"Tại cửa hàng",
                  nhanVien:"",
                  hoaDonId:hoaDonStore.hoaDonId,
                  maHoaDon:hoaDonStore.maHoaDon,
                  ngayTao:hoaDonStore.ngayTao,
                  products: sanPhamHoaDonStore.products,
                  tienHang:store.orderAmountFormatted,
                  giamGia:store.discountAmountFormatted,
                  phiGiaoHang:store.shippingFeeFormatted,
                  tongTien:store.formatCurrency(store.totalAmountValue)
                }
                exportToPdf(dataExportPdf)
                // Thêm delay trước khi reload
                await new Promise(resolve => setTimeout(resolve, 2000));
                window.location.href = window.location.href
                console.log(result.data)
            }
        } catch (error) {
            toast.error(error.response.data || error.response)
        } finally {
            // Kiểm tra nếu loader tồn tại thì mới hide
            if (loader) {
                loader.hide()
            }
        }
        }
     
          
        } else if (result.isDenied) {
          Swal.fire("Changes are not saved", "", "info");
        }
      });




    } else {
        emitter.emit("orderClick")
    }
}
onMounted(() => {
  emitter.on("close_dialog", store.closeModal)
  emitter.on("close_dialogthanhtoan", store.closeThanhToanModal)
  emitter.on("diachivakhachhang", store.updateDiaChiKhachHang)
  emitter.on("tongsanpham", store.updateTongTien)
  emitter.on("dataShip", async (data) => {
    await store.calculateShippingFee(data.district, data.ward)
  })
  emitter.on("addTab", store.setHoaDonId)
})
watch(store.products,(newVal,oldVal)=>{
  if(newVal)
  {
    console.log(newVal)
    store.resetSetForm()
  }
}),
watch(
  () => store.isDelivery,
  (isDelivery) => {
    if (isDelivery === false) {
      store.resetFeeShip()
      console.log(isDelivery)
    }
    else{
      store.resetFeeShip()
    }
  }
)
</script>

<style scoped>
.v-switch .v-selection-control {
  min-height: 0;
}
.khachhang {
  display: flex;
  justify-content: space-between;
}
.hoadon {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.order-summary-card {
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  width: 500px;
}

.card-title {
  color: #3f51b5;
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 16px;
}

.input-group {
  margin-bottom: 16px;
}

.input-group label {
  display: block;
  margin-bottom: 8px;
}

.input-field {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f9f9f9;
}

.total-row, .remaining-row {
  margin-top: 16px;
}

.total-title, .remaining-title {
  color: #333;
  font-weight: 500;
  font-size: 18px;
}

.total-amount, .remaining-amount {
  color: #f44336;
  font-size: 24px;
  font-weight: 700;
}

.confirm-button {
  margin-top: 20px;
  width: 100%;
  background-color: #3f51b5;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  padding: 10px;
  font-size: 16px;
  cursor: pointer;
}

.confirm-button:hover {
  background-color: #303f9f;
}

.delivery-switch {
  margin-left: 8px;
}
.fade-slide-enter-active, .fade-slide-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.fade-slide-enter-from, .fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
.fade-slide-enter-to, .fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>