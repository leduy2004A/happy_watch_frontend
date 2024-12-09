// stores/voucherStore.js
import { defineStore } from "pinia";
import {
  thayDoiTrangThaiKhuyenMaiHoaDon,
  layTatCaKhuyenMai,
} from "@/axios/khuyenmai";
import { ref, computed } from "vue";

export const useVoucherHoaDonStore = defineStore("voucherHoaDon", () => {
  // state
  const vouchers = ref([]);
  const search = ref("");
  const dateFilter = ref({
    startDate: "",
    endDate: "",
  });
  const selectedType = ref(null);
  const selectedStatus = ref(null);
  const itemsPerPage = ref(5);
  const displayStatusDialog = ref(false);
  const idKhuyenMai = ref(0);
  const modalPGG = ref(false);
  const modalSuaPGG = ref(false);
  const dataKM = ref({});

  // constants
  const types = ["Tất cả", "Cá nhân", "Toàn bộ"];
  const statuses = ["Tất cả", "Đang diễn ra", "Đã kết thúc", "Chưa bắt đầu"];

  // computed
  const filters = computed(() => ({
    global: { value: search.value, matchMode: "contains" },
  }));

  const filteredVouchers = computed(() => {
    let filtered = [...vouchers.value];
    console.log(filtered);
    if (selectedType.value && selectedType.value !== "Tất cả") {
      filtered = filtered.filter(
        (v) =>
          v.loaiApDung?.toLowerCase() ===
          (selectedType.value.toLowerCase() === "Toàn bộ".toLowerCase()
            ? "Toàn bộ".toLowerCase()
            : "Cá nhân".toLowerCase())
      );
    }

    if (selectedStatus.value && selectedStatus.value !== "Tất cả") {
      filtered = filtered.filter(
        (v) => v.trangThai?.toLowerCase() === selectedStatus.value.toLowerCase()
      );
    }

    if (dateFilter.value.startDate && dateFilter.value.endDate) {
      const start = new Date(dateFilter.value.startDate);
      const end = new Date(dateFilter.value.endDate);
      filtered = filtered.filter((v) => {
        const voucherStart = new Date(v.ngayBatDau);
        const voucherEnd = new Date(v.ngayKetThuc);
        return voucherStart >= start && voucherEnd <= end;
      });
    }

    return filtered;
  });

  // actions
  const fetchVouchers = async () => {
    const result = await layTatCaKhuyenMai();
    if (result.status === 200) {
      vouchers.value = result.data;
    }
  };

  const handleStatusChange = async () => {
    const result = await thayDoiTrangThaiKhuyenMaiHoaDon(idKhuyenMai.value);
    return result;
  };

  const getStatusColor = (status) => {
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
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const xoaBoLoc = () => {
    selectedType.value = null;
    selectedStatus.value = null;
    search.value = "";
    dateFilter.value.startDate = "";
    dateFilter.value.endDate = "";
  };
  return {
    // state
    vouchers,
    search,
    dateFilter,
    selectedType,
    selectedStatus,
    itemsPerPage,
    displayStatusDialog,
    idKhuyenMai,
    modalPGG,
    modalSuaPGG,
    dataKM,

    // constants
    types,
    statuses,

    // computed
    filters,
    filteredVouchers,

    // actions
    fetchVouchers,
    handleStatusChange,
    getStatusColor,
    formatPrice,
    xoaBoLoc
  };
});
