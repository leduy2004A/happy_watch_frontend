import { defineStore } from "pinia";
import { layTrangThaiHoadonTheoMa } from "@/axios/quanlihoadon";
import { chuyenTrangThai } from "@/axios/timeline";
import { quayLaiTrangThai } from "@/axios/timeline";
import { useToast } from "vue-toastification";
import { useOrderSummaryStore } from "@/store/orderSumaryStore";
import { useExportPdf } from "@/components/admin/QuanLyHoaDon/exportPdfGiaoHang";
const { exportToPdf } = useExportPdf();
import { danhSachSanPhamHoaDonStore } from "./danhSachSanPhamHoaDonStore";
import { useDiaChiTrongHoaDonStore } from "./diaChiTrongHoaDonStore";
import { sendMailTrangThai } from "@/axios/email";
import { layMailTuHoaDon } from "@/axios/email";
import router from "@/router/router";
const toast = useToast();
// Mapping trạng thái với style hiển thị
const STATUS_MAPPING = {
  "Chờ xác nhận": {
    title: "Chờ xác nhận",
    color: "amber-lighten-4",
    icon: "mdi-clock-outline",
    iconColor: "amber",
  },
  "Chờ giao hàng": {
    title: "Chờ giao hàng",
    color: "amber-lighten-4",
    icon: "mdi-clock-outline",
    iconColor: "amber",
  },
  "Đã xác nhận": {
    title: "Đã xác nhận",
    color: "green-lighten-4",
    icon: "mdi-check-circle",
    iconColor: "green",
  },
  "Đang giao hàng": {
    title: "Đang giao hàng",
    color: "blue-lighten-4",
    icon: "mdi-truck-delivery",
    iconColor: "blue",
  },
  "Đã giao": {
    title: "Đã giao hàng",
    color: "green-lighten-4",
    icon: "mdi-check-circle",
    iconColor: "green",
  },
  "Hoàn thành": {
    title: "Hoàn thành",
    color: "green-lighten-4",
    icon: "mdi-check-circle",
    iconColor: "green",
  },
  "Đã Hủy": {
    title: "Đã hủy",
    color: "red-lighten-4",
    icon: "mdi-close-circle",
    iconColor: "red",
  },
  "Đã thanh toán": {
    title: "Đã thanh toán",
    color: "red-lighten-4",
    icon: "mdi-check-circle",
    iconColor: "red",
  },
  "Chờ xác nhận": {
    title: "Chờ xác nhận",
    color: "red-lighten-4",
    icon: "mdi-check-circle",
    iconColor: "red",
  },
  "Đang chờ xác nhận": {
    title: "Chờ xác nhận",
    color: "red-lighten-4",
    icon: "mdi-check-circle",
    iconColor: "red",
  },
  "Đã Hoàn Trả Hàng": {
    title: "Trả hàng",
    color: "red-lighten-4",
    icon: "mdi-check-circle",
    iconColor: "red",
  },
  // 'Đã Hủy': {
  //   title: 'Đã Huỷ',
  //   color: 'red-lighten-4',
  //   icon: 'mdi-close-circle',
  //   iconColor: 'red'
  // },
};

export const useTimelineStore = defineStore("timeline", {
  state: () => ({
    timelineItems: [],
    loading: false,
    error: null,
    nutTrangThai: "",
  }),

  actions: {
    async fetchTimeline(orderId) {
      try {
        this.loading = true;
        const response = await layTrangThaiHoadonTheoMa(orderId);
        if (response.data) {
          this.nutTrangThai = response.data.trangThaiTiepTheo;
          // Chuyển đổi dữ liệu API thành format timeline
          this.timelineItems = response.data.lichSuTrangThai.map((item) => ({
            ...STATUS_MAPPING[item.trangThaiDaLuu], // Map style dựa trên trạng thái
            id: item.id,
            ma: item.ma,
            timestamp: item.ngayChinhSua,
            note: item.ghiChu,
          }));
          console.log(this.timelineItems);
        }
      } catch (error) {
        console.error("Lỗi khi tải timeline:", error);
        toast.error("Có lỗi xảy ra khi tải timeline");
        this.error = error;
      } finally {
        this.loading = false;
      }
    },

    getLineColor(index) {
      if (index < this.timelineItems.length - 1) {
        return this.timelineItems[index + 1].iconColor;
      }
      return "grey";
    },

    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    },
    async addTimeLine(data) {
      const orderSummaryStore = useOrderSummaryStore();
      const danhSachSanPham = danhSachSanPhamHoaDonStore();
      const DiaChiTrongHoaDonStore = useDiaChiTrongHoaDonStore();
      const sampleData = {
        // Thông tin người gửi
        senderPhone: "0355512589",
        shopName: "Happy Watch Store",
        shopAddress:
          "FPT PolyTechnic cơ sở Kiều Mai, P.Kiều Mai, Phúc Diễn, Từ Liêm, Hà Nội",

        // Thông tin người nhận
        receiverName: DiaChiTrongHoaDonStore.diaChi.tenNguoiNhan,
        receiverPhone: DiaChiTrongHoaDonStore.diaChi.dienThoai,
        deliveryAddress:
          DiaChiTrongHoaDonStore.diaChi.diaChiCuThe +
          ", " +
          DiaChiTrongHoaDonStore.diaChi.xaPhuongThiTran +
          ", " +
          DiaChiTrongHoaDonStore.diaChi.quanHuyen +
          ", " +
          DiaChiTrongHoaDonStore.diaChi.tinhThanhPho,

        orderCode: "DH123456789",
        qrCode: "",

        // Danh sách sản phẩm
        products: danhSachSanPham.products,

        // Thông tin thanh toán
        tongTien: orderSummaryStore.total,
        phiGiaoHang: orderSummaryStore.shippingFee,
        tongTienHang: orderSummaryStore.subTotal,
        giamGia: orderSummaryStore.discount,

        // Metadata
        ngayTao: new Date().toLocaleDateString("vi-VN"),
        trangThai: "Chờ giao hàng",
      };

      try {
        this.loading = true;
        const response = await chuyenTrangThai(data);
        console.log(response.data);
        if (response.data) {
          this.nutTrangThai = response.data.trangThaiTiepTheo;
          // Chuyển đổi dữ liệu API thành format timeline
          this.timelineItems = response.data.lichSuTrangThaiList.map(
            (item) => ({
              id: item.id,
              ma: item.ma,
              ...STATUS_MAPPING[item.trangThaiDaLuu], // Map style dựa trên trạng thái
              timestamp: item.ngayChinhSua,
              note: item.ghiChu,
            })
          );
        }
        if (response.data.trangThai === "Chờ giao hàng") {
          exportToPdf(sampleData);
        }
        const resultMail = await layMailTuHoaDon(
          router.currentRoute.value.query.id
        );
        console.log(resultMail)
        if (resultMail.data !== null)
        {
          if (response.data.trangThai === "Đang giao hàng") {
            const orderData = {
              customerName: sampleData.receiverName,
              orderId: sampleData.orderCode,
              orderStatus: "Đơn hàng đang được giao",
              products: sampleData.products,
              shippingFee: sampleData.phiGiaoHang,
              shippingAddress: sampleData.deliveryAddress,
              phone: sampleData.receiverPhone,
              subtotal: sampleData.tongTienHang,
              total: sampleData.tongTien,
              productsTable: generateProductsTable(sampleData.products),
            };
            const templateParams = {
              to_email: resultMail.data,
              orderStatus: orderData.orderStatus,
              orderId: orderData.orderId,
              productsTable: orderData.productsTable,
              subtotal: orderData.subtotal,
              shippingFee: orderData.shippingFee,
              total: orderData.total,
              shippingAddress: orderData.shippingAddress,
              phone: orderData.phone,
              customerName: orderData.customerName,
            };
            try {
              const resultMail = await sendMailTrangThai(templateParams);
              if (resultMail.status === 200) {
                toast.success("Gửi mail thành công");
              }
            } catch (e) {
              toast.error("Có lỗi xảy ra khi gửi mail");
            }
          } else if (response.data.trangThai === "Đã xác nhận") {
            const orderData = {
              customerName: sampleData.receiverName,
              orderId: sampleData.orderCode,
              orderStatus: "Đơn hàng đã được xác nhận",
              products: sampleData.products,
              shippingFee: sampleData.phiGiaoHang,
              shippingAddress: sampleData.deliveryAddress,
              phone: sampleData.receiverPhone,
              subtotal: sampleData.tongTienHang,
              total: sampleData.tongTien,
              productsTable: generateProductsTable(sampleData.products),
            };
            const templateParams = {
              to_email: resultMail.data,
              orderStatus: orderData.orderStatus,
              orderId: orderData.orderId,
              productsTable: orderData.productsTable,
              subtotal: orderData.subtotal,
              shippingFee: orderData.shippingFee,
              total: orderData.total,
              shippingAddress: orderData.shippingAddress,
              phone: orderData.phone,
              customerName: orderData.customerName,
            };
            try {
              const resultMail = await sendMailTrangThai(templateParams);
              if (resultMail.status === 200) {
                toast.success("Gửi mail thành công");
              }
            } catch (e) {
              toast.error("Có lỗi xảy ra khi gửi mail");
            }
          } else if (response.data.trangThai === "Hoàn thành") {
            const orderData = {
              customerName: sampleData.receiverName,
              orderId: sampleData.orderCode,
              orderStatus: "Đơn hàng đã hoàn thành",
              products: sampleData.products,
              shippingFee: sampleData.phiGiaoHang,
              shippingAddress: sampleData.deliveryAddress,
              phone: sampleData.receiverPhone,
              subtotal: sampleData.tongTienHang,
              total: sampleData.tongTien,
              productsTable: generateProductsTable(sampleData.products),
            };
            const templateParams = {
              to_email: resultMail.data,
              orderStatus: orderData.orderStatus,
              orderId: orderData.orderId,
              productsTable: orderData.productsTable,
              subtotal: orderData.subtotal,
              shippingFee: orderData.shippingFee,
              total: orderData.total,
              shippingAddress: orderData.shippingAddress,
              phone: orderData.phone,
              customerName: orderData.customerName,
            };
            try {
              const resultMail = await sendMailTrangThai(templateParams);
              if (resultMail.status === 200) {
                toast.success("Gửi mail thành công");
              }
            } catch (e) {
              toast.error("Có lỗi xảy ra khi gửi mail");
            }
          }
    
        }
      } catch (error) {
        console.error("Lỗi khi tải timeline:", error);
        this.error = error;
        toast.error(error.response.data);
      } finally {
        this.loading = false;
      }
    },
    async revertTrangThai(data) {
      const orderSummaryStore = useOrderSummaryStore();
      const danhSachSanPham = danhSachSanPhamHoaDonStore();
      const DiaChiTrongHoaDonStore = useDiaChiTrongHoaDonStore();
      const sampleData = {
        // Thông tin người gửi
        senderPhone: "0355512589",
        shopName: "Happy Watch Store",
        shopAddress:
          "FPT PolyTechnic cơ sở Kiều Mai, P.Kiều Mai, Phúc Diễn, Từ Liêm, Hà Nội",

        // Thông tin người nhận
        receiverName: DiaChiTrongHoaDonStore.diaChi.tenNguoiNhan,
        receiverPhone: DiaChiTrongHoaDonStore.diaChi.dienThoai,
        deliveryAddress:
          DiaChiTrongHoaDonStore.diaChi.diaChiCuThe +
          ", " +
          DiaChiTrongHoaDonStore.diaChi.xaPhuongThiTran +
          ", " +
          DiaChiTrongHoaDonStore.diaChi.quanHuyen +
          ", " +
          DiaChiTrongHoaDonStore.diaChi.tinhThanhPho,

        orderCode: "DH123456789",
        qrCode:
          "", // Base64 QR code mẫu

        // Danh sách sản phẩm
        products: danhSachSanPham.products,

        // Thông tin thanh toán
        tongTien: orderSummaryStore.total,
        phiGiaoHang: orderSummaryStore.shippingFee,
        tongTienHang: orderSummaryStore.subTotal,
        giamGia: orderSummaryStore.discount,

        // Metadata
        ngayTao: new Date().toLocaleDateString("vi-VN"),
        trangThai: "Chờ giao hàng",
      };
      try {
        this.loading = true;
        const response = await quayLaiTrangThai(data);
        console.log(response);
        if (response.data) {
          this.nutTrangThai = response.data.trangThaiTiepTheo;
          // Chuyển đổi dữ liệu API thành format timeline
          this.timelineItems = response.data.lichSuTrangThaiList.map(
            (item) => ({
              id: item.id,
              ma: item.ma,
              ...STATUS_MAPPING[item.trangThaiDaLuu], // Map style dựa trên trạng thái
              timestamp: item.ngayChinhSua,
              note: item.ghiChu,
            })
          );
        }
        if (response.data.trangThai === "Chờ giao hàng") {
          exportToPdf(sampleData);
        }
        const resultMail = await layMailTuHoaDon(
          router.currentRoute.value.query.id
        );
        if (resultMail.data !== null)
        {
          if (response.data.trangThai === "Đang giao hàng") {
            const orderData = {
              customerName: sampleData.receiverName,
              orderId: sampleData.orderCode,
              orderStatus: "Đơn hàng đang được giao",
              products: sampleData.products,
              shippingFee: sampleData.phiGiaoHang,
              shippingAddress: sampleData.deliveryAddress,
              phone: sampleData.receiverPhone,
              subtotal: sampleData.tongTienHang,
              total: sampleData.tongTien,
              productsTable: generateProductsTable(sampleData.products),
            };
            const templateParams = {
              to_email: resultMail.data,
              orderStatus: orderData.orderStatus,
              orderId: orderData.orderId,
              productsTable: orderData.productsTable,
              subtotal: orderData.subtotal,
              shippingFee: orderData.shippingFee,
              total: orderData.total,
              shippingAddress: orderData.shippingAddress,
              phone: orderData.phone,
              customerName: orderData.customerName,
            };
            try {
              const resultMail = await sendMailTrangThai(templateParams);
              if (resultMail.status === 200) {
                toast.success("Gửi mail thành công");
              }
            } catch (e) {
              toast.error("Có lỗi xảy ra khi gửi mail");
            }
          } else if (response.data.trangThai === "Đã xác nhận") {
            const orderData = {
              customerName: sampleData.receiverName,
              orderId: sampleData.orderCode,
              orderStatus: "Đơn hàng đã được xác nhận",
              products: sampleData.products,
              shippingFee: sampleData.phiGiaoHang,
              shippingAddress: sampleData.deliveryAddress,
              phone: sampleData.receiverPhone,
              subtotal: sampleData.tongTienHang,
              total: sampleData.tongTien,
              productsTable: generateProductsTable(sampleData.products),
            };
            const templateParams = {
              to_email: resultMail.data,
              orderStatus: orderData.orderStatus,
              orderId: orderData.orderId,
              productsTable: orderData.productsTable,
              subtotal: orderData.subtotal,
              shippingFee: orderData.shippingFee,
              total: orderData.total,
              shippingAddress: orderData.shippingAddress,
              phone: orderData.phone,
              customerName: orderData.customerName,
            };
            try {
              const resultMail = await sendMailTrangThai(templateParams);
              if (resultMail.status === 200) {
                toast.success("Gửi mail thành công");
              }
            } catch (e) {
              toast.error("Có lỗi xảy ra khi gửi mail");
            }
          } else if (response.data.trangThai === "Hoàn thành") {
            const orderData = {
              customerName: sampleData.receiverName,
              orderId: sampleData.orderCode,
              orderStatus: "Đơn hàng đã hoàn thành",
              products: sampleData.products,
              shippingFee: sampleData.phiGiaoHang,
              shippingAddress: sampleData.deliveryAddress,
              phone: sampleData.receiverPhone,
              subtotal: sampleData.tongTienHang,
              total: sampleData.tongTien,
              productsTable: generateProductsTable(sampleData.products),
            };
            const templateParams = {
              to_email: resultMail.data,
              orderStatus: orderData.orderStatus,
              orderId: orderData.orderId,
              productsTable: orderData.productsTable,
              subtotal: orderData.subtotal,
              shippingFee: orderData.shippingFee,
              total: orderData.total,
              shippingAddress: orderData.shippingAddress,
              phone: orderData.phone,
              customerName: orderData.customerName,
            };
            try {
              const resultMail = await sendMailTrangThai(templateParams);
              if (resultMail.status === 200) {
                toast.success("Gửi mail thành công");
              }
            } catch (e) {
              toast.error("Có lỗi xảy ra khi gửi mail");
            }
          }
        }
      } catch (error) {
        console.error("Lỗi khi tải timeline:", error);
        toast.error(error.response.data);
        this.error = error;
      } finally {
        this.loading = false;
      }
    },
  },
});
const generateProductsTable = (products) => {
  return products
    .map(
      (item) => `
      <tr>
          <td style="border: 1px solid #ddd; padding: 8px;">
          <img src="${item.hinhAnh}" alt="" width="50px"/>
          ${
            item.tenSanPham +
            "–" +
            item.gioiTinh +
            "–" +
            item.loaiKinhSanPham +
            "–" +
            item.chatLieuVoSanPham +
            "–" +
            item.loaiMaySanPham +
            "–" +
            item.chatLieuDaySanPham
          }</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${item.soLuong}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${
            item.giaTungSanPham
          }đ</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${
            item.giaTungSanPham * item.soLuong
          }đ</td>
      </tr>
  `
    )
    .join("");
};
