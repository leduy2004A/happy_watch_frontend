import { defineStore } from "pinia";
import { getPhiShip } from "@/axios/giaohangnhanh";
export const useCheckOutStore = defineStore("checkout", {
  state: () => ({
    products: [],
    shippingFee: 0,
    tongCanNang: 0,
  }),
  actions: {
    addProduct(product) {
      this.products = product;
    },
    async calculateShippingFee(districtId, wardCode, weight) {
      try {
        const dataShip = {
          district: districtId,
          ward: wardCode,
          weight: weight,
          name: "Đồng hồ",
        };
        const result = await getPhiShip(dataShip);
        this.shippingFee = result.data.data.total;
      } catch (error) {
        console.error("Error calculating shipping fee:", error);
      }
    },
    tinhTongTien() {
        const tongTienHang = this.products.reduce((total, item) => {
          return total + (item.soLuongChon * item.productGoc.price);
        }, 0);
        
        // Cộng phí ship vào sau khi đã tính tổng tiền hàng
        return tongTienHang + this.shippingFee;
      },
      tinhTongTienHang() {
        const tongTienHang = this.products.reduce((total, item) => {
          return total + (item.soLuongChon * item.productGoc.price);
        }, 0);
        
        // Cộng phí ship vào sau khi đã tính tổng tiền hàng
        return tongTienHang;
      }
  },
});
