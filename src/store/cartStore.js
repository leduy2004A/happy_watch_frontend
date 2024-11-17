// stores/cartStore.js
import { defineStore } from 'pinia'

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
    addToCart(product) {
      console.log(product)
      const existingItem = this.items.find(item => item.id === product.id)
      if (existingItem) {
        existingItem.quantity++
        existingItem.canNang = existingItem.quantity * existingItem.canNang
        console.log(existingItem)
      } else {
        this.items.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          canNang:product.canNang,
          code:product.code,
          quantity: 1
        })
        
      }
      this.saveToLocalStorage()
    },
    
    removeFromCart(itemId) {
      this.items = this.items.filter(item => item.id !== itemId)
      this.saveToLocalStorage()
    },
    
    updateQuantity(itemId, quantity) {
      const item = this.items.find(item => item.id === itemId)
      if (item) {
        if (quantity > 0) {
          item.quantity = quantity
        } else {
          this.removeFromCart(itemId)
        }
        this.saveToLocalStorage()
      }
    },

    clearCart() {
      this.items = []
      this.saveToLocalStorage()
    },

    saveToLocalStorage() {
      localStorage.setItem('cart-items', JSON.stringify(this.items))
    },

    loadFromLocalStorage() {
      const savedItems = localStorage.getItem('cart-items')
      if (savedItems) {
        this.items = JSON.parse(savedItems)
      }
    }
  }
})