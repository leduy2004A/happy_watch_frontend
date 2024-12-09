// stores/voucherStore.js
import { defineStore } from "pinia";
import {
  layTatCaKhuyenMaiSanPham,
  thayDoiTrangThaiKhuyenMaiSanPham,
} from "@/axios/khuyenmai";

export const useVoucherStore = defineStore("voucher", {
  state: () => ({
    vouchers: [],
    search: "",
    dateFilter: {
      startDate: "",
      endDate: "",
    },
    selectedType: null,
    selectedStatus: null,
    itemsPerPage: 5,
    displayStatusDialog: false,
    idKhuyenMaiSanPham: 0,
    modalPGG: false,
    modalSuaPGG: false,
    types: ["Tất cả", "Cá nhân", "Toàn bộ"],
    statuses: ["Tất cả", "Chưa bắt đầu", "Đang diễn ra", "Đã kết thúc"],
  }),

  getters: {
    filters: (state) => ({
      global: { value: state.search, matchMode: "contains" },
    }),

    filteredVouchers: (state) => {
      let filtered = [...state.vouchers];
      console.log(filtered);
      if (state.selectedType && state.selectedType !== "Tất cả") {
        filtered = filtered.filter(
          (v) =>
            v.loaiApDung ===
            (state.selectedType === "Toàn bộ" ? "TOAN_BO" : "CA_NHAN")
        );
      }

      if (state.selectedStatus && state.selectedStatus !== "Tất cả") {
        filtered = filtered.filter(
          (v) =>
            v.trangThai?.toLowerCase() === state.selectedStatus.toLowerCase()
        );
      }

      if (state.dateFilter.startDate && state.dateFilter.endDate) {
        const start = new Date(state.dateFilter.startDate);
        const end = new Date(state.dateFilter.endDate);
        filtered = filtered.filter((v) => {
          const voucherStart = new Date(v.ngayBatDau);
          const voucherEnd = new Date(v.ngayKetThuc);
          return voucherStart >= start && voucherEnd <= end;
        });
      }

      return filtered;
    },
  },

  actions: {
    async fetchVouchers() {
      const result = await layTatCaKhuyenMaiSanPham();
      if (result.status === 200) {
        this.vouchers = result.data;
      }
    },

    async capNhatTrangThai(trangThai) {
      if (trangThai.trangThai === "Đang diễn ra") {
        this.idKhuyenMaiSanPham = trangThai.id;
        this.displayStatusDialog = true;
      }
    },

    async confirmStatusChange() {
      const result = await thayDoiTrangThaiKhuyenMaiSanPham(
        this.idKhuyenMaiSanPham
      );
      return result;
    },

    getStatusColor(status) {
      switch (status) {
        case "Còn hiệu lực":
          return "success";
        case "Hết hiệu lực":
          return "danger";
        case "Chưa bắt đầu":
          return "warning";
        default:
          return "info";
      }
    },
    xoaBoLoc() {
      // selectedType.value = null;
      this.selectedStatus = null;
      this.search = "";
      this.dateFilter.startDate = "";
      this.dateFilter.endDate = "";
    },
    formatPrice(price) {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(price);
    },
  },
});
