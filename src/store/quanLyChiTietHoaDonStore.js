import { defineStore } from 'pinia';
import { getHoaDonTheoMa } from '@/axios/quanlihoadon';

export const quanLyChiTietHoaDon = defineStore('ChiTietHoaDon ', {
  state: () => ({
    orderDetail: {},
    isLoading: true,
    error: null
  }),

  actions: {
    async fetchOrderDetail(orderId) {
      try {
        this.isLoading = true;
        const response = await getHoaDonTheoMa(orderId);
        if (response.status === 200) {
          this.orderDetail = response.data;
        }
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
        this.error = error;
      } finally {
        this.isLoading = false;
      }
    },

    async confirmDelivery() {
      // Xử lý xác nhận giao hàng
      console.log("Xác nhận giao hàng");
    },

    async cancelOrder() {
      // Xử lý hủy đơn hàng
      console.log("Hủy đơn hàng"); 
    },

    async updateOrder() {
      // Cập nhật đơn hàng
      console.log("Cập nhật đơn hàng");
    }
  },

  getters: {
    hasOrderData: (state) => !!state.orderDetail.maHoaDon
  }
});