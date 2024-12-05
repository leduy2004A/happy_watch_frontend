import { defineStore } from 'pinia';
import { layTrangThaiHoadonTheoMa } from '@/axios/quanlihoadon';
import { chuyenTrangThai } from '@/axios/timeline';
import { quayLaiTrangThai } from '@/axios/timeline';
import { useToast } from 'vue-toastification';
import { useOrderSummaryStore } from '@/store/orderSumaryStore'
import { useExportPdf } from '@/components/admin/QuanLyHoaDon/exportPdfGiaoHang';
const {exportToPdf} = useExportPdf()
import { danhSachSanPhamHoaDonStore } from './danhSachSanPhamHoaDonStore';
import { useDiaChiTrongHoaDonStore } from './diaChiTrongHoaDonStore';
const toast = useToast()
// Mapping trạng thái với style hiển thị
const STATUS_MAPPING = {
  'Chờ xác nhận': {
    title: 'Chờ xác nhận',
    color: 'amber-lighten-4',
    icon: 'mdi-clock-outline',
    iconColor: 'amber'
  },
  'Chờ giao hàng': {
    title: 'Chờ giao hàng',
    color: 'amber-lighten-4',
    icon: 'mdi-clock-outline',
    iconColor: 'amber'
  },
  'Đã xác nhận': {
    title: 'Đã xác nhận',
    color: 'green-lighten-4',
    icon: 'mdi-check-circle',
    iconColor: 'green'
  },
  'Đang giao hàng': {
    title: 'Đang giao hàng', 
    color: 'blue-lighten-4',
    icon: 'mdi-truck-delivery',
    iconColor: 'blue'
  },
  'Đã giao': {
    title: 'Đã giao hàng',
    color: 'green-lighten-4',
    icon: 'mdi-check-circle',
    iconColor: 'green'
  },
  'Hoàn thành': {
    title: 'Hoàn thành',
    color: 'green-lighten-4',
    icon: 'mdi-check-circle',
    iconColor: 'green'
  },
  'Đã Hủy': {
    title: 'Đã hủy',
    color: 'red-lighten-4', 
    icon: 'mdi-close-circle',
    iconColor: 'red'
  },
  'Đã thanh toán': {
    title: 'Đã thanh toán',
    color: 'red-lighten-4', 
    icon: 'mdi-check-circle',
    iconColor: 'red'
  },
  'Chờ xác nhận': {
    title: 'Chờ xác nhận',
    color: 'red-lighten-4', 
    icon: 'mdi-check-circle',
    iconColor: 'red'
  },
  'Đang chờ xác nhận': {
    title: 'Chờ xác nhận',
    color: 'red-lighten-4', 
    icon: 'mdi-check-circle',
    iconColor: 'red'
  },
  'Đã Hoàn Trả Hàng': {
    title: 'Trả hàng',
    color: 'red-lighten-4', 
    icon: 'mdi-check-circle',
    iconColor: 'red'
  },
  // 'Đã Hủy': {
  //   title: 'Đã Huỷ',
  //   color: 'red-lighten-4', 
  //   icon: 'mdi-close-circle',
  //   iconColor: 'red'
  // },
};

export const useTimelineStore = defineStore('timeline', {
  state: () => ({
    timelineItems: [
    

    ],
    loading: false,
    error: null,
    nutTrangThai:""
  }),

  actions: {
    async fetchTimeline(orderId) {
      try {
        this.loading = true;
        const response = await layTrangThaiHoadonTheoMa(orderId);
        console.log("ồ hêy lona")
        console.log(response)
        if (response.data) {
          this.nutTrangThai = response.data.trangThaiTiepTheo
          // Chuyển đổi dữ liệu API thành format timeline
          this.timelineItems = response.data.lichSuTrangThai.map(item => ({
            ...STATUS_MAPPING[item.trangThaiDaLuu], // Map style dựa trên trạng thái
            id: item.id,
            ma: item.ma,
            timestamp: item.ngayChinhSua,
            note: item.ghiChu
          }));
          console.log(this.timelineItems)
        }
      } catch (error) {
        console.error('Lỗi khi tải timeline:', error);
        this.error = error;
      } finally {
        this.loading = false;
      }
    },

    getLineColor(index) {
      if (index < this.timelineItems.length - 1) {
        return this.timelineItems[index + 1].iconColor;
      }
      return 'grey';
    },

    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    },
    async addTimeLine(data){
      const orderSummaryStore = useOrderSummaryStore()
      const danhSachSanPham = danhSachSanPhamHoaDonStore()
      const DiaChiTrongHoaDonStore = useDiaChiTrongHoaDonStore()
      try {
        this.loading = true;
        const response = await chuyenTrangThai(data);
        console.log(response.data)
        if (response.data) {
          this.nutTrangThai = response.data.trangThaiTiepTheo
          // Chuyển đổi dữ liệu API thành format timeline
          this.timelineItems = response.data.lichSuTrangThaiList.map(item => ({
            id: item.id,
            ma: item.ma,
            ...STATUS_MAPPING[item.trangThaiDaLuu], // Map style dựa trên trạng thái
            timestamp: item.ngayChinhSua,
            note: item.ghiChu
          }));
        }
        if(response.data.trangThai === "Chờ giao hàng")
          {
            const sampleData = {
              // Thông tin người gửi
              senderPhone: '0355512589',
              shopName: 'Happy Watch Store',
              shopAddress: 'FPT PolyTechnic cơ sở Kiều Mai, P.Kiều Mai, Phúc Diễn, Từ Liêm, Hà Nội',
            
              // Thông tin người nhận
              receiverName: DiaChiTrongHoaDonStore.diaChi.tenNguoiNhan,
              receiverPhone: DiaChiTrongHoaDonStore.diaChi.dienThoai,
              deliveryAddress:DiaChiTrongHoaDonStore.diaChi.diaChiCuThe +', '+ DiaChiTrongHoaDonStore.diaChi.xaPhuongThiTran +', '+DiaChiTrongHoaDonStore.diaChi.quanHuyen +', '+DiaChiTrongHoaDonStore.diaChi.tinhThanhPho,

              orderCode: 'DH123456789',
              qrCode: '', // Base64 QR code mẫu
            
              // Danh sách sản phẩm
              products:danhSachSanPham.products,
            
              // Thông tin thanh toán
              tongTien: orderSummaryStore.total,
              phiGiaoHang: orderSummaryStore.shippingFee,
              tongTienHang: orderSummaryStore.subTotal,
              giamGia: orderSummaryStore.discount,
            
              // Metadata
              ngayTao: new Date().toLocaleDateString('vi-VN'),
              trangThai: 'Chờ giao hàng',
              
            };
            
            exportToPdf(sampleData)
          }
      } catch (error) {
        console.error('Lỗi khi tải timeline:', error);
        this.error = error;
        toast.error(error.response.data)
      } finally {
        this.loading = false;
      }
    },
    async revertTrangThai(data){
      const orderSummaryStore = useOrderSummaryStore()
      const danhSachSanPham = danhSachSanPhamHoaDonStore()
      const DiaChiTrongHoaDonStore = useDiaChiTrongHoaDonStore()
      try {
        this.loading = true;
        const response = await quayLaiTrangThai(data);
        console.log(response)
        if (response.data) {
          this.nutTrangThai = response.data.trangThaiTiepTheo
          // Chuyển đổi dữ liệu API thành format timeline
          this.timelineItems = response.data.lichSuTrangThaiList.map(item => ({
            id: item.id,
            ma: item.ma,
            ...STATUS_MAPPING[item.trangThaiDaLuu], // Map style dựa trên trạng thái
            timestamp: item.ngayChinhSua,
            note: item.ghiChu
          }));
        
        }
        if(response.data.trangThai === "Chờ giao hàng")
          {
            const sampleData = {
              // Thông tin người gửi
              senderPhone: '0355512589',
              shopName: 'Happy Watch Store',
              shopAddress: 'FPT PolyTechnic cơ sở Kiều Mai, P.Kiều Mai, Phúc Diễn, Từ Liêm, Hà Nội',
            
              // Thông tin người nhận
              receiverName: DiaChiTrongHoaDonStore.diaChi.tenNguoiNhan,
              receiverPhone: DiaChiTrongHoaDonStore.diaChi.dienThoai,
              deliveryAddress:DiaChiTrongHoaDonStore.diaChi.diaChiCuThe +', '+ DiaChiTrongHoaDonStore.diaChi.xaPhuongThiTran +', '+DiaChiTrongHoaDonStore.diaChi.quanHuyen +', '+DiaChiTrongHoaDonStore.diaChi.tinhThanhPho,

              orderCode: 'DH123456789',
              qrCode: '', // Base64 QR code mẫu
            
              // Danh sách sản phẩm
              products:danhSachSanPham.products,
            
              // Thông tin thanh toán
              tongTien: orderSummaryStore.total,
              phiGiaoHang: orderSummaryStore.shippingFee,
              tongTienHang: orderSummaryStore.subTotal,
              giamGia: orderSummaryStore.discount,
            
              // Metadata
              ngayTao: new Date().toLocaleDateString('vi-VN'),
              trangThai: 'Chờ giao hàng',
              
            };
            
            exportToPdf(sampleData)
          }
      } catch (error) {
        console.error('Lỗi khi tải timeline:', error);
         toast.error(error.response.data)
        this.error = error;
      } finally {
        this.loading = false;
      }
    }
  }
});