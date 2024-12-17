import { defineStore } from 'pinia'
import { laySanPhamKemSoLuong } from '@/axios/sanpham'

export const useDanhSachSP = defineStore('DanhSachSP', {
  state: () => ({
    products: [],
    loading: false,
    search: '',
    statusFilter: 'all'
  }),
  
  getters: {
    computedItems: (state) => {
      let filteredProducts = [...state.products]

      // Lọc theo search
      if (state.search.trim()) {
        const searchLower = state.search.toLowerCase().trim()
        filteredProducts = filteredProducts.filter(product => 
          product.ten.toLowerCase().includes(searchLower)
        )
      }

      // Lọc theo trạng thái
      if (state.statusFilter !== 'all') {
        filteredProducts = filteredProducts.filter(product => {
          if (state.statusFilter === 'selling') {
            return product.trangThai === 'Đang kinh doanh'
          } else if (state.statusFilter === 'stopped') {
            return product.trangThai === 'Ngừng kinh doanh'
          }
          return true
        })
      }

      // Thêm STT
      return filteredProducts.map((item, index) => ({
        ...item,
        stt: index + 1
      }))
    }
  },
  
  actions: {
    async fetchProducts() {
      try {
        this.loading = true
        const result = await laySanPhamKemSoLuong()
        if (result.status === 200) {
          this.products = result.data
          
        }
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        this.loading = false
      }
    },

    setSearch(value) {
      this.search = value
    },

    setStatusFilter(value) {
      this.statusFilter = value  
    }
  }
})