import { defineStore } from 'pinia'
import { ref } from 'vue'
import { laySanPhamCuaHang } from '@/axios/sanpham'

export const sanPhamCuaHangStore = defineStore('sanPhamCuaHangStore', {
  state: () => ({
    products: [],
    isLoading: false,
    currentPage: 1,
    itemsPerPage: 6,
    layoutType: 'grid',
    totalItems: 0
  }),

  getters: {
    gridClasses(state) {
      return {
        'grid-layout': state.layoutType === 'grid',
        'list-layout': state.layoutType === 'list'
      }
    },
    
    totalPages(state) {
      return Math.ceil(state.totalItems / state.itemsPerPage)
    }
  },

  actions: {
    formatPrice(price) {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(price)
    },

    calculateDiscount(oldPrice, newPrice) {
      return Math.round(((oldPrice - newPrice) / oldPrice) * 100)
    },

    async fetchProducts(page, limit) {
      try {
        this.isLoading = true
        const response = await laySanPhamCuaHang(page - 1, limit)
        
        if (!response.data.content) {
          return {
            products: [],
            total: 0
          }
        }

        const formattedProducts = response.data.content.map(item => ({
          id: item.id,
          name: item.ten,
          oldPrice: item.gia,
          price: item.giaSauGiam,
          discount: this.calculateDiscount(item.gia, item.giaSauGiam),
          image: item.hinhAnhDauTien,
          image2: item.hinhAnhThuHai,
          secondImage: item.hinhAnhThuHai,
          soLuong: item.soLuong,
          canNang: item.canNang,
          code: item.ma
        }))

        return {
          products: formattedProducts,
          total: response.data.totalElements // Giả sử API trả về tổng số sản phẩm
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu sản phẩm:", error)
        return {
          products: [],
          total: 0
        }
      } finally {
        this.isLoading = false
      }
    },

    async loadProducts() {
      const result = await this.fetchProducts(this.currentPage, this.itemsPerPage)
      this.products = result.products
      this.totalItems = result.total
    },

    async handlePageChange(newPage) {
      this.currentPage = newPage
      await this.loadProducts()
    },

    toggleLayout() {
      this.layoutType = this.layoutType === 'grid' ? 'list' : 'grid'
    },

    async setItemsPerPage(value) {
      this.itemsPerPage = value
      this.currentPage = 1 // Reset về trang đầu tiên
      await this.loadProducts()
    }
  }
})