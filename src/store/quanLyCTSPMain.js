// stores/chiTietSanPhamStore.js
import { defineStore } from 'pinia'
import { layTatCaChiTietTheoSP } from '@/axios/sanpham'
import {getComBoBoxThuongHieu,getComBoBoxMauSac,getComBoBoxHinhDang,getComBoBoxLoaiMay,getComBoBoxChatLieuVo,getComBoBoxChatLieuDay,getComBoBoxLoaiKinh } from '@/axios/combobox'
export const quanLyCTSPMAIN = defineStore('quanLyCTSPMAIN', {
  state: () => ({
    products: [],
    search: '',
    priceRange: [0, 100000000],
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
      thuongHieu: { label: 'Thương hiệu', options: ['Tất cả', 'Đỏ', 'Xanh', 'Đen'] },
      mauSac: { label: 'Màu sắc', options: ['Tất cả', 'Đỏ', 'Xanh', 'Đen'] },
      hinhDang: { label: 'Hình dáng', options: ['Tất cả', 'Automatic', 'Quartz', 'Chronograph'] },
      loaiMay: { label: 'Loại máy', options: ['Tất cả', 'Automatic', 'Quartz', 'Chronograph'] },
      chatLieuVo: { label: 'Chất liệu vỏ', options: ['Tất cả', 'Thép không gỉ', 'Nhôm', 'Nhựa'] },
      chatLieuDay: { label: 'Chất liệu dây', options: ['Tất cả', 'Da', 'Thép', 'Vải'] },
      loaiKinh: { label: 'Loại kính', options: ['Tất cả', 'Da', 'Thép', 'Vải'] },
    }
  }),
  
  getters: {
    filteredProducts: (state) => {
      return state.products.filter(product => {
        const searchLower = state.search.toLowerCase()
        const matchesSearch = product.sanPham.toLowerCase().includes(searchLower) ||
                            product.ma.toLowerCase().includes(searchLower)
        const matchesPrice = product.gia >= state.priceRange[0] &&
          product.gia <= state.priceRange[1]

        const matchesFilters = Object.entries(state.filters).every(([key, value]) => {
          return !value || value === 'Tất cả' || product[key] === value
        })

        return matchesPrice && matchesFilters && matchesSearch
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
    async getComBoBox(){
      try {
        const data = await Promise.all([(await getComBoBoxThuongHieu()).data, (await getComBoBoxMauSac()).data, (await getComBoBoxHinhDang()).data,(await getComBoBoxLoaiMay()).data,(await getComBoBoxChatLieuVo()).data,(await getComBoBoxChatLieuDay()).data,(await getComBoBoxLoaiKinh()).data ])
        this.filterOptions.thuongHieu.options = data[0]
        this.filterOptions.thuongHieu.options.unshift('Tất cả')
        this.filterOptions.mauSac.options = data[1]
        this.filterOptions.mauSac.options.unshift('Tất cả')
        this.filterOptions.hinhDang.options= data[2]
        this.filterOptions.hinhDang.options.unshift('Tất cả')
        this.filterOptions.loaiMay.options = data[3]
        this.filterOptions.loaiMay.options.unshift('Tất cả')
        this.filterOptions.chatLieuVo.options = data[4]
        this.filterOptions.chatLieuVo.options.unshift('Tất cả')
        this.filterOptions.chatLieuDay.options = data[5]
        this.filterOptions.chatLieuDay.options.unshift('Tất cả')
        this.filterOptions.loaiKinh.options = data[6]
        this.filterOptions.loaiKinh.options.unshift('Tất cả')
        // this.filters[7].items = data[7]
        // this.filters[7].items.unshift('Tất cả')
       
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    },
    formatPrice(value) {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      }).format(value)
    }
  }
})