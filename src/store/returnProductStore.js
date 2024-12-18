// stores/returnProductStore.js
import { defineStore } from "pinia";
import { layDanhSachSanPhamTheoMaHoaDon } from "@/axios/quanlihoadon";
import { thongTinGiaoHang } from "@/axios/quanlihoadon";
import { useToast } from "vue-toastification";
import Sweetalert2 from "sweetalert2";
import { traHang,thongTinTraHang } from "@/axios/quanlihoadon";
const toast = useToast();
export const useReturnProductStore = defineStore("returnProduct", {
  state: () => ({
    products: [],
    returnInfo: {
      customerName: "",
      receiver: "",
      address: "",
    },
    discount: 13750,
    khuyenMai:"",
    giaTriHoanTra:0,
    giaTriHoanTraMoi:"",
    tongTienHoaDon:0,
    tongGiaSauTraHang:0,
    tongTienSauKhuyenMai:0,
    phiShip:0,
    tongTienSauKhuyenMai2:0,
    searchQuery: "",
    selectAll: false,
    diaChi: {},
  }),

  getters: {
    selectedProducts: (state) => {
      return state.products.filter(
        (product) => product.selected && product.quantity > 0
      );
    },
    totalAmount: (state) => {
      return state.selectedProducts.reduce((sum, product) => {
        return sum + product.giaTungSanPham * product.quantity;
      }, 0);
    },
    finalAmount: (state) => {
      return state.totalAmount;
    },
    isAllSelected: (state) => {
      return (
        state.products.length > 0 &&
        state.products.every((product) => product.selected)
      );
    },
  },

  actions: {
    toggleSelectAll(value) {
      this.selectAll = value;
      this.products.forEach((product) => {
        product.selected = value;
      });
    },

    toggleProductSelection(productId, value) {
      const product = this.products.find(
        (p) => p.chiTietSanPhamId === productId
      );
      if (product) {
        product.selected = value;
        this.selectAll = this.products.every((p) => p.selected);
      }
    },

    increaseQuantity(productId) {
      const product = this.products.find(
        (p) => p.chiTietSanPhamId === productId
      );
      if (product && product.quantity < product.soLuong) {
        product.quantity++;
      }
    },

    decreaseQuantity(productId) {
      const product = this.products.find(
        (p) => p.chiTietSanPhamId === productId
      );
      if (product && product.quantity > 0) {
        product.quantity--;
      }
    },

    updateNote(productId, note) {
      const product = this.products.find(
        (p) => p.chiTietSanPhamId === productId
      );
      if (product) {
        product.note = note;
      }
    },

    async submitReturn() {
      const chiTietTraHangList = this.selectedProducts.map((item) => ({
        idChiTietSanPham: item.chiTietSanPhamId,
        soLuongTra: item.quantity,
        ghiChu: item.note,
      }));
      console.log(this.searchQuery);
      const data = {
        maHoaDon: this.searchQuery,
        ghiChu: "Lý do trả hàng: Sản phẩm lỗi",
        chiTietTraHangList: chiTietTraHangList,
      };
      
      Sweetalert2.fire({
        title: "Xác nhận trả hàng?",
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: "Xác nhận",
        denyButtonText: `Không !`,
      }).then(async (result) => {

        if(result.isConfirmed)
          {
                  try {
        const result = await traHang(data);
        console.log(result)
        if (result.status === 200) {
          toast.success("Trả hàng thành công");
          window.location.reload()
        }
        else{
          throw new Error("Trả hàng thất bại: " + (result.message || "Lỗi không xác định"));
        }
      } catch (error) {
        if (error.response?.data) {
          toast.error(error.response.data.message);
        } else {
          // Nếu là lỗi khác
          toast.error(error.message || "Có lỗi xảy ra");
        }
      }
          }
      })


    },
   async fetchThongTinTraHang() {
      const dataSanPhamChon = this.selectedProducts
      const resultSanPham = dataSanPhamChon.map(item => ({
        idChiTietHoaDon: item.chiTietHoaDonId,
        soLuongTra: item.quantity
    }));
      const data = {
        maHD: this.searchQuery,
        chiTietHoaDonTraHangDTOList: resultSanPham,
      };
      const dataTraHang =await thongTinTraHang(data)
      if(dataTraHang.status === 200)
        {
          this.khuyenMai = dataTraHang.data.khuyenMai
          this.giaTriHoanTra = dataTraHang.data.giaTriHoanTra
          this.giaTriHoanTraMoi = dataTraHang.data.giaTriHoanTraMoi
          this.tongGiaSauTraHang = dataTraHang.data.tongGiaSauTraHang
          this.tongTienSauKhuyenMai2 = dataTraHang.data.giaTriConLaiSauKhuyenMai
          this.phiShip = dataTraHang.data.phiShip
        }
    },
    async fetchDataStoreByMa(ma) {
      try {
        const result = await layDanhSachSanPhamTheoMaHoaDon(ma);
        console.log(result);
        if (result.status === 200) {
          this.products = result.data.chiTietHoaDons.map((product) => ({
            ...product,
            selected: false,
            quantity: 0,
            note: "",
          }));
          this.tongTienHoaDon = result.data.tongTienHoaDon
          this.tongTienSauKhuyenMai = result.data.tongTienSauKhuyenMai
          this.tongTienSauKhuyenMai2 = result.data.giaTriConLaiSauKhuyenMai
        }
      } catch (e) {
        toast.error(e);
      }
    },
    async fetchthongTinGiaoHang(ma) {
      try {
        const result = await thongTinGiaoHang(ma);
        console.log(result);
        if (result.status === 200) {
          this.diaChi = result.data;
        }
      } catch (e) {
        toast.error(e);
      }
    },
    setSearchQuery(query) {
      this.searchQuery = query;
    },
  },
});
