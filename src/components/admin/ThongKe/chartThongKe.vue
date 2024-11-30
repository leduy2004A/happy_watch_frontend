<template>
    <div v-if="loading" class="loading-container">
    <ProgressSpinner />
    <span>Đang tải dữ liệu...</span>
  </div>

  <div v-else>
      <div class="grid">
    <!-- Hôm nay -->
    <div class="col-12 md:col-6 lg:col-6 bg-green">
      <div class="surface-card shadow-2 p-3 border-round">
        <div class="flex justify-content-between mb-3">
          <div>
            <span class="block text-500 font-medium mb-3">Hôm nay</span>
            <div class="text-900 font-medium text-xl">{{formatCurrency(thongKeHomNay.tongDoanhThu) }}</div>
          </div>
          <div class="flex align-items-center justify-content-center bg-cyan-100 border-round" style="width:2.5rem;height:2.5rem">
            <i class="pi pi-calendar text-cyan-500 text-xl"></i>
          </div>
        </div>
        <div class="grid">
          <div class="col-3">
            <span class="text-500 font-medium">Sản phẩm</span>
            <div class="text-900 font-medium">{{ thongKeHomNay.tongSoLuongSanPhamDaBan }}</div>
          </div>
          <div class="col-3">
            <span class="text-500 font-medium">Đơn thành công</span>
            <div class="text-900 font-medium">{{ thongKeHomNay.tongSoLuongHoaDonHoanThanh }}</div>
          </div>
          <div class="col-3">
            <span class="text-500 font-medium">Đơn hủy</span>
            <div class="text-900 font-medium">{{ thongKeHomNay.tongSoLuongHoaDonHuy }}</div>
          </div>
          <div class="col-3">
            <span class="text-500 font-medium">Đơn trả</span>
            <div class="text-900 font-medium">{{ thongKeHomNay.tongSoLuongHoaDonTraHang }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tuần này -->
    <div class="col-12 md:col-6 lg:col-6 bg-orange">
      <div class="surface-card shadow-2 p-3 border-round">
        <div class="flex justify-content-between mb-3">
          <div>
            <span class="block text-500 font-medium mb-3">Tuần này</span>
            <div class="text-900 font-medium text-xl">{{ formatCurrency(thongKeTuanNay.tongDoanhThu) }}</div>
          </div>
          <div class="flex align-items-center justify-content-center bg-orange-100 border-round" style="width:2.5rem;height:2.5rem">
            <i class="pi pi-copy text-orange-500 text-xl"></i>
          </div>
        </div>
        <div class="grid">
          <div class="col-3">
            <span class="text-500 font-medium">Sản phẩm</span>
            <div class="text-900 font-medium">{{ thongKeTuanNay.tongSoLuongSanPhamDaBan }}</div>
          </div>
          <div class="col-3">
            <span class="text-500 font-medium">Đơn thành công</span>
            <div class="text-900 font-medium">{{ thongKeTuanNay.tongSoLuongHoaDonHoanThanh }}</div>
          </div>
          <div class="col-3">
            <span class="text-500 font-medium">Đơn hủy</span>
            <div class="text-900 font-medium">{{ thongKeTuanNay.tongSoLuongHoaDonHuy }}</div>
          </div>
          <div class="col-3">
            <span class="text-500 font-medium">Đơn trả</span>
            <div class="text-900 font-medium">{{ thongKeTuanNay.tongSoLuongHoaDonTraHang }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tháng này -->
    <div class="col-12 md:col-6 lg:col-6 bg-orange">
      <div class="surface-card shadow-2 p-3 border-round">
        <div class="flex justify-content-between mb-3">
          <div>
            <span class="block text-500 font-medium mb-3">Tháng này</span>
            <div class="text-900 font-medium text-xl">{{ formatCurrency(thongKeThangNay.tongDoanhThu) }}</div>
          </div>
          <div class="flex align-items-center justify-content-center bg-blue-100 border-round" style="width:2.5rem;height:2.5rem">
            <i class="pi pi-calendar text-blue-500 text-xl"></i>
          </div>
        </div>
        <div class="grid">
          <div class="col-3">
            <span class="text-500 font-medium">Sản phẩm</span>
            <div class="text-900 font-medium">{{ thongKeThangNay.tongSoLuongSanPhamDaBan }}</div>
          </div>
          <div class="col-3">
            <span class="text-500 font-medium">Đơn thành công</span>
            <div class="text-900 font-medium">{{ thongKeThangNay.tongSoLuongHoaDonHoanThanh }}</div>
          </div>
          <div class="col-3">
            <span class="text-500 font-medium">Đơn hủy</span>
            <div class="text-900 font-medium">{{ thongKeThangNay.tongSoLuongHoaDonHuy }}</div>
          </div>
          <div class="col-3">
            <span class="text-500 font-medium">Đơn trả</span>
            <div class="text-900 font-medium">{{ thongKeThangNay.tongSoLuongHoaDonTraHang }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Năm nay -->
    <div class="col-12 md:col-6 lg:col-6 bg-pink">
      <div class="surface-card shadow-2 p-3 border-round">
        <div class="flex justify-content-between mb-3">
          <div>
            <span class="block text-500 font-medium mb-3">Năm nay</span>
            <div class="text-900 font-medium text-xl">{{ formatCurrency(thongKeTheoNam.tongDoanhThu) }}</div>
          </div>
          <div class="flex align-items-center justify-content-center bg-green-100 border-round" style="width:2.5rem;height:2.5rem">
            <i class="pi pi-chart-bar text-green-500 text-xl"></i>
          </div>
        </div>
        <div class="grid">
          <div class="col-3">
            <span class="text-500 font-medium">Sản phẩm</span>
            <div class="text-900 font-medium">{{ thongKeTheoNam.tongSoLuongSanPhamDaBan }}</div>
          </div>
          <div class="col-3">
            <span class="text-500 font-medium">Đơn thành công</span>
            <div class="text-900 font-medium">{{ thongKeTheoNam.tongSoLuongHoaDonHoanThanh }}</div>
          </div>
          <div class="col-3">
            <span class="text-500 font-medium">Đơn hủy</span>
            <div class="text-900 font-medium">{{ thongKeTheoNam.tongSoLuongHoaDonHuy }}</div>
          </div>
          <div class="col-3">
            <span class="text-500 font-medium">Đơn trả</span>
            <div class="text-900 font-medium">{{ thongKeTheoNam.tongSoLuongHoaDonTraHang }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>







    <div class="grid">
      <!-- Revenue Cards -->
  
      <!-- Charts -->
      <div class="col-12 md:col-6 lg:col-6">
        <div class="card">
          <h5>Doanh Thu</h5>
          <Chart type="bar" :data="revenueData" :options="chartOptions" />
        </div>
      </div>
  
      <div class="col-12 md:col-6 lg:col-6">
        <div class="card">
          <h5>Đơn Hàng</h5>
          <Chart type="line" :data="orderData" :options="chartOptions" />
        </div>
      </div>
  
      <div class="col-12 md:col-6 lg:col-6">
        <div class="card">
          <h5>Trạng Thái Đơn Hàng</h5>
          <Chart type="pie" :data="orderStatusData" :options="pieOptions" />
        </div>
      </div>
  
      <div class="col-12 md:col-6 lg:col-6">
        <div class="card">
          <h5>Đơn huỷ</h5>
          <Chart type="line" :data="huyData" :options="chartOptions" />
        </div>
      </div>
      <div class="col-12 md:col-6 lg:col-6">
        <div class="card">
          <h5>Đơn trả</h5>
          <Chart type="line" :data="traHangData" :options="chartOptions" />
        </div>
      </div>
      <!-- <div class="col-12 md:col-6 lg:col-3">
        <div class="card mb-0">
          <div class="flex justify-content-between mb-3">
            <div>
              <span class="block text-500 font-medium mb-3">Hôm nay</span>
              <div class="text-900 font-medium text-xl">6,040,253 đ</div>
            </div>
            <div class="flex align-items-center justify-content-center bg-cyan-100 border-round" style="width:2.5rem;height:2.5rem">
              <i class="pi pi-calendar text-cyan-500 text-xl"></i>
            </div>
          </div>
          <span class="text-500">{{ today.products }} sản phẩm</span>
        </div>
      </div>
  
      <div class="col-12 md:col-6 lg:col-3">
        <div class="card mb-0">
          <div class="flex justify-content-between mb-3">
            <div>
              <span class="block text-500 font-medium mb-3">Tuần này</span>
              <div class="text-900 font-medium text-xl">8,834,904 đ</div>
            </div>
            <div class="flex align-items-center justify-content-center bg-orange-100 border-round" style="width:2.5rem;height:2.5rem">
              <i class="pi pi-calendar-plus text-orange-500 text-xl"></i>
            </div>
          </div>
          <span class="text-500">{{ week.products }} sản phẩm</span>
        </div>
      </div> -->
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import ProgressSpinner from 'primevue/progressspinner';
  import Chart from 'primevue/chart';
  import { getThongKeHomNay,getThongKeTuanNay,getThongKeThangNay,getThongKeTheoNam } from '@/axios/thongKe';
  const thongKeHomNay = ref(null);
const thongKeTuanNay = ref(null);
const thongKeThangNay = ref(null);
const thongKeTheoNam = ref(null);
const doanhThu = ref([])
const donHoanThanh = ref([])
const donHuy = ref([])
const donTra = ref([])
const trangThaiDonHang = ref([])
// Hàm gọi API


    const month = ref({
      revenue: 8834904,
      products: 37,
      successOrders: 6,
      canceledOrders: 1,
      returnedOrders: 2
    })

    const year = ref({
      revenue: 8834904,
      products: 37,
      successOrders: 6,
      canceledOrders: 1,
      returnedOrders: 2
    })
    const formatCurrency = (value) => {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(value).replace('₫', 'đ')
    }

    const loading = ref(true);

// Rest of your existing script code...

const fetchData = async () => {
  try {
    loading.value = true;
    // Gọi từng API và lưu kết quả vào các biến tương ứng
    thongKeHomNay.value = (await getThongKeHomNay()).data;
    thongKeTuanNay.value = (await getThongKeTuanNay()).data;
    thongKeThangNay.value = (await getThongKeThangNay()).data;
    thongKeTheoNam.value = (await getThongKeTheoNam()).data;
    doanhThu.value = [thongKeHomNay.value.tongDoanhThu, thongKeTuanNay.value.tongDoanhThu, thongKeThangNay.value.tongDoanhThu, thongKeTheoNam.value.tongDoanhThu];
    donHoanThanh.value = [thongKeHomNay.value.tongSoLuongHoaDonHoanThanh, thongKeTuanNay.value.tongSoLuongHoaDonHoanThanh, thongKeThangNay.value.tongSoLuongHoaDonHoanThanh, thongKeTheoNam.value.tongSoLuongHoaDonHoanThanh];
    trangThaiDonHang.value = [thongKeTheoNam.value.tongSoLuongHoaDonHoanThanh, thongKeTheoNam.value.tongSoLuongHoaDonHuy, thongKeTheoNam.value.tongSoLuongHoaDonTraHang];
    donHuy.value = [thongKeHomNay.value.tongSoLuongHoaDonHuy, thongKeTuanNay.value.tongSoLuongHoaDonHuy, thongKeThangNay.value.tongSoLuongHoaDonHuy, thongKeTheoNam.value.tongSoLuongHoaDonHuy];
    donTra.value = [thongKeHomNay.value.tongSoLuongHoaDonTraHang, thongKeTuanNay.value.tongSoLuongHoaDonTraHang, thongKeThangNay.value.tongSoLuongHoaDonTraHang, thongKeTheoNam.value.tongSoLuongHoaDonTraHang];
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu thống kê:', error);
  } finally {
    loading.value = false;
  }
};


// Gọi hàm fetchData khi component được gắn vào DOM
onMounted(() => {
  fetchData();
});
  const today = ref({
    revenue: 6040253,
    products: 21,
    successOrders: 2,
    cancelOrders: 0,
    returnOrders: 1
  });
  
  const week = ref({
    revenue: 8834904,
    products: 37,
    successOrders: 6,
    cancelOrders: 1,
    returnOrders: 2
  });
  
  // Chart Data
  const revenueData = ref({
    labels: ['Hôm nay', 'Tuần này', 'Tháng này', 'Năm nay'],
    datasets: [
      {
        label: 'Doanh thu',
        data: doanhThu,
        backgroundColor: ['#00ACC1', '#FB8C00', '#3F51B5', '#4CAF50'],
        borderRadius: 6
      }
    ]
  });
  
  const orderData = ref({
    labels: ['Hôm nay', 'Tuần này', 'Tháng này', 'Năm nay'],
    datasets: [
      {
        label: 'Đơn thành công',
        data: donHoanThanh,
        borderColor: '#4CAF50',
        tension: 0.4
      }
    ]
  });

  const huyData = ref({
    labels: ['Hôm nay', 'Tuần này', 'Tháng này', 'Năm nay'],
    datasets: [
      {
        label: 'Đơn huỷ',
        data: donHuy,
        borderColor: 'red',
        tension: 0.4
      }
    ]
  });
  
  const traHangData = ref({
    labels: ['Hôm nay', 'Tuần này', 'Tháng này', 'Năm nay'],
    datasets: [
      {
        label: 'Đơn trả',
        data: donTra,
        borderColor: 'yellow',
        tension: 0.4
      }
    ]
  });
  const orderStatusData = ref({
    labels: ['Đơn thành công', 'Đơn hủy', 'Đơn trả'],
    datasets: [
      {
        data: trangThaiDonHang,
        backgroundColor: ['#4CAF50', '#FF5252', '#FFA726']
      }
    ]
  });
  
  const productData = ref({
    labels: ['Hôm nay', 'Các ngày khác'],
    datasets: [
      {
        data: [21, 16],
        backgroundColor: ['#7E57C2', '#26A69A']
      }
    ]
  });
  
  // Chart Options
  const chartOptions = ref({
    plugins: {
      legend: {
        position: 'bottom'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    },
    responsive: true,
    maintainAspectRatio: false
  });
  
  const pieOptions = ref({
    plugins: {
      legend: {
        position: 'bottom'
      }
    },
    responsive: true,
    maintainAspectRatio: false
  });
  </script>
  
  <style scoped>
  .card {
    background: var(--surface-card);
    padding: 1.5rem;
    margin-bottom: 1rem;
    border-radius: 12px;
    box-shadow: 0px 3px 5px rgba(0,0,0,.02), 0px 0px 2px rgba(0,0,0,.05), 0px 1px 4px rgba(0,0,0,.08);
  }
  
  :deep(.p-chart) {
    min-height: 300px;
  }
  </style>