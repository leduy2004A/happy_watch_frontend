import { defineStore } from 'pinia';
import { getHoaDonTheoMa } from '@/axios/quanlihoadon';
import { huyHoaDon } from '@/axios/hoadon';
import router from '@/router/router';
import { useToast } from 'vue-toastification';
const toast = useToast()
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
     const result = await huyHoaDon(router.currentRoute.value.query.id)
     if(result.status === 200)
      {
        toast.success("Huỷ hoá đơn thành công")
      }
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