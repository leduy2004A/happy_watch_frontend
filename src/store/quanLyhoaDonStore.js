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
    },
    searchQuery: '',
    dateFrom: '',
    dateTo: '',
    invoiceType: 'all',
  }),

  getters: {
    filteredInvoices: (state) => {
      let filtered = [...state.invoices];
      console.log(filtered)
      // Lọc theo search query
      if (state.searchQuery) {
        filtered = filtered.filter(invoice => 
          invoice.maHoaDon.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
          invoice.tenKhachHang?.toLowerCase().includes(state.searchQuery.toLowerCase())

        );
      }

      // Lọc theo khoảng thời gian
      if (state.dateFrom && state.dateTo) {
        const fromDate = new Date(state.dateFrom);
        const toDate = new Date(state.dateTo);
        filtered = filtered.filter(invoice => {
          const invoiceDate = new Date(invoice.ngayTao);
          return invoiceDate >= fromDate && invoiceDate <= toDate;
        });
      }

      // Lọc theo loại hóa đơn
      console.log(state.invoiceType)
      if (state.invoiceType !== 'all') {
        filtered = filtered.filter(invoice => 
          invoice.loaiHoaDon.toLowerCase() === (state.invoiceType === 'online' ? 'trực tuyến'.toLowerCase() : 'tại quầy'.toLowerCase())
        );
  
      }

      // Lọc theo trạng thái tab
      if (state.activeTab !== 'all') {
        filtered = filtered.filter(invoice => {
          switch(state.activeTab) {
            case 'cancelled':
              return invoice.trangThai === 'Đã Hủy';
            case 'pending':
              return invoice.trangThai === 'Đang chờ xác nhận';
            case 'waiting':
              return invoice.trangThai === 'Chờ giao hàng';
            case 'shipping':
              return invoice.trangThai === 'Đang giao hàng';
            case 'delivered':
              return invoice.trangThai === 'Đã giao';
            case 'paid':
              return invoice.trangThai === 'Đã thanh toán';
            case 'completed':
              return invoice.trangThai === 'Hoàn thành';
            case 'confirmed':
              return invoice.trangThai === 'Đã xác nhận';
              case 'returned':
                return invoice.trangThai === 'Đã Hoàn Trả Hàng';
            default:
              return true;
          }
        });
      }

      return filtered;
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
     deleteBoLoc(){
      this.searchQuery = '',
      this.dateFrom= '',
      this.dateTo= '',
      this.invoiceType = 'all'
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
    setSearchQuery(query) {
      this.searchQuery = query;
      this.page = 1;
    },

    setDateRange(from, to) {
      this.dateFrom = from;
      this.dateTo = to;
      this.page = 1;
    },

    setInvoiceType(type) {
      this.invoiceType = type;
      this.page = 1;
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