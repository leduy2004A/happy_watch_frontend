import { defineStore } from 'pinia'
import { ref } from 'vue'
import { laySanPhamCuaHang } from '@/axios/sanpham'

export const sanPhamCuaHangStore = defineStore('sanPhamCuaHangStore', {
  // STATE
  state: () => ({
    products: [], // Danh sách sản phẩm
    isLoading: false, // Trạng thái đang tải
    noMoreContent: false, // Cờ kiểm tra còn dữ liệu để tải
    page: 1, // Trang hiện tại
    itemsPerPage: 12, // Số lượng sản phẩm mỗi trang
    layoutType: 'grid' // Kiểu bố cục hiển thị (grid hoặc list)
  }),

  // GETTERS
  getters: {
    gridClasses(state) {
      return {
        'grid-layout': state.layoutType === 'grid',
        'list-layout': state.layoutType === 'list'
      }
    }
  },

  // ACTIONS
  actions: {
    // Định dạng giá theo tiền tệ Việt Nam
    formatPrice(price) {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(price)
    },

    // Tính phần trăm giảm giá giữa giá gốc và giá mới
    calculateDiscount(oldPrice, newPrice) {
      return Math.round(((oldPrice - newPrice) / oldPrice) * 100)
    },

    // Tải danh sách sản phẩm từ server
    async fetchProducts(pageNum, limit) {
      try {
        this.isLoading = true
        const response = await laySanPhamCuaHang(pageNum - 1, limit)
        
        if (!response.data.content || response.data.content.length === 0) {
          this.noMoreContent = true
          return []
        }

        // Định dạng sản phẩm
        return response.data.content.map(item => ({
          id: item.id,
          name: item.ten,
          oldPrice: item.gia,
          price: item.giaSauGiam,
          discount: this.calculateDiscount(item.gia, item.giaSauGiam),
          image: item.hinhAnhDauTien,
          image2:item.hinhAnhThuHai,
          secondImage: item.hinhAnhThuHai,
          soLuong:item.soLuong,
          canNang:item.canNang,
          code: item.ma
        }))
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu sản phẩm:", error)
        return []
      } finally {
        this.isLoading = false
      }
    },

    // Tải thêm sản phẩm và cập nhật danh sách
    async loadMoreProducts() {
      if (this.isLoading || this.noMoreContent) return

      try {
        const newProducts = await this.fetchProducts(this.page, this.itemsPerPage)
        if (newProducts.length === 0) {
          this.noMoreContent = true
        } else {
          this.products.push(...newProducts)
          this.page++
        }
      } catch (error) {
        console.error('Error loading products:', error)
      }
    },

    // Đặt lại danh sách và tải lại từ đầu
    resetAndReload() {
      this.products = []
      this.page = 1
      this.noMoreContent = false
      this.loadMoreProducts()
    },

    // Chuyển đổi kiểu bố cục hiển thị
    toggleLayout() {
      this.layoutType = this.layoutType === 'grid' ? 'list' : 'grid'
    },

    // Cập nhật số sản phẩm mỗi trang và tải lại
    setItemsPerPage(value) {
      this.itemsPerPage = value
      this.resetAndReload()
    }
  }
})
