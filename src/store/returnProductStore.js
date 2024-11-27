// stores/returnProductStore.js
import { defineStore } from "pinia";
import { layDanhSachSanPhamTheoMaHoaDon } from "@/axios/quanlihoadon";
import { thongTinGiaoHang } from "@/axios/quanlihoadon";
import { useToast } from "vue-toastification";
import { traHang } from "@/axios/quanlihoadon";
const toast = useToast();
export const useReturnProductStore = defineStore("returnProduct", {
  state: () => ({
    products: [
      {
        id: 1,
        name: 'Balen Grey 2023 Bac Đế nhựa "Tim" [41]',
        image: "path_to_image1.jpg",
        quantity: 0,
        stock: 4,
        price: 137500,
        selected: false,
        note: "",
      },
      {
        id: 2,
        name: 'Kkkk Sắt Đế sắt "Xanh dương" [40]',
        image: "path_to_image2.jpg",
        quantity: 0,
        stock: 3,
        price: 80000,
        selected: false,
        note: "",
      },
    ],
    returnInfo: {
      customerName: "Nguyễn Thị Thùy Dương",
      receiver: "Địa chỉ 12",
      address: "aaaaa, Xã Mường Giàng, Huyện Quỳnh Nhai, Sơn La",
    },
    discount: 13750,
    searchQuery: "",
    selectAll: false,
    diaChi:{}
  }),

  getters: {
    selectedProducts: (state) => {
      return state.products.filter(
        (product) => product.selected && product.quantity > 0
      );
    },
    totalAmount: (state) => {
      return state.selectedProducts.reduce((sum, product) => {
        return sum + product.giaSauGiam * product.quantity;
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
       const chiTietTraHangList = this.selectedProducts.map(item => ({
        idChiTietSanPham: item.chiTietSanPhamId,
        soLuongTra: item.quantity,
        ghiChu: item.note
      }));
      console.log(this.searchQuery)
      const data = {
        maHoaDon: this.searchQuery,
        ghiChu: "Lý do trả hàng: Sản phẩm lỗi",
        chiTietTraHangList:chiTietTraHangList
      };
      const result = await traHang(data)
      try{
        if(result.status === 200)
          {
            toast.success("Trả hàng thành công")
          }
        
      }catch(e){
        toast.error("có lỗi xảy ra")
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
          this.diaChi = result.data
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
