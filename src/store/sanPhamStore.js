// stores/productStore.js
import { defineStore } from 'pinia'
import { laySanPham } from '@/axios/sanpham'

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [],
    searchQuery: '',
    priceRange: [100000, 3200000],
    filters: [
      { label: 'Danh mục', value: 'Tất cả', items: ['Tất cả', 'Giày cao cổ', 'Giày thể thao'] },
      { label: 'Màu sắc', value: 'Tất cả', items: ['Tất cả', 'Xanh dương', 'Tím'] },
      { label: 'Chất liệu', value: 'Tất cả', items: ['Tất cả', 'Đế sắt', 'Đế nhựa'] },
      { label: 'Kích cỡ', value: 'Tất cả', items: ['Tất cả', '40', '41'] },
      { label: 'Đế giày', value: 'Tất cả', items: ['Tất cả', 'Đế sắt', 'Đế nhựa'] },
      { label: 'Thương hiệu', value: 'Tất cả', items: ['Tất cả', 'Converse', 'Nike'] },
    ]
  }),

  getters: {
    filteredProducts: (state) => {
      return state.products.filter(item => {
        // Lọc theo search query
        const searchLower = state.searchQuery.toLowerCase()
        const matchesSearch = Object.values(item).some(value => 
          String(value).toLowerCase().includes(searchLower)
        )

        // Lọc theo khoảng giá
        const matchesPrice = item.gia >= state.priceRange[0] && 
                           item.gia <= state.priceRange[1]

        return matchesSearch && matchesPrice
      })
    }
  },

  actions: {
    async fetchProducts() {
      try {
        const response = await laySanPham()
        this.products = response.data

      } catch (error) {
        console.error('Error fetching products:', error)
      }
    },

    setSearchQuery(query) {
      this.searchQuery = query
    },

    setPriceRange(range) {
      this.priceRange = range
    }
  }
})