// stores/productStore.js
import { defineStore } from 'pinia'
import { addSanPham, addThuongHieu, layTatCaGioiTinh, layTatCaThuongHieu, addGioiTinh,updateSanPham } from '@/axios/sanpham'

export const useQLSPStore = defineStore('QLSPStore', {
  state: () => ({
    maSanPham:'',
    productName: '',
    product: {
      category: 'Giày cao cổ',
      brand: 'Converse',
      description: ''
    },
    categories: [],
    brands: [],
    productSuggestions: [
      "Puma 2023",
      "Converse Venom", 
      "Rebound Puma V6",
      "Nike Dunk 2022",
      "Balen Grey 2023",
      "Sneakers unisex cổ cao"
    ],
    searchTexts: {
      category: '',
      brand: ''
    },
    filteredProducts: [],
    showSuggestions: false
  }),

  getters: {
    showAddButton: (state) => ({
      category: state.searchTexts.category && 
        !state.categories.some(cat => cat.ten.toLowerCase() === state.searchTexts.category.toLowerCase()),
      brand: state.searchTexts.brand &&
        !state.brands.some(brand => brand.ten.toLowerCase() === state.searchTexts.brand.toLowerCase())
    })
  },

  actions: {
    async fetchInitialData() {
      const [gioiTinhRes, thuongHieuRes] = await Promise.all([
        layTatCaGioiTinh(),
        layTatCaThuongHieu()
      ])

      if (gioiTinhRes.status === 200) {
        this.categories = gioiTinhRes.data
        if (this.categories.length > 0) {
          this.product.category = this.categories[0]
        }
      }

      if (thuongHieuRes.status === 200) {
        this.brands = thuongHieuRes.data
        if (this.brands.length > 0) {
          this.product.brand = this.brands[0]
        }
      }
    },

    async addNewItem(field) {
      const newValue = this.searchTexts[field]
      
      if (!newValue) return

      if (field === 'category') {
        const result = await addGioiTinh({ ten: newValue })
        if (result.status === 200) {
          this.categories.push(result.data)
          this.product.category = result.data
          this.searchTexts.category = ''
          return result
        }
      }

      if (field === 'brand') {
        const result = await addThuongHieu({ ten: newValue })
        if (result.status === 200) {
          this.brands.push(result.data)
          this.product.brand = result.data
          this.searchTexts.brand = ''
          return result
        }
      }
    },

    async saveProduct() {
      
      try {
        const brandId = typeof this.product.brand === 'object' 
          ? this.product.brand.id 
          : this.brands.find(b => b.ten === this.product.brand)?.id
    
        const categoryId = typeof this.product.category === 'object'
          ? this.product.category.id
          : this.categories.find(c => c.ten === this.product.category)?.id
    
        if (!brandId) {
          throw new Error('Không tìm thấy thông tin thương hiệu')
        }
    
        if (!categoryId) {
          throw new Error('Không tìm thấy thông tin giới tính')
        }
    
        const dataSanPham = {
          ten: this.productName,
          thuongHieu: {
            id: brandId
          },
          ma:this.maSanPham,
          trangThai:'Đang kinh doanh',
          moTa: this.product.description,
          gioiTinh: {
            id: categoryId
          }
        }
    
        return await addSanPham(dataSanPham)
      } catch (error) {
        console.error('Lỗi khi thêm sản phẩm', error)
        throw error
      }
    },
    async updateProduct(idSanPham) {
      try {
        const brandId = typeof this.product.brand === 'object' 
          ? this.product.brand.id 
          : this.brands.find(b => b.ten === this.product.brand)?.id
    
        const categoryId = typeof this.product.category === 'object'
          ? this.product.category.id
          : this.categories.find(c => c.ten === this.product.category)?.id
    
        if (!brandId) {
          throw new Error('Không tìm thấy thông tin thương hiệu')
        }
    
        if (!categoryId) {
          throw new Error('Không tìm thấy thông tin giới tính')
        }
    
        const dataSanPham = {
          ten: this.productName,
          ma:this.maSanPham,
          thuongHieu: {
            id: brandId
          },
          moTa: this.product.description,
          gioiTinh: {
            id: categoryId
          }
        }
    
        return await updateSanPham(idSanPham, dataSanPham)
      } catch (error) {
        console.error('Lỗi khi cập nhật sản phẩm:', error)
        throw error
      }
    },
    filterSuggestions() {
      if (!this.productName) {
        this.showSuggestions = false
        return
      }

      this.filteredProducts = this.productSuggestions.filter(product =>
        product.toLowerCase().includes(this.productName.toLowerCase())
      )
      this.showSuggestions = true
    },

    selectProduct(product) {
      this.productName = product
      this.showSuggestions = false
    }
  }
})