<template>
  <div class="card">
    <!-- Filter Section -->
    <div class="filter-section mb-4">
      <div class="p-buttonset">
        <Button
          label="NGÀY"
          @click="setFilterType('day')"
          :class="{ 'p-button-outlined': filterType !== 'day' }"
        />
        <Button
          label="TUẦN"
          @click="setFilterType('week')"
          :class="{ 'p-button-outlined': filterType !== 'week' }"
        />
        <Button
          label="THÁNG"
          @click="setFilterType('month')"
          :class="{ 'p-button-outlined': filterType !== 'month' }"
        />
        <Button
          label="NĂM"
          @click="setFilterType('year')"
          :class="{ 'p-button-outlined': filterType !== 'year' }"
        />
        <Button
          label="TÙY CHỈNH"
          @click="setFilterType('custom')"
          :class="{ 'p-button-outlined': filterType !== 'custom' }"
        />
      </div>

      <div class="date-filters mt-3" v-if="filterType === 'custom'">
        <Calendar v-model="dateRange.from" placeholder="Từ ngày" class="mr-2" />
        <Calendar v-model="dateRange.to" placeholder="Đến ngày" />
        <Button
          label="EXPORT TO EXCEL"
          icon="pi pi-file-excel"
          class="p-button-success ml-2"
          @click="exportToExcel"
        />
      </div>
    </div>
    <div class="ban-chay">
      <div class="">
        <h4>Danh sách sản phẩm bán chạy</h4>
        <DataTable
          :value="products"
          :paginator="true"
          :rows="5"
          responsive-layout="scroll"
          striped-rows
          class="p-datatable-lg"
          v-model:filters="filters"
        >
          <Column field="image" header="Ảnh" style="width: 100px">
            <template #body="slotProps">
              <img
                :src="slotProps.data.urlImages"
                :alt="slotProps.data.name"
                width="50"
              />
            </template>
          </Column>
          <Column field="maCTSP" header="Tên sản phẩm" sortable>
            <template #filter="{ filterModel, filterCallback }">
              <InputText
                v-model="filterModel.value"
                @input="filterCallback()"
                placeholder="Tìm theo tên"
              />
            </template>
            <template #body="slotProps">
              {{ slotProps.data.ten }}
            </template>
          </Column>
          <Column field="tongSoLuong" header="Số lượng đã bán" sortable />
          <Column field="giaSanPham" header="Giá tiền" sortable>
            <template #body="slotProps">
              {{ formatCurrency(slotProps.data.giaSanPham) }}
            </template>
          </Column>
        </DataTable>
      </div>

      <!-- Status Chart -->
      <div class="chart-section mt-4 chart">
        <h3>Biểu đồ trạng thái tùy chỉnh</h3>
        <Chart
          type="pie"
          :data="chartData"
          :options="chartOptions"
          style="width: 400px"
        />
      </div>
    </div>
    <!-- Products Table -->
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import {
  getThongKeHomNaySanPham,
  getThongKeThangNaySanPham,
  getThongKeTuanNaySanPham,
  getThongKeTheoNamSanPham,
  getThongKeHomNaySanPhamPhanTram,
  getThongKeThangNaySanPhamPhanTram,
  getThongKeTuanNaySanPhamPhanTram,
  getThongKeTheoNamSanPhamPhanTram,
} from "@/axios/thongKe";
// Danh sách sản phẩm giả lập
const products = ref([
  {
    image: "/path-to-image/balen-grey.jpg",
    name: "Balen Grey 2023 - Tím - Bạc - Đế nhựa - Giày lười - Balenciaga",
    quantity: 18,
    price: 550000,
    size: "40,41,42",
  },
  {
    image: "/path-to-image/nike-air.jpg",
    name: "Nike Air Force 1 - Trắng - Da - Giày thể thao",
    quantity: 25,
    price: 3200000,
    size: "38,39,40,41",
  },
  {
    image: "/path-to-image/adidas-ultra.jpg",
    name: "Adidas Ultra Boost - Đen - Dệt kim - Giày chạy bộ",
    quantity: 10,
    price: 4200000,
    size: "40,41,42,43",
  },
  {
    image: "/path-to-image/converse-classic.jpg",
    name: "Converse Classic - Đỏ - Vải - Giày cổ cao",
    quantity: 50,
    price: 900000,
    size: "37,38,39,40",
  },
  {
    image: "/path-to-image/vans-old-skool.jpg",
    name: "Vans Old Skool - Đen Trắng - Vải - Giày trượt ván",
    quantity: 15,
    price: 1100000,
    size: "38,39,40,41,42",
  },
]);

// Biến trạng thái
const filterType = ref("day");
const dateRange = ref({
  from: new Date(),
  to: null,
});

// Bộ lọc
const filters = ref({
  name: { value: null, matchMode: "contains" },
  price: { value: null, matchMode: "gte" },
  quantity: { value: null, matchMode: "gte" },
});
const dataBieuDo = ref([])
const dataTenBieuDo = ref([])
// Dữ liệu biểu đồ
const chartData = ref({
  labels:[],
  datasets: [
    {
      data: [],
      backgroundColor: [
        "#FF6384",
        "#FF9F40",
        "#FFCD56",
        "#4BC0C0",
        "#36A2EB",
        "#9966FF",
        "#00CC66",
        "#C9CBCF",
        "red",
      ],
    },
  ],
});

const chartOptions = {
  plugins: {
    legend: {
      position: "right",
      display: true,
      labels: {
        font: {
          size: 9
        },
        usePointStyle: true
      }
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          return context.label + ': ' + context.raw + '%';
        }
      }
    }
  },
  responsive: true,
  maintainAspectRatio: true
};
// Hàm thiết lập loại bộ lọc
const setFilterType = async (type) => {
  console.log(type);
  filterType.value = type;
  if (type === "day") {
    products.value = (await getThongKeHomNaySanPham()).data;
    console.log(products.value);
    const resultBieuDo = await (getThongKeHomNaySanPhamPhanTram())
    chartData.value.labels = resultBieuDo.data.map(item => item.trangThaiTiengViet)
    chartData.value.datasets[0].data = resultBieuDo.data.map(item => item.phanTram)
  } else if (type === "year") {
    products.value = (await getThongKeTheoNamSanPham()).data;
    const resultBieuDo = await (getThongKeTheoNamSanPhamPhanTram())
    chartData.value.labels = resultBieuDo.data.map(item => item.trangThaiTiengViet)
    chartData.value.datasets[0].data = resultBieuDo.data.map(item => item.phanTram)
  } else if (type === "month") {
    products.value = (await getThongKeThangNaySanPham()).data;
    const resultBieuDo = await (getThongKeThangNaySanPhamPhanTram())
    chartData.value.labels = resultBieuDo.data.map(item => item.trangThaiTiengViet)
    chartData.value.datasets[0].data = resultBieuDo.data.map(item => item.phanTram)
  } else if (type === "week") {
    products.value = (await getThongKeTuanNaySanPham()).data;
    const resultBieuDo = await (getThongKeTuanNaySanPhamPhanTram())
    chartData.value.labels = resultBieuDo.data.map(item => item.trangThaiTiengViet)
    chartData.value.datasets[0].data = resultBieuDo.data.map(item => item.phanTram)
  } else if (type === "custom") {
    products.value = (await getThongKeTuanNaySanPham()).data;
    console.log(dateRange.value.from.toISOString);
  }
};
onMounted(async () => {
  products.value = (await getThongKeHomNaySanPham()).data;
  const resultBieuDo = await (getThongKeHomNaySanPhamPhanTram())
    chartData.value.labels = resultBieuDo.data.map(item => item.trangThaiTiengViet)
    chartData.value.datasets[0].data = resultBieuDo.data.map(item => item.phanTram)
});
// Định dạng tiền tệ
const formatCurrency = (value) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

// Xuất dữ liệu sang Excel
const exportToExcel = () => {
  console.log("Export to Excel!");
};
</script>

<style scoped>
.filter-section {
  margin-bottom: 2rem;
}

.date-filters {
  display: flex;
  align-items: center;
  margin-top: 1rem;
}

.chart-section {
  margin-top: 2rem;
}

:deep(.p-button) {
  margin-right: 0.5rem;
}

:deep(.p-datatable) {
  margin-top: 1rem;
}
.ban-chay {
  display: flex;
  justify-content: space-between;
}
.chart {
  justify-self: center;
}
</style>
