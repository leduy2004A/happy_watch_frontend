// stores/paymentHistoryStore.js
import { defineStore } from 'pinia'
import { lichSuThanhToan } from "@/axios/hoadon"

export const usePaymentHistoryStore = defineStore('paymentHistory', {
  state: () => ({
    paymentData: [],
    search: "",
    modalThanhToan: false,
    headers: [
      { title: "Số tiền", align: "start", key: "soTien" },
      { title: "Thời gian", align: "start", key: "ngayThanhToan" },
      { title: "PTTT", align: "center", key: "phuongThuc" },
      { title: "Nhân viên xác nhận", align: "start", key: "nhanVien.ten" },
    ]
  }),

  actions: {
    async fetchPaymentHistory(ma) {
      try {
        const response = await lichSuThanhToan(ma)
        if (response.status === 200) {
          this.paymentData = [response.data]
        }
      } catch (error) {
        console.error('Error fetching payment history:', error)
      }
    },

    setModalThanhToan(value) {
      this.modalThanhToan = value
    },

    formatCurrency(value) {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(value)
    },

    formatDate(dateTime) {
      const date = new Date(dateTime)
      return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    },

    formattedTime(dateTime) {
      const date = new Date(dateTime)
      return date.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })
    },

    getTransactionTypeColor(type) {
      const colors = {
        "Thanh toán": "indigo lighten-4 indigo--text",
        "Hoàn tiền": "purple lighten-4 purple--text",
      }
      return colors[type] || "grey lighten-4 grey--text"
    },

    getPaymentMethodColor(method) {
      const colors = {
        "Tiền mặt": "orange lighten-4 orange--text",
        "Chuyển khoản": "blue lighten-4 blue--text",
      }
      return colors[method] || "grey lighten-4 grey--text"
    },

    getStatusColor(status) {
      const colors = {
        "Thành công": "green lighten-4 green--text",
        "Thất bại": "red lighten-4 red--text",
        "Đang xử lý": "amber lighten-4 amber--text",
      }
      return colors[status] || "grey lighten-4 grey--text"
    }
  }
})