import { defineStore } from "pinia";
import { layChiTietSanPhamTuIdCTSP } from "@/axios/sanpham";
export const useCartStore = defineStore("cart", {
  state: () => ({
    items: JSON.parse(localStorage.getItem("cart-items")) || [],
  }),

  getters: {
    cartItemCount: (state) => state.items.length,

    cartTotal: (state) => {
      return state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    },

    isInCart: (state) => (productId) => {
      return state.items.some((item) => item.id === productId);
    },
  },

  actions: {
    addToCart(product) {
      const existingItem = this.items.find((item) => item.id === product.id);
      if (existingItem) {
        existingItem.quantity++;
        existingItem.canNang = product.canNang * existingItem.quantity; // Sử dụng cân nặng gốc
      } else {
        this.items.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          canNangGoc: product.canNang, // Lưu cân nặng gốc
          canNang: product.canNang,
          code: product.code,
  
          quantity: 1,
        });
      }
      this.saveToLocalStorage();
      this.loadFromLocalStorage();
    },

    updateQuantity(itemId, quantity) {
      const item = this.items.find((item) => item.id === itemId);
      if (item) {
        if (quantity > 0) {
          item.quantity = quantity;
          item.canNang = item.canNangGoc * quantity; // Tính lại cân nặng dựa trên cân nặng gốc
        } else {
          this.removeFromCart(itemId);
        }
        this.saveToLocalStorage();
      }
    },

    async loadFromLocalStorage() {
      let savedItems = localStorage.getItem("cart-items");
      if (savedItems) {
        const result = await Promise.all(
          this.items.map(async (item) => {
            const response = await layChiTietSanPhamTuIdCTSP(item.id);
            console.log(response)
            return {
              id: response.data.id,
              name: response.data.ten,


              
       
              gioiTinh:response.data.gioiTinh,
              loaiKinh:response.data.loaiKinh,
              chatLieuVo:response.data.chatLieuVo,
              loaiMay:response.data.loaiMay,
              chatLieuDay:response.data.chatLieuDay,


              price: response.data.giaSauGiam,
              image: response.data.hinhAnhDauTien,
              canNangGoc: response.data.canNang, // Lưu cân nặng gốc
              canNang: response.data.canNang * item.quantity,
              code: item.ma,
              quantity: item.quantity,
            };
          })
        );
        localStorage.setItem("cart-items", JSON.stringify(result));
        savedItems = localStorage.getItem("cart-items");
        this.items = JSON.parse(savedItems);
      }
    },

    removeFromCart(itemId) {
      this.items = this.items.filter((item) => item.id !== itemId);
      this.saveToLocalStorage();
    },

    clearCart() {
      this.items = [];
      this.saveToLocalStorage();
    },

    saveToLocalStorage() {
      localStorage.setItem("cart-items", JSON.stringify(this.items));
    },
  },
});