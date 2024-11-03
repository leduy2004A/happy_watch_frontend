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
      {
        id: 1,
        name: 'Longines 42mm Nam L2.822.4.56.2',
        vendor: 'VNLUX - Đồng Hồ Chính Hãng',
        price: 38952666,
        quantity: 1,
        image: 'https://thoitranghanoi.vn/admin/webroot/uploads/images/rolex-automatic-blue-light.jpg'
      },
      {
        id: 2,
        name: 'Đồng hồ Rolex Datejust 36',
        vendor: 'VNLUX - Đồng Hồ Chính Hãng',
        price: 42500000,
        quantity: 1,
        image: 'https://thoitranghanoi.vn/admin/webroot/uploads/images/rolex-automatic-blue-light.jpg'
      }
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