import { defineStore } from 'pinia'
import { layPhiHoaDon } from '@/axios/quanlihoadon'

export const useOrderSummaryStore = defineStore('orderSummary', {
  // State
  state: () => ({
    voucher: 'kkkjkjk',
    storeDiscount: 0,
    subTotal: 950000,
    discount: 95000,
    shippingFee: '59003'
  }),

  // Getters
  getters: {
    total: (state) => {
      return state.subTotal - state.discount + parseInt(state.shippingFee || 0)
    }
  },

  // Actions
  actions: {
    formatPrice(price) {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(price)
    },

    async fetchOrderData(orderId) {
      try {
        const { data, status } = await layPhiHoaDon(orderId)
        if (status === 200) {
          this.voucher = data.tenKhuyenMai
          this.shippingFee = data.phiShip
          this.discount = data.giamGia
          this.subTotal = data.gia
        }
      } catch (error) {
        console.error('Error fetching order data:', error)
      }
    }
  }
})
