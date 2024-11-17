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
  'Đã hủy': {
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
  }
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
        console.log(response)
        if (response.data) {
          this.nutTrangThai = response.data.trangThaiTiepTheo
          // Chuyển đổi dữ liệu API thành format timeline
          this.timelineItems = response.data.lichSuTrangThai.map(item => ({
            id: item.id,
            ma: item.ma,
            ...STATUS_MAPPING[item.trangThaiDaLuu], // Map style dựa trên trạng thái
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
              qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA/8AAAP/CAAAAACzaSOKAAASMElEQVR42u3dwZHjAAwDQeeftByFBILs+XvLFtG65/0eSVf7eQQS/5L4l8S/JP4l8S+Jf0n8S+JfEv+S+JfEvyT+JfEviX9J/EviXxL/kviXxL8k/iXxL4l/SfxL4l8S/5L4l8S/JP4l8S+Jf0n8S+Jf4l8S/5L4l8S/JP4l8S+Jf0n8S+JfEv+S+JfEvyT+JfEviX9J/EviXxL/kviXxL8k/iXxL4l/SfxL4l8S/5L4l8S/JP4l8S+Jf0n8S/xL4l8S/5L4l8S/JP4l8S+Jf0n8S+JfEv+S+JfEvyT+JfEviX9J/EviXxL/kviXxL8k/iXxL4l/SfxL4l8S/5L4l8S/JP4l8S+Jf4l/SfxL4l8S/5L4l8S/JP4l8S+Jf0n8S+JfEv+S+JfEvyT+JfEviX9J/EviXxL/kviXxL8k/iXxL4l/SfxLavL/29qrjyX5zJM/zFr4559/a+Gff/6thX/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnn30X5559/F+Wff/5dlH/++XdR/vnn30X5559/F+XfWvjnn39rOe//mdvki3otWgv//PNvLfzzz7+18M8//9bCP//8Wwv//PNvLfzzzz//ngv//PPvufDPP//8888///zzzz///PPPP//8888///zzzz//Lso///y7KP/88++i/PPPv4vyzz//Lso///y7KP/88++i/FsL/y7Kv7Xw76L8Wwv/Lsq/tfDvovxbC/8uyr+18O+i/FsL/y7Kv7Xw76L8Wwv/Lsq/tfDvm/NvLTf9J6ea/OZPbb3PPPnN+eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/+XZR//vl3Uf75599F+eeff/75559//vnnn3/++bcW/vmvfT145vzzz79nzj///Hvm/Lso//zz76L888+/i/LPP//8888///zzzz///PNvLfzzz7+18M8//9bCP//8888///zzzz///PPPP//8888///zzzz///PPPP//888+/LfLPP/+2yD///Nsi//zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PO/65u/OlXPnH8X5d8z559//j1z/vnnn3/++effWvjnn39r4Z9//q2Ff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn39b5J9//m2Rf/75t0X++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75r30uV5ecZGIt/PPPv7Xwzz//1sI///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zbOf/882/n/PPPv53zzz///Hsu/PPPv+fCP//8ey78888///zzzz///PPPP//8888///zzzz///PPPv4vyzz//Lso///y7KP/88++i/PPPv4vyzz//Lsq/tfDPP//Wwv/Wet8e3nttr0X++fdp/vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75Z5B//vlnkH/++WeQf/75J5h//vknmH/+XZRg/vl3UYL5599FCeaff/59mn/++fdp/vnn36ethX/+fdpa+Offp62Ff/59mn/++fdp/lf5v1pyD8mpDnZwdooeAf/88y/++edf/PPPv/jnn3/xzz//4p9//sU///yLf/75F//88y/++edf/PPPv/jnn3/xzz//4p9//sU///zzzz///PPPP//888+/+Oeff/HPP//in3/+xT///It//vkX//zzL/7551/888+/+Oeff/HPP//in3/+xT///GuW/7X/H/zgx3L1zTX43vzzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888//wvWZKrzljx3TPzzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP/9Oxj///DsZ//zz72T8888///zzzz///PPPP//8888///zzzz///PPPP//8888///wbE//fPLYkE4LbTjJ4ivzzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888//9+8HpJ/fPAP633nujf//PPv3vzzz797828P/PPPvz3wzz//9sA///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzz/9+/8mpJoeebPDQr86Bf/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/7559/B+eeffwfn3xz4/+bgg39YL7KkweRjSf4w/vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/7555//BUte++bqfajmwL+D828O/PPPvznwzz///PPPP//8888///zzzz///PPPP//8888///zzzz+i/PPPP6L8888/ovzzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzz78/zj///Pvj/PPPvz/OP//8888///zzzz///PPPP//8888///zzzz///PPPP//883/e/+A9cNBWcuf8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP/8NyAYb7H1qg4EPFsw///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8r/J/taT/qz8s+fbgX/zzz7/4559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/79MP75598P459//v0w/vnn3w/jn3/+/TD++cfED+Off0z4559/TPjnn39M+Oeff0z451+Y8M+/+Oeff/HPP//in3/+xT///It//vkX//zzL/7551/888+/+Oef/xE3SfbqY1lrcPBjWfv24J9//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/67/D9z691ir+DkvzXP1vjnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/7555//Vf6TTAY76EXWW++/c/zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888//w3+k6+H5FNbezH++eeff/75559//vnnn3/+rYl//vm3Jv7559+a+Oeff2vin3/+rYl//vm3Jv7559+a+Oeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/5djH/++Xcx/vnn38X4559/F+Off/5djH/+5346+WpKfvPBS+Wff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++W94LoO/efKt2fvHX/1q/PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz//3yy5t6TgwZ8e/GLrfbnwzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888//6v8S3r4l8S/JP4l8S+Jf0n8S+JfEv+S+JfEvyT+JfEviX9J/EviXxL/Ev+S+JfEvyT+JfEviX9J/EviXxL/kviXxL8k/iXxL4l/SfxL4l8S/5L4l8S/JP4l8S+Jf0n8S+JfEv+S+JfEvyT+JfEviX9J/EviX+JfEv+S+JfEvyT+JfEviX9J/EviXxL/kviXxL8k/iXxL4l/SfxL4l8S/5L4l8S/JP4l8S+Jf0n8S+JfEv+S+JfEvyT+JfEviX9J/EviX+JfEv+S+JfEvyT+JfEviX9J/EviXxL/kviXxL8k/iXxL4l/SfxL4l8S/5L4l8S/JP4l8S+Jf0n8S+JfEv+S+JfEvyT+JfEviX9J/Ev8S+JfEv+S+JfEvyT+JfEviX9J/EviX1JTf2+EVXM80eSAAAAAAElFTkSuQmCC', // Base64 QR code mẫu
            
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
              qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA/8AAAP/CAAAAACzaSOKAAASMElEQVR42u3dwZHjAAwDQeeftByFBILs+XvLFtG65/0eSVf7eQQS/5L4l8S/JP4l8S+Jf0n8S+JfEv+S+JfEvyT+JfEviX9J/EviXxL/kviXxL8k/iXxL4l/SfxL4l8S/5L4l8S/JP4l8S+Jf0n8S+Jf4l8S/5L4l8S/JP4l8S+Jf0n8S+JfEv+S+JfEvyT+JfEviX9J/EviXxL/kviXxL8k/iXxL4l/SfxL4l8S/5L4l8S/JP4l8S+Jf0n8S/xL4l8S/5L4l8S/JP4l8S+Jf0n8S+JfEv+S+JfEvyT+JfEviX9J/EviXxL/kviXxL8k/iXxL4l/SfxL4l8S/5L4l8S/JP4l8S+Jf4l/SfxL4l8S/5L4l8S/JP4l8S+Jf0n8S+JfEv+S+JfEvyT+JfEviX9J/EviXxL/kviXxL8k/iXxL4l/SfxLavL/29qrjyX5zJM/zFr4559/a+Gff/6thX/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnn30X5559/F+Wff/5dlH/++XdR/vnn30X5559/F+XfWvjnn39rOe//mdvki3otWgv//PNvLfzzz7+18M8//9bCP//8Wwv//PNvLfzzzz//ngv//PPvufDPP//8888///zzzz///PPPP//8888///zzzz//Lso///y7KP/88++i/PPPv4vyzz//Lso///y7KP/88++i/FsL/y7Kv7Xw76L8Wwv/Lsq/tfDvovxbC/8uyr+18O+i/FsL/y7Kv7Xw76L8Wwv/Lsq/tfDvm/NvLTf9J6ea/OZPbb3PPPnN+eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/+XZR//vl3Uf75599F+eeff/75559//vnnn3/++bcW/vmvfT145vzzz79nzj///Hvm/Lso//zz76L888+/i/LPP//8888///zzzz///PNvLfzzz7+18M8//9bCP//8888///zzzz///PPPP//8888///zzzz///PPPP//888+/LfLPP/+2yD///Nsi//zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PO/65u/OlXPnH8X5d8z559//j1z/vnnn3/++effWvjnn39r4Z9//q2Ff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn39b5J9//m2Rf/75t0X++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75r30uV5ecZGIt/PPPv7Xwzz//1sI///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zbOf/882/n/PPPv53zzz///Hsu/PPPv+fCP//8ey78888///zzzz///PPPP//8888///zzzz///PPPv4vyzz//Lso///y7KP/88++i/PPPv4vyzz//Lsq/tfDPP//Wwv/Wet8e3nttr0X++fdp/vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75Z5B//vlnkH/++WeQf/75J5h//vknmH/+XZRg/vl3UYL5599FCeaff/59mn/++fdp/vnn36ethX/+fdpa+Offp62Ff/59mn/++fdp/lf5v1pyD8mpDnZwdooeAf/88y/++edf/PPPv/jnn3/xzz//4p9//sU///yLf/75F//88y/++edf/PPPv/jnn3/xzz//4p9//sU///zzzz///PPPP//888+/+Oeff/HPP//in3/+xT///It//vkX//zzL/7551/888+/+Oeff/HPP//in3/+xT///GuW/7X/H/zgx3L1zTX43vzzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888//wvWZKrzljx3TPzzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP/9Oxj///DsZ//zz72T8888///zzzz///PPPP//8888///zzzz///PPPP//8888///wbE//fPLYkE4LbTjJ4ivzzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888//9+8HpJ/fPAP633nujf//PPv3vzzz797828P/PPPvz3wzz//9sA///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzz/9+/8mpJoeebPDQr86Bf/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/7559/B+eeffwfn3xz4/+bgg39YL7KkweRjSf4w/vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/7555//BUte++bqfajmwL+D828O/PPPvznwzz///PPPP//8888///zzzz///PPPP//8888///zzzz+i/PPPP6L8888/ovzzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzz78/zj///Pvj/PPPvz/OP//8888///zzzz///PPPP//8888///zzzz///PPPP//883/e/+A9cNBWcuf8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP/8NyAYb7H1qg4EPFsw///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8r/J/taT/qz8s+fbgX/zzz7/4559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/79MP75598P459//v0w/vnn3w/jn3/+/TD++cfED+Off0z4559/TPjnn39M+Oeff0z451+Y8M+/+Oeff/HPP//in3/+xT///It//vkX//zzL/7551/888+/+Oef/xE3SfbqY1lrcPBjWfv24J9//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/67/D9z691ir+DkvzXP1vjnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/7555//Vf6TTAY76EXWW++/c/zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888//w3+k6+H5FNbezH++eeff/75559//vnnn3/+rYl//vm3Jv7559+a+Oeff2vin3/+rYl//vm3Jv7559+a+Oeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/5djH/++Xcx/vnn38X4559/F+Off/5djH/+5346+WpKfvPBS+Wff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++eeff/75559//vnnn3/++W94LoO/efKt2fvHX/1q/PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz//3yy5t6TgwZ8e/GLrfbnwzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888///zzzz///PPPP//8888//6v8S3r4l8S/JP4l8S+Jf0n8S+JfEv+S+JfEvyT+JfEviX9J/EviXxL/Ev+S+JfEvyT+JfEviX9J/EviXxL/kviXxL8k/iXxL4l/SfxL4l8S/5L4l8S/JP4l8S+Jf0n8S+JfEv+S+JfEvyT+JfEviX9J/EviX+JfEv+S+JfEvyT+JfEviX9J/EviXxL/kviXxL8k/iXxL4l/SfxL4l8S/5L4l8S/JP4l8S+Jf0n8S+JfEv+S+JfEvyT+JfEviX9J/EviX+JfEv+S+JfEvyT+JfEviX9J/EviXxL/kviXxL8k/iXxL4l/SfxL4l8S/5L4l8S/JP4l8S+Jf0n8S+JfEv+S+JfEvyT+JfEviX9J/Ev8S+JfEv+S+JfEvyT+JfEviX9J/EviX1JTf2+EVXM80eSAAAAAAElFTkSuQmCC', // Base64 QR code mẫu
            
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