import { defineStore } from 'pinia'
import { laySanPhamKemSoLuong } from '@/axios/sanpham'

export const useDanhSachSP = defineStore('DanhSachSP', {
  state: () => ({
    products: [],
    loading: false,
    search: '',
    statusFilter: 'stopped'
  }),
  
  getters: {
    computedItems: (state) => {
      return state.products.map((item, index) => ({
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