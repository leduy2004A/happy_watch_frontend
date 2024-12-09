import { defineStore } from "pinia";
import { getHoaDonTheoMa } from "@/axios/quanlihoadon";
import router from "@/router/router";

export const quanLyCacNut = defineStore("quanLyCacNut", {
  state: () => ({
    nutDaXacNhan: true,
    nutHuyDon: true,
    nutChiTiet: true,
    nutQuayLaiTrangTruocDo: true,
    nutCapNhat: true,
    nutThanhToan: false,
    nutThemSanPham: true,
    nutCongSanPham: true,
    nutTruSanPham: true,
    nutHuySanPhamTrongHoaDon: true,
  }),

  actions: {
    // Reset tất cả các nút về trạng thái mặc định
    resetTrangThaiNut() {
      this.nutDaXacNhan = true;
      this.nutHuyDon = true;
      this.nutChiTiet = true;
      this.nutQuayLaiTrangTruocDo = true;
      this.nutCapNhat = true;
      this.nutThanhToan = false;
      this.nutThemSanPham = true;
      this.nutCongSanPham = true;
      this.nutTruSanPham = true;
      this.nutHuySanPhamTrongHoaDon = true;
    },

    async layTrangThai() {
      // Reset trạng thái các nút trước khi kiểm tra
      this.resetTrangThaiNut();

      const result = await getHoaDonTheoMa(router.currentRoute.value.params.ma);
      if (result.data.trangThai === "Đã Hủy") {
        this.nutDaXacNhan = false;
        this.nutHuyDon = false;
        this.nutChiTiet = false;
        this.nutQuayLaiTrangTruocDo = false;
        this.nutCapNhat = false;
        this.nutThanhToan = false;
        this.nutThemSanPham = false;
        this.nutCongSanPham = false;
        this.nutTruSanPham = false;
        this.nutHuySanPhamTrongHoaDon = false;
      } else if (result.data.trangThai === "Đang giao hàng") {
        this.nutDaXacNhan = true;
        this.nutHuyDon = false;
        this.nutChiTiet = false;
        this.nutQuayLaiTrangTruocDo = true;
        this.nutCapNhat = false;
        this.nutThanhToan = false;
        this.nutThemSanPham = false;
        this.nutCongSanPham = false;
        this.nutTruSanPham = false;
        this.nutHuySanPhamTrongHoaDon = false;
      } else if (result.data.trangThai === "Đã giao") {
        this.nutDaXacNhan = true;
        this.nutHuyDon = false;
        this.nutChiTiet = false;
        this.nutQuayLaiTrangTruocDo = true;
        this.nutCapNhat = false;
        this.nutThanhToan = true;
        this.nutThemSanPham = false;
        this.nutCongSanPham = false;
        this.nutTruSanPham = false;
        this.nutHuySanPhamTrongHoaDon = false;
      } else if (result.data.trangThai === "Hoàn thành") {
        this.nutDaXacNhan = true;
        this.nutHuyDon = false;
        this.nutChiTiet = false;
        this.nutQuayLaiTrangTruocDo = false;
        this.nutCapNhat = false;
        this.nutThanhToan = false;
        this.nutThemSanPham = false;
        this.nutCongSanPham = false;
        this.nutTruSanPham = false;
        this.nutHuySanPhamTrongHoaDon = false;
      } else if (result.data.trangThai === "Đã Hoàn Trả Hàng") {
        this.nutDaXacNhan = false;
        this.nutHuyDon = false;
        this.nutChiTiet = false;
        this.nutQuayLaiTrangTruocDo = false;
        this.nutCapNhat = false;
        this.nutThanhToan = false;
        this.nutThemSanPham = false;
        this.nutCongSanPham = false;
        this.nutTruSanPham = false;
        this.nutHuySanPhamTrongHoaDon = false;
      }
    },
  },

  getters: {},
});
