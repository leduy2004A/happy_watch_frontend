<template>
  <div class="card">
    <TabMenu 
      :model="items" 
      :activeIndex="activeTab" 
      @tab-change="handleTabChange" 
    />
    
    <div class="coupon-container mt-3">
      <!-- Hiển thị phiếu giảm giá công khai -->
      <div v-if="activeTab === 0">
        <div v-for="code in maKhuyenMaiCongKhai" :key="code.id" class="code-card">
        <div class="code-info">
          <div class="discount-text">{{ code.ten }}</div>
          <div class="code">{{ code.ma }}</div>
          <div class="expiry">Khuyến mãi từ giá: {{ formatPrice(code.khuyenMaiTuGia)  }}</div>
          <div class="expiry">Số giảm: {{ code.phanTramGiamGia + '%'||code.soTienGiam   }}</div>
          <div class="expiry">HSD: {{ formatDate(code.ngayBatDau) }} - {{ formatDate(code.ngayKetThuc) }}</div>
        </div>
      </div>
      </div>

      <!-- Hiển thị phiếu giảm giá cá nhân -->
      <div v-if="activeTab === 1">

      <div v-for="code in maKhuyenMaiCaNhan" :key="code.id" class="code-card">
        <div class="code-info">
          <div class="discount-text">{{ code.ten }}</div>
          <div class="code">{{ code.ma }}</div>
          <div class="expiry">Khuyến mãi từ giá: {{formatPrice(code.khuyenMaiTuGia)  }}</div>
          <div class="expiry">Số giảm: {{ code.phanTramGiamGia + '%'||code.soTienGiam   }}</div>
          <div class="expiry">HSD: {{ formatDate(code.ngayBatDau) }} - {{ formatDate(code.ngayKetThuc) }}</div>
        </div>
    
    </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref,onMounted } from 'vue'
import { getKhuyenMaiCongKhai,getKhuyenMaiCaNhan } from '@/axios/giamGia';
const activeTab = ref(0) // Tab đang hoạt động

const items = [
  { label: 'CÔNG KHAI' },
  { label: 'CÁ NHÂN' }
]
const maKhuyenMaiCongKhai = ref([])
const maKhuyenMaiCaNhan = ref([])
const publicCoupons = ref([
  {
    id: 1,
    value: '10%',
    maxAmount: '400,000',
    minAmount: '1,200,000'
  },
  {
    id: 2,
    value: '15%',
    maxAmount: '500,000',
    minAmount: '1,500,000'
  }
])

const personalCoupons = ref([
  {
    id: 3,
    value: '20%',
    maxAmount: '600,000',
    minAmount: '2,000,000'
  },
  {
    id: 4,
    value: '25%',
    maxAmount: '800,000',
    minAmount: '2,500,000'
  }
])
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };
// Xử lý sự kiện thay đổi tab
const handleTabChange = (event) => {
  activeTab.value = event.index
}

// Xử lý xem thông tin phiếu giảm giá
const viewCoupon = (coupon) => {
  console.log('View coupon:', coupon)
}
onMounted(async ()=>{
  const result = await getKhuyenMaiCongKhai()
  const resutlCaNhan = await getKhuyenMaiCaNhan()
  if(result.status === 200)
  {
    maKhuyenMaiCongKhai.value = result.data.map((code) => ({
      ...code,
      selected: false
    }));
    console.log(maKhuyenMaiCongKhai.value)
  }
  if(resutlCaNhan.status === 200)
  {
    maKhuyenMaiCaNhan.value = resutlCaNhan.data.map((code) => ({
      ...code,
      selected: false
    }));
  }
})
</script>

<style scoped>
.coupon-container {
  max-width: 600px;
}

.brand-logo {
  display: flex;
  align-items: center;
  min-width: 120px;
}

.coupon-details {
  line-height: 1.5;
}
.code-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 1rem;
}
.promotion-codes {
  padding: 1rem;
  max-width: 700px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.section {
  margin-bottom: 1.5rem;
}

.section h3 {
  color: #666;
  margin-bottom: 1rem;
}

.code-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.code-info {
  flex: 1;
}

.discount-text {
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.code {
  color: #2196F3;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.expiry {
  font-size: 0.8rem;
  color: #666;
}

.continue-btn {
  width: 100%;
  margin-top: 1rem;
}
</style>
