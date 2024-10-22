// stores/orderStore.js
import { defineStore } from 'pinia'
import { getPhiShip } from '@/axios/giaohangnhanh'
import { useProductStore } from './sanPhamStore'
export const useOrderStore = defineStore('order', {
  state: () => ({
    modal: false,
    modalThanhToan: false,
    customerName: '',
    discountCode: '',
    orderAmount: 0,
    shippingFee: 0,
    discountAmount: 0,
    amountPaid: 0,
    isDelivery: false,
    diachi: {},
    dataTongTien: {},
    hoaDonId: 0,
    tienKhachTra:0,
    tienThua:0
  }),

  getters: {
    orderAmountFormatted: (state) => {
      return state.orderAmount.toLocaleString('vi-VN', { 
        style: 'currency', 
        currency: 'VND' 
      })
    },

    shippingFeeFormatted: (state) => {
      return state.shippingFee.toLocaleString('vi-VN', { 
        style: 'currency', 
        currency: 'VND' 
      })
    },

    discountAmountFormatted: (state) => {
      return state.discountAmount.toLocaleString('vi-VN', { 
        style: 'currency', 
        currency: 'VND' 
      })
    },

    totalAmountValue: (state) => {
      if(state.dataTongTien.tongTienSauKhuyenMai === undefined)
        {
          return 0
        }
      return state.dataTongTien.tongTienSauKhuyenMai + state.shippingFee
    },

    remainingAmount: (state) => {
      const remaining = state.totalAmountValue - state.amountPaid
      return remaining.toLocaleString('vi-VN', {
        style: 'currency',
        currency: 'VND'
      })
    },

    customerInfo: (state) => {
      return state.diachi?.nguoiDung?.ten || 'Vui lòng chọn khách hàng'
    }
  },

  actions: {
    formatCurrency(amount) {
      return amount.toLocaleString('vi-VN', {
        style: 'currency',
        currency: 'VND'
      })
    },
    tinhTienThua(){
      if(this.tienKhachTra > this.totalAmountValue)
        {
          this.tienThua = this.tienKhachTra - this.totalAmountValue
          return this.tienThua
        }
        else{
          this.tienThua = 0
          return this.tienThua
        }
    },
    resetSetForm(){
      const sanPhamProduct = useProductStore()
      if(sanPhamProduct.products.length === 0)
        {
            this.shippingFee = 0,
            this.discountCode = 0,
            this.discountAmount = 0,
            this.orderAmount = 0,
            this.amountPaid = 0,
            this.tienThua = 0,
            this.tienKhachTra = 0
        }
      
    },
    openModal() {
      this.modal = true
    },

    closeModal() {
      this.modal = false
    },

    openThanhToanModal() {
      this.modalThanhToan = true
    },

    closeThanhToanModal() {
      this.modalThanhToan = false
    },

    updateDiaChiKhachHang(data) {
      this.diachi = data
    },

    updateTongTien(data) {
      this.dataTongTien = data
      this.discountCode = data.maKhuyenMaiTotNhat
      this.orderAmount = data.tongTienHoaDon
      this.discountAmount = data.giaGiamTotNhat
    },

    setHoaDonId(id) {
      this.hoaDonId = id
    },
    setTienKhachTra(tien)
    {
      this.tienKhachTra = tien
    },
    async calculateShippingFee(districtId, wardCode) {
      try {
        const dataShip = {
          district: districtId,
          ward: wardCode,
          weight: this.dataTongTien.tongCanNang,
          name: 'Đồng hồ',
        }
        const result = await getPhiShip(dataShip)
        this.shippingFee = result.data.data.total
      } catch (error) {
        console.error('Error calculating shipping fee:', error)
      }
    },

    confirmOrder() {
      // Emit event for order confirmation
      return true
    }
  }
})