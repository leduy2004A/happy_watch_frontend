import { defineStore } from "pinia";
import { ref, computed } from "vue";
import Sweetalert2 from "sweetalert2";
import {
  addSoLuongSanPham,
  truSoLuongSanPham,
  getSanPhamTheoHoaDon,
} from "@/axios/hoadon";
import { xoaSanPhamTrongHoaDon } from "@/axios/hoadon";
import { useToast } from "vue-toastification";

const toast = useToast();
export const useSanPhamTrongHoaDonStore = defineStore("cart", {
  state: () => ({
    products: [],
    hoaDonId: null,
  }),

  getters: {
    totalPrice: (state) => {
      return state.products.reduce(
        (sum, product) => sum + product.giaTungSanPham * product.soLuong,
        0
      );
    },
  },

  actions: {
    initializeCart(lstSanPham, hoa_don_id) {
      this.products = [...lstSanPham];
      this.hoaDonId = hoa_don_id;
    },

    productTotalPrice(product) {
      return product.giaTungSanPham * product.soLuong;
    },

    parseMoney(money) {
      return money.toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
      });
    },

    async increaseQuantity(index, product) {
      try {
        await addSoLuongSanPham(product.chiTietHoaDonId);
        this.products[index].soLuong++;
        await this.updateCart();
      } catch (error) {
        toast.error(error.response.data.message)
        console.error("Lỗi khi tăng số lượng:", error);
      }
    },

    async decreaseQuantity(index, product) {
      try {
        if (this.products[index].soLuong > 1) {
          await truSoLuongSanPham(product.chiTietHoaDonId);
          this.products[index].soLuong--;
          await this.updateCart();
        }
      } catch (error) {
        toast.error(error.response.data.message)
        console.error("Lỗi khi giảm số lượng:", error);
      }
    },

    removeProduct(index, product) {
      Sweetalert2.fire({
        title: "Bạn có muốn xoá  không?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Xác nhận",
        denyButtonText: `Không !`,
      }).then(async (result) => {
        if (result.isConfirmed) {
          const result = await xoaSanPhamTrongHoaDon(product.chiTietHoaDonId);
          if (result.status === 200) {
            toast.success("Đã xoá sản phẩm");
            this.products.splice(index, 1);
          }
          else{
            toast.error("Xoá thất bại");
          }
        } else if (result.isDenied) {
          Swal.fire("Changes are not saved", "", "info");
        }
      });

    },

    async updateCart() {
      try {
        const result = (await getSanPhamTheoHoaDon(this.hoaDonId)).data;
        this.products = result.chiTietHoaDons;
        return result;
      } catch (error) {
        console.error("Lỗi khi cập nhật giỏ hàng:", error);
      }
    },
  },
});
