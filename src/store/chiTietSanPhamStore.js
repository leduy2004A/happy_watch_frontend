import { defineStore } from "pinia";
import { layChiTietSanPham, layChiTietSanPhamCungLoai } from "@/axios/chitietsanpham";

export const useChiTietSanPhamStore = defineStore("chiTietSanPham", {
  state: () => ({
    chiTietSanPham: {},
    lstSanPhamCungLoai: {
      chiTietSanPhamList: []
    }
  }),
  
  actions: {
    async fetchChiTietSanPham(ctspID) {
      try {
        const data = await layChiTietSanPham(ctspID)
        this.chiTietSanPham = data.data
      } catch (error) {
        console.error('Error fetching product details:', error)
        throw error
      }
    },
    
    async fetchChiTietSanPhamCungLoai(ctspID) {
      try {
        const data = await layChiTietSanPhamCungLoai(ctspID)
        this.lstSanPhamCungLoai = data.data
      } catch (error) {
        console.error('Error fetching related products:', error)
        throw error
      }
    },
    
    resetState() {
      this.chiTietSanPham = {}
      this.lstSanPhamCungLoai = {
        chiTietSanPhamList: []
      }
    }
  }
});