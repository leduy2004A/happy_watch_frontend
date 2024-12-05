import { defineStore } from 'pinia'
import { layChiTietSanPhamTuIdCTSP } from '@/axios/sanpham'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: JSON.parse(localStorage.getItem('cart-items')) || []
  }),
  
  getters: {
    cartItemCount: (state) => state.items.length,
    
    cartTotal: (state) => {
      return state.items.reduce((total, item) => total + (item.price * item.quantity), 0)
    },

    isInCart: (state) => (productId) => {
      return state.items.some(item => item.id === productId)
    }
  },
  
  actions: {
    async syncCartItemWithDB(itemId) {
      try {
        const updatedProduct = await layChiTietSanPhamTuIdCTSP(itemId)
        const cartItem = this.items.find(item => item.id === itemId)
        if (cartItem && updatedProduct) {
          cartItem.price = updatedProduct.price
          cartItem.name = updatedProduct.name
          cartItem.image = updatedProduct.image
          cartItem.canNang = updatedProduct.canNang * cartItem.quantity
          cartItem.code = updatedProduct.code
          await this.saveToLocalStorage()
        }
        return updatedProduct
      } catch (error) {
        console.error('Error syncing with DB:', error)
        return null
      }
    },

    async syncAllCartItems() {
      try {
        const promises = this.items.map(item => this.syncCartItemWithDB(item.id))
        await Promise.all(promises)
      } catch (error) {
        console.error('Error syncing all items:', error)
      }
    },

    async addToCart(product) {
      try {
        // Lấy thông tin mới nhất từ DB trước khi thêm vào giỏ
        const updatedProduct = await layChiTietSanPhamTuIdCTSP(product.id)
        if (!updatedProduct) return

        const existingItem = this.items.find(item => item.id === updatedProduct.id)
        if (existingItem) {
          existingItem.quantity++
          existingItem.price = updatedProduct.price
          existingItem.canNang = existingItem.quantity * updatedProduct.canNang
          existingItem.name = updatedProduct.name
          existingItem.image = updatedProduct.image
          existingItem.code = updatedProduct.code
        } else {
          this.items.push({
            id: updatedProduct.id,
            name: updatedProduct.name,
            price: updatedProduct.price,
            image: updatedProduct.image,
            canNang: updatedProduct.canNang,
            code: updatedProduct.code,
            quantity: 1
          })
        }
        await this.saveToLocalStorage()
      } catch (error) {
        console.error('Error adding to cart:', error)
      }
    },
    
    async removeFromCart(itemId) {
      try {
        this.items = this.items.filter(item => item.id !== itemId)
        await this.saveToLocalStorage()
      } catch (error) {
        console.error('Error removing from cart:', error)
      }
    },
    
    async updateQuantity(itemId, quantity) {
      try {
        // Sync với DB trước khi cập nhật số lượng
        const updatedProduct = await this.syncCartItemWithDB(itemId)
        if (!updatedProduct) return

        const item = this.items.find(item => item.id === itemId)
        if (item) {
          if (quantity > 0) {
            item.quantity = quantity
            item.canNang = quantity * updatedProduct.canNang
          } else {
            await this.removeFromCart(itemId)
            return
          }
          await this.saveToLocalStorage()
        }
      } catch (error) {
        console.error('Error updating quantity:', error)
      }
    },

    async clearCart() {
      try {
        this.items = []
        await this.saveToLocalStorage()
      } catch (error) {
        console.error('Error clearing cart:', error)
      }
    },

    async saveToLocalStorage() {
      try {
        localStorage.setItem('cart-items', JSON.stringify(this.items))
      } catch (error) {
        console.error('Error saving to localStorage:', error)
      }
    },

    async loadFromLocalStorage() {
      try {
        const savedItems = localStorage.getItem('cart-items')
        if (savedItems) {
          this.items = JSON.parse(savedItems)
          // Sync tất cả items với DB khi load từ localStorage
          await this.syncAllCartItems()
        }
      } catch (error) {
        console.error('Error loading from localStorage:', error)
      }
    }
  }
})