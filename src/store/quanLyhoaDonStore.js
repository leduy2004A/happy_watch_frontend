// stores/invoice.js
import { defineStore } from 'pinia'
import { getAllHoaDon } from '@/axios/quanlihoadon';
import { useToast } from 'vue-toastification';
const toast = useToast()
export const quanLyHoaDonStore = defineStore('QLHoaDon', {
  state: () => ({
    invoices: [
    ],
    activeTab: 'all',
    page: 1,
    itemsPerPage: 5,
    statusMap: {
      cancelled: "Đã Hủy",
      pending: "Chờ xác nhận",
      waiting: "Chờ giao hàng",
      shipping: "Đang vận chuyển",
      delivered: "Đã giao hàng",
      paid: "Đã thanh toán",
      pending_payment: "Chờ thanh toán",
      completed: "Hoàn thành"
    },
    statusColorMap: {
      "Chờ xác nhận": "warning",
      "Hoàn thành": "pink",
      "Chờ giao hàng": "warning",
      "Đã hủy": "error",
      "Đang giao hàng": "info",
      "Đã giao": "success",
      "Đã thanh toán": "green",
      "Chờ thanh toán": "orange",
      "Đã xác nhận": "orange",
    }
  }),

  getters: {
    filteredInvoices: (state) => {
      if (state.activeTab === 'all') {
        return state.invoices;
      }
      else if(state.activeTab === 'cancelled') {
        console.log(state.statusMap['cancelled']);  // Kiểm tra giá trị trong statusMap
        return state.invoices.filter(invoice => {
          return invoice.trangThai === state.statusMap['cancelled']; // So sánh với giá trị trong statusMap
        });
      }
      else if(state.activeTab === 'pending') {  // Kiểm tra giá trị trong statusMap
        return state.invoices.filter(invoice => {
          console.log(invoice)
          return invoice.trangThai === 'Đang chờ xác nhận'; // So sánh với giá trị trong statusMap
        });
      }
      else if(state.activeTab === 'waiting') {  // Kiểm tra giá trị trong statusMap
        return state.invoices.filter(invoice => {
          console.log(invoice)
          return invoice.trangThai === 'Chờ giao hàng'; // So sánh với giá trị trong statusMap
        });
      }
      else if(state.activeTab === 'shipping') {  // Kiểm tra giá trị trong statusMap
        return state.invoices.filter(invoice => {
          console.log(invoice)
          return invoice.trangThai === 'Đang giao hàng'; // So sánh với giá trị trong statusMap
        });
      }
      else if(state.activeTab === 'delivered') {  // Kiểm tra giá trị trong statusMap
        return state.invoices.filter(invoice => {
          console.log(invoice)
          return invoice.trangThai === 'Đã giao'; // So sánh với giá trị trong statusMap
        });
      }
      else if(state.activeTab === 'paid') {  // Kiểm tra giá trị trong statusMap
        return state.invoices.filter(invoice => {
          console.log(invoice)
          return invoice.trangThai === 'Đã thanh toán'; // So sánh với giá trị trong statusMap
        });
      }
      else if(state.activeTab === 'completed') {  // Kiểm tra giá trị trong statusMap
        return state.invoices.filter(invoice => {
          console.log(invoice)
          return invoice.trangThai === 'Hoàn thành'; // So sánh với giá trị trong statusMap
        });
      }
      else if(state.activeTab === 'confirmed') {  // Kiểm tra giá trị trong statusMap
        return state.invoices.filter(invoice => {
          console.log(invoice)
          return invoice.trangThai === 'Đã xác nhận'; // So sánh với giá trị trong statusMap
        });
      }
      return state.invoices.filter(invoice => 
        invoice.status === state.statusMap[state.activeTab]
      );
    },

    totalPages: (state) => {
      return Math.max(1, Math.ceil(state.filteredInvoices.length / state.itemsPerPage));
    },

    paginatedInvoices: (state) => {
      const startIndex = (state.page - 1) * state.itemsPerPage;
      const endIndex = startIndex + state.itemsPerPage;
      return state.filteredInvoices.slice(startIndex, endIndex);
    }
  },

  actions: {
    setActiveTab(tab) {
      this.activeTab = tab;
      this.page = 1;
    },

    setPage(newPage) {
      this.page = newPage;
    },

    setItemsPerPage(newItemsPerPage) {
      this.itemsPerPage = newItemsPerPage;
      this.page = 1;
    },

    formatCurrency(value) {
      return new Intl.NumberFormat("vi-VN").format(value) + " đ";
    },

    getStatusColor(status) {
      return this.statusColorMap[status] || "grey";
    },

    calculateIndex(invoice) {
      const index = this.filteredInvoices.indexOf(invoice);
      return index + 1 + (this.page - 1) * this.itemsPerPage;
    },

    viewDetail(id) {
      console.log("View detail:", id);
    },
    setLoading(status) {
      this.isLoading = status;
    },

    // Thêm action để set error
    setError(error) {
      this.error = error;
    },

    // Action fetch data với xử lý loading và error
    async fetchData() {
      this.setLoading(true);
      this.setError(null);
      
      try {
        const response = await getAllHoaDon();
        this.invoices = response.data;
        console.log(this.invoices)
        return response.data; // Trả về data nếu cần sử dụng
      } catch (error) {
        const errorMessage = error.response?.data?.message || "Có lỗi xảy ra khi tải dữ liệu";
        toast.error(errorMessage);
        this.setError(errorMessage);
        throw error; // Ném lỗi để component có thể bắt và xử lý nếu cần
      } finally {
        this.setLoading(false);
      }
    },

    // Refresh data - hữu ích cho việc làm mới dữ liệu
    async refreshData() {
      await this.fetchData();
    },
  }
})