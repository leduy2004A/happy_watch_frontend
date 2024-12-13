// stores/productStore.js
import { defineStore } from 'pinia'
import { laySanPham } from '@/axios/sanpham'
import {getComBoBoxThuongHieu,getComBoBoxMauSac,getComBoBoxHinhDang,getComBoBoxLoaiMay,getComBoBoxChatLieuVo,getComBoBoxChatLieuDay,getComBoBoxLoaiKinh } from '@/axios/combobox'
export const useProductStore = defineStore('product', {
  state: () => ({
    products: [],
    searchQuery: '',
    priceRange: [0, 13200000],
    filters: [
      { 
        label: 'Thương hiệu', 
        value: 'Tất cả', 
        key: 'thuongHieu',
        items: ['Tất cả', 'Giày cao cổ', 'Giày thể thao'] 
      },
      { 
        label: 'Màu sắc', 
        value: 'Tất cả', 
        key: 'tenMauSac',
        items: ['Tất cả', 'Xanh dương', 'Tím'] 
      },
      { 
        label: 'Hình dáng', 
        value: 'Tất cả', 
        key: 'hinhDang',
        items: ['Tất cả', 'Đế sắt', 'Đế nhựa'] 
      },
      { 
        label: 'Loại máy', 
        value: 'Tất cả', 
        key: 'loaiMay',
        items: ['Tất cả', '40', '41'] 
      },
      { 
        label: 'Chất liệu vỏ', 
        value: 'Tất cả', 
        key: 'chatLieuVo',
        items: ['Tất cả', 'Đế sắt', 'Đế nhựa'] 
      },
      { 
        label: 'Chất liệu dây', 
        value: 'Tất cả', 
        key: 'chatLieuDay',
        items: ['Tất cả', 'Converse', 'Nike'] 
      },
      { 
        label: 'Loại kính', 
        value: 'Tất cả', 
        key: 'loaiKinh',
        items: ['Tất cả', 'Converse', 'Nike'] 
      },
    ]
  }),

  getters: {
    filteredProducts: (state) => {
      return state.products.filter(product => {
        // Lọc theo search query
        const searchLower = state.searchQuery.toLowerCase()
        const matchesSearch = product.tenSanPham.toLowerCase().includes(searchLower) ||
                            product.maSanPham.toLowerCase().includes(searchLower)

        // Lọc theo khoảng giá
        const matchesPrice = product.gia >= state.priceRange[0] && 
                           product.gia <= state.priceRange[1]

        // Lọc theo các bộ lọc khác
        const matchesFilters = state.filters.every(filter => {
          if (filter.value === 'Tất cả') return true
          return product[filter.key] === filter.value
        })

        return matchesSearch && matchesPrice && matchesFilters
      })
    }
  },

  actions: {
    async fetchProducts() {
      try {
        const response = await laySanPham()
        this.products = response.data
        console.log(this.products)
        // Cập nhật danh sách items cho mỗi filter dựa trên dữ liệu thực tế
        this.updateFilterItems()
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    },
    async getComBoBox(){
      try {
        const data = await Promise.all([(await getComBoBoxThuongHieu()).data, (await getComBoBoxMauSac()).data, (await getComBoBoxHinhDang()).data,(await getComBoBoxLoaiMay()).data,(await getComBoBoxChatLieuVo()).data,(await getComBoBoxChatLieuDay()).data,(await getComBoBoxLoaiKinh()).data ])
        this.filters[0].items = data[0]
        this.filters[0].items.unshift('Tất cả')
        this.filters[1].items = data[1]
        this.filters[1].items.unshift('Tất cả')
        this.filters[2].items = data[2]
        this.filters[2].items.unshift('Tất cả')
        this.filters[3].items = data[3]
        this.filters[3].items.unshift('Tất cả')
        this.filters[4].items = data[4]
        this.filters[4].items.unshift('Tất cả')
        this.filters[5].items = data[5]
        this.filters[5].items.unshift('Tất cả')
        this.filters[6].items = data[6]
        this.filters[6].items.unshift('Tất cả')
        // this.filters[7].items = data[7]
        // this.filters[7].items.unshift('Tất cả')
       
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    },
    deleteBoLoc() {
      // Reset giá trị value của mỗi filter về "Tất cả"
      this.filters.forEach(filter => {
        filter.value = 'Tất cả'
      })
      
      // Reset khoảng giá về mặc định
      this.priceRange = [100000, 3200000]
      
      // Reset search query
      this.searchQuery = ''
    },
    updateFilterItems() {
      this.filters = this.filters.map(filter => {
        if (filter.value === 'Tất cả') {
          // Lấy danh sách giá trị duy nhất cho mỗi thuộc tính
          const uniqueValues = ['Tất cả', ...new Set(
            this.products.map(product => product[filter.key]).filter(Boolean)
          )]
          return {
            ...filter,
            items: uniqueValues
          }
        }
        return filter
      })
    },

    setSearchQuery(query) {
      this.searchQuery = query
    },

    setPriceRange(range) {
      this.priceRange = range
    },

    setFilter(filterLabel, value) {
      const filterIndex = this.filters.findIndex(f => f.label === filterLabel)
      if (filterIndex !== -1) {
        this.filters[filterIndex].value = value
      }
    }
  }
})