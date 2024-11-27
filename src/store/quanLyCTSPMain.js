// stores/chiTietSanPhamStore.js
import { defineStore } from 'pinia'
import { layTatCaChiTietTheoSP } from '@/axios/sanpham'

export const quanLyCTSPMAIN = defineStore('quanLyCTSPMAIN', {
  state: () => ({
    products: [],
    search: '',
    priceRange: [0, 2000000],
    openModalCTSP: false,
    filters: {
      mauSac: null,
      loaiMay: null,
      chatLieuVo: null,
      chatLieuDay: null,
      chongNuoc: null,
      xuatXu: null,
    },
    filterOptions: {
      mauSac: { label: 'Màu sắc', options: ['Tất cả', 'Đỏ', 'Xanh', 'Đen'] },
      loaiMay: { label: 'Loại máy', options: ['Tất cả', 'Automatic', 'Quartz', 'Chronograph'] },
      chatLieuVo: { label: 'Chất liệu vỏ', options: ['Tất cả', 'Thép không gỉ', 'Nhôm', 'Nhựa'] },
      chatLieuDay: { label: 'Chất liệu dây', options: ['Tất cả', 'Da', 'Thép', 'Vải'] },
      chongNuoc: { label: 'Chống nước', options: ['Tất cả', '3ATM', '5ATM'] },
      xuatXu: { label: 'Xuất xứ', options: ['Tất cả', 'Nhật Bản', 'Thụy Sĩ', 'Hàn Quốc'] },
    }
  }),
  
  getters: {
    filteredProducts: (state) => {
      return state.products.filter(product => {
        const matchesPrice = product.gia >= state.priceRange[0] &&
          product.gia <= state.priceRange[1]

        const matchesFilters = Object.entries(state.filters).every(([key, value]) => {
          return !value || value === 'Tất cả' || product[key] === value
        })

        return matchesPrice && matchesFilters
      })
    }
  },
  
  actions: {
    async fetchProducts(id) {
      const result = await layTatCaChiTietTheoSP(id)
      if(result.status === 200) {
        this.products = result.data
      }
    },
    
    setOpenModal(value) {
      this.openModalCTSP = value
    },
    
    formatPrice(value) {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      }).format(value)
    }
  }
})