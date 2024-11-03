import { defineStore } from "pinia";
import { layChiTietSanPham,layChiTietSanPhamCungLoai } from "@/axios/chitietsanpham";
export const useChiTietSanPhamStore = defineStore("chiTietSanPham", {
  state: () => ({
    chiTietSanPham: {},
    lstSanPhamCungLoai:{},
    selectedIndex: 0
  }),
  actions:{
    async fetchChiTietSanPham(ctspID){
        const data = await layChiTietSanPham(ctspID)
        this.chiTietSanPham = data.data
    },
    async fetchChiTietSanPhamCungLoai(ctspID){
        const data = await layChiTietSanPhamCungLoai(ctspID)
        this.lstSanPhamCungLoai = data.data
    },
  }


})