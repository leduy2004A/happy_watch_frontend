<template>
  <Dialog
    v-model:visible="dialogVisible"
    :modal="true"
    :style="{ width: '90vw', maxWidth: '1500px' }"
    :draggable="false"
    :closable="false"
  >
    <template #header>
      <h3>Dialog</h3>
    </template>

    <div class="grid">
      <!-- Form phiếu giảm giá -->
      <div class="col-12 md:col-5">
        <Card>
          <template #title>
            <h4>Thông tin phiếu giảm giá</h4>
          </template>
          <template #content>
            <div class="grid">
              <div class="col-12">
                <label for="code">Mã phiếu giảm giá</label>
                <InputText id="code" v-model="voucher.code" class="w-full" :disabled="true" />
              </div>
              <div class="col-12">
                <SelectButton v-model="valueSelect" :options="optionsSelect" />
              </div>

              <div
                class="col-12"
                v-if="valueSelect === 'Phần trăm' ? true : false"
              >
                <label for="value">Giá trị</label>
                <div class="p-inputgroup">
                  <InputNumber
                    id="value"
                    v-model="voucher.value"
                    class="w-full"
                  />
                  <span class="p-inputgroup-addon">%</span>
                </div>
              </div>

              <div
                class="col-12"
                v-if="valueSelect === 'Số tiền' ? true : false"
              >
                <label for="maxValue">Giá trị giảm</label>
                <div class="p-inputgroup">
                  <InputNumber
                    id="maxValue"
                    v-model="voucher.maxValue"
                    class="w-full"
                  />
                  <span class="p-inputgroup-addon">đ</span>
                </div>
              </div>

              <!-- <div class="col-6">
                <label for="quantity">Số lượng</label>
                <InputNumber
                  id="quantity"
                  v-model="voucher.quantity"
                  class="w-full"
                />
              </div> -->

              <div class="col-6">
                <label for="startDate">Từ ngày</label>
                <Calendar
                  id="startDate"
                  v-model="voucher.startDate"
                  showTime
                  hourFormat="24"
                  class="w-full"
                />
              </div>

              <div class="col-6">
                <label for="endDate">Đến ngày</label>
                <Calendar
                  id="endDate"
                  v-model="voucher.endDate"
                  showTime
                  hourFormat="24"
                  class="w-full"
                />
              </div>
            </div>
          </template>
        </Card>
      </div>

      <!-- Danh sách khách hàng -->
      <div class="col-12 md:col-7">
        <Card>
          <template #title>
            <div class="flex align-items-center justify-content-between">
              <h4>Danh sách sản phẩm</h4>
              <span class="p-input-icon-left" style="max-width: 300px">
                <i class="pi pi-search" />
                <InputText
                  v-model="search"
                  placeholder="Tìm kiếm khách hàng"
                  class="w-full"
                  @input="handleSearch"
                />
              </span>
            </div>
          </template>

          <template #content>
            <DataTable
              v-model:selection="selected"
              :value="customers"
              :rows="itemsPerPage"
              :paginator="true"
              :loading="loading"
              :rowsPerPageOptions="[5, 10, 15, 20]"
              selectionMode="multiple"
              dataKey="id"
              :filters="filters"
              filterDisplay="menu"
              :globalFilterFields="['name', 'email']"
            >
              <Column
                selectionMode="multiple"
                headerStyle="width: 3rem"
              ></Column>
              <Column
                v-for="col in headers"
                :key="col.key"
                :field="col.key"
                :header="col.title"
                :sortable="true"
              ></Column>
            </DataTable>
          </template>
        </Card>
      </div>
      <div class="col-12">
        <Card>
          <template #title>
            <div class="flex align-items-center justify-content-between">
              <h4>Danh sách Chi tiết sản phẩm</h4>
            </div>
          </template>

          <template #content>
            <DataTable
              v-model:selection="selectedSanPham"
              :value="dataChiTietSanPham"
              :rows="itemsPerPage"
              :paginator="true"
              :loading="loading"
              :rowsPerPageOptions="[5, 10, 15, 20]"
              selectionMode="multiple"
              dataKey="id"
              :filters="filters"
              filterDisplay="menu"
              :globalFilterFields="['name', 'email']"
            >
              <Column
                selectionMode="multiple"
                headerStyle="width: 3rem"
              ></Column>
              <Column field="hinhAnhChiTiet" header="Ảnh" :sortable="false">
                <template #body="slotProps">
                  <img
                    :src="slotProps.data.hinhAnhChiTiet"
                    :alt="slotProps.data.ma"
                    width="70"
                    height="70"
                    style="object-fit: cover"
                  />
                </template>
              </Column>
              <Column field="ma" header="Mã" sortable></Column>
              <Column field="mauSac" header="Màu sắc" sortable></Column>
              <Column field="loaiMay" header="Loại máy" sortable></Column>
              <Column
                field="chatLieuVo"
                header="Chất liệu vỏ"
                sortable
              ></Column>
              <Column
                field="chatLieuDay"
                header="Chất liệu dây"
                sortable
              ></Column>
              <Column field="xuatXu" header="Xuất xứ" sortable></Column>
              <Column field="soLuong" header="Số lượng" sortable></Column>
              <Column field="gia" header="Giá" sortable>
                <template #body="slotProps">
                  {{ formatPrice(slotProps.data.gia) }}
                </template>
              </Column>
              <Column field="giaSauGiam" header="Giá khuyến mãi">
                <template #body="slotProps">
                  <Tag
                    :severity="
                      slotProps.data.giaSauGiam !== null ? 'success' : 'danger'
                    "
                    class="text-sm"
                  >
                    {{
                      slotProps.data.giaSauGiam !== null
                        ? formatPrice(slotProps.data.giaSauGiam)
                        : "Không có khuyến mãi"
                    }}
                  </Tag>
                </template>
              </Column>
            </DataTable>
            <Button label="SỬA" class="mt-3" @click="addNew" />
          </template>
        </Card>
      </div>
    </div>

    <template #footer>
      <Button label="Đóng" @click="closeDialog" class="p-button-secondary" />
    </template>
  </Dialog>
</template>
<script setup>
import { ref, watch, defineProps, reactive, computed, onMounted } from "vue";
import useEmitter from "@/useEmitter";
import { addKhuyenMai } from "@/axios/khuyenmai";
import { useToast } from "vue-toastification";
import { laySanPhamKemSoLuong, layTatCaChiTietTheoSP } from "@/axios/sanpham";
import { updateKhuyenMaiSanPham } from "@/axios/khuyenmai";
import { useVoucherStore } from "@/store/voucherSanPhamStore";
import moment from "moment";
const voucherStore = useVoucherStore();
const toast = useToast();
const emitter = useEmitter();
const idSanPhams = ref([]);
const ididCTSanPhams = ref([]);
const idKhuyenMai = ref(0);
const optionsSelect = ["Phần trăm", "Số tiền"];
const valueSelect = ref("Phần trăm");
const dataProps = defineProps({
  modal: Boolean,
  dataKM: Object,
});
const dataChiTietSanPham = ref([]);
// Dialog visibility
const dialogVisible = ref(dataProps.modal);
watch(
  () => dataProps.modal,
  (newVal) => {
    dialogVisible.value = newVal;
  }
);
watch(
  () => dataProps.dataKM,
  (newVal) => {
    voucher.code = newVal.ma;
    voucher.value = newVal.phanTramGiamGia;
    voucher.startDate = new Date(newVal.ngayBatDau);
    voucher.endDate = new Date(newVal.ngayKetThuc);
    idSanPhams.value = newVal.idSanPhams;
    valueSelect.value = newVal.loaiKhuyenMai === 'so tien' ? 'Số tiền':'Phần trăm' 
    ididCTSanPhams.value = newVal.idCTSanPhams;
    idKhuyenMai.value = newVal.id;
    selected.value = customers.value.filter((item) =>
      idSanPhams.value.includes(item.id)
    );
  }
);

const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

const closeDialog = () => {
  dialogVisible.value = false;
  emitter.emit("close_dialog", false);
};

// Voucher form data
const voucher = reactive({
  code: "",
  name: "",
  value: 0,
  maxValue: 0,
  quantity: 0,
  condition: 0,
  startDate: "",
  endDate: "",
  type: "public",
});
watch(()=> valueSelect.value, (newVal)=>{
  console.log(newVal)
  if(newVal === 'Phần trăm'){
    voucher.maxValue = 0
  }
  else if(newVal === 'Số tiền')
  {
    voucher.value = 0
  }
  else{
    voucher.maxValue = 0
    voucher.value = 0
  }
})
// Table data
const search = ref("");
const selected = ref([]);
const loading = ref(false);
const customers = ref([]);
const currentPage = ref(1);
const itemsPerPage = ref(5);
const totalItems = ref(0);
const selectedSanPham = ref([]);
const headers = [
  { title: "Tên", key: "ten" },
  { title: "Số lượng", key: "soLuong" },
  // { title: 'Ngày sinh', key: 'birthDate' }
];
const dataSanPham = ref([]);
watch(
  () => selected.value,
  async (newVal) => {
    // Dùng Promise.all để đợi tất cả Promise hoàn thành
    dataSanPham.value = await Promise.all(
      newVal.map(async (item) => (await layTatCaChiTietTheoSP(item.id)).data)
    );
    dataChiTietSanPham.value = dataSanPham.value.flat(); // Hoặc sử dụng kết quả nếu cần
    selectedSanPham.value = dataChiTietSanPham.value.filter((item) =>
      ididCTSanPhams.value.includes(item.id)
    );
  }
);

const startIndex = computed(() => {
  return (currentPage.value - 1) * itemsPerPage.value;
});

const endIndex = computed(() => {
  const end = startIndex.value + itemsPerPage.value;
  return Math.min(end, filteredCustomers.value.length);
});

const filteredCustomers = computed(() => {
  if (!search.value) {
    return customers.value;
  }
  return customers.value.filter((customer) => {
    const searchLower = search.value.toLowerCase();
    return (
      customer.name.toLowerCase().includes(searchLower) ||
      customer.phone.includes(searchLower) ||
      customer.email.toLowerCase().includes(searchLower)
    );
  });
});

const handleSearch = () => {
  currentPage.value = 1; // Reset to first page when searching
};

const addNew = async () => {
  const selectedUserIds = selectedSanPham.value.map((SanPham) => SanPham.id);
  // selected.value = customers.value.filter(item => idSanPhams.value.includes(item.id));
  console.log(selectedUserIds);
  const dataAdd = {
    id: idKhuyenMai.value,
    ma: voucher.code,
    // moTa: "Khuyến mãi giảm giá dịp cuối năm",
    loaiKhuyenMai: valueSelect.value === "Phần trăm" ? "phan tram" : "so tien",
    phanTramGiamGia: voucher.value,
    soTienGiam: voucher.maxValue,
    ngayBatDau : moment(voucher.startDate).format('YYYY-MM-DDTHH:mm:ss'),
    ngayKetThuc : moment(voucher.endDate).format('YYYY-MM-DDTHH:mm:ss'),
    // dieuKien: "Áp dụng cho đơn hàng trên 500,000 VNĐ",
    // trangThai: "Đang diễn ra",
    idChiTietSanPham: selectedUserIds,
  };
  try{
      const result = await updateKhuyenMaiSanPham(idKhuyenMai.value, dataAdd);
  if (result.status === 200) {
    toast.success("Sửa khuyến mãi thành công");
    dialogVisible.value = false;
    closeDialog();
    voucherStore.fetchVouchers();
  }
  }catch(e){
    toast.error( e.response.data);
  }

};

// Fetch data
const fetchCustomers = async () => {
  try {
    loading.value = true;
    const result = await laySanPhamKemSoLuong();
    if (result.status === 200) {
      customers.value = result.data;
      totalItems.value = result.data.length;
    }
  } catch (error) {
    console.error("Error fetching customers:", error);
  } finally {
    loading.value = false;
  }
};

// Initialize
onMounted(async () => {
  await fetchCustomers();
});
</script>

<style scoped>
/* Bạn có thể thêm các style tùy chỉnh ở đây nếu cần */
</style>
