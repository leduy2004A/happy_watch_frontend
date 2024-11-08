// stores/orderStore.js
import { defineStore } from 'pinia'

export const useSuccesStore = defineStore('success', {
  state: () => ({
    orderNumber: '#100483',
    customerInfo: {
      fullName: 'Hải Hậu',
      phone: '0355512555',
      idNumber: '123123123',
      address: {
        ward: 'Xã Vân Trình',
        district: 'Huyện Thạch An',
        city: 'Cao Bằng',
        province: 'Vietnam'
      }
    },
    products: [
    ],
    shipping: {
      method: 'COD',
      fee: 0
    }
  }),

  getters: {
    subtotal: (state) => {
      return state.products.reduce((sum, product) => {
        return sum + product.price * product.quantity
      }, 0)
    },
    total: (state) => {
      return state.subtotal + state.shipping.fee
    }
  },

  actions: {
    formatPrice(price) {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(price)
    }
  }
})