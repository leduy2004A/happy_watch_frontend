import { defineStore } from 'pinia';
import { layTrangThaiHoadonTheoMa } from '@/axios/quanlihoadon';
import { chuyenTrangThai } from '@/axios/timeline';
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
    timelineItems: [],
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
      try {
        this.loading = true;
        const response = await chuyenTrangThai(data);
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
      } catch (error) {
        console.error('Lỗi khi tải timeline:', error);
        this.error = error;
      } finally {
        this.loading = false;
      }
    }
  }
});