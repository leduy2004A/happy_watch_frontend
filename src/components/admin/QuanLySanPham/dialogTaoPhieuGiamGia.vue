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
                <InputText id="code" v-model="voucher.code" class="w-full" />
              </div>

              <div class="col-12">
                <label for="name">Tên phiếu giảm giá</label>
                <InputText id="name" v-model="voucher.name" class="w-full" />
              </div>
              <div class="col-12">
                <SelectButton v-model="valueSelect" :options="optionsSelect" />
              </div>
              <div class="col-12" v-if="valueSelect === 'Phần trăm'?true:false">
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

              <div class="col-12" v-if="valueSelect === 'Số tiền'?true:false">
                <label for="maxValue">Giá trị tối đa</label>
                <div class="p-inputgroup">
                  <InputNumber
                    id="maxValue"
                    v-model="voucher.maxValue"
                    class="w-full"
                  />
                  <span class="p-inputgroup-addon">đ</span>
                </div>
              </div>

              <div class="col-6">
                <label for="quantity">Số lượng</label>
                <InputNumber
                  id="quantity"
                  v-model="voucher.quantity"
                  class="w-full"
                />
              </div>

              <div class="col-6">
                <label for="condition">Điều kiện</label>
                <div class="p-inputgroup">
                  <InputNumber
                    id="condition"
                    v-model="voucher.condition"
                    class="w-full"
                  />
                  <span class="p-inputgroup-addon">đ</span>
                </div>
              </div>

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

              <div class="col-12">
                <label class="mb-3">Loại</label>
                <div class="flex gap-4">
                  <div class="field-radiobutton">
                    <RadioButton
                      id="public"
                      v-model="voucher.type"
                      value="public"
                    />
                    <label for="public">Công khai</label>
                  </div>
                  <div class="field-radiobutton">
                    <RadioButton
                      id="private"
                      v-model="voucher.type"
                      value="private"
                    />
                    <label for="private">Cá nhân</label>
                  </div>
                </div>
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
              <h4>Danh sách khách hàng</h4>
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

            <Button label="THÊM MỚI" class="mt-3" @click="addNew" />
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
import { layTatCaKhachHang } from "@/axios/sanpham";
import { addKhuyenMai } from "@/axios/khuyenmai";
import { sendMail } from "@/axios/email";
import { useVoucherHoaDonStore } from "@/store/voucherHoaDonStore";
const voucherStore = useVoucherHoaDonStore();
import { useToast } from "vue-toastification";
import moment from "moment";
const toast = useToast();
const emitter = useEmitter();
const dataProps = defineProps({
  modal: Boolean,
});
const optionsSelect = ['Phần trăm','Số tiền']
const valueSelect = ref('Phần trăm')
// Dialog visibility
const dialogVisible = ref(dataProps.modal);
watch(
  () => dataProps.modal,
  (newVal) => {
    dialogVisible.value = newVal;
  }
);

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
  startDate: new Date(),
  endDate: new Date(),
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

const headers = [
  { title: "Tên", key: "ten" },
  { title: "Số điện thoại", key: "dienThoai" },
  { title: "Email", key: "email" },
  // { title: 'Ngày sinh', key: 'birthDate' }
];

// Computed properties for pagination
const totalPages = computed(() => {
  return Math.ceil(filteredCustomers.value.length / itemsPerPage.value);
});

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

const paginatedCustomers = computed(() => {
  return filteredCustomers.value.slice(startIndex.value, endIndex.value);
});

// Methods
const handlePageChange = (page) => {
  currentPage.value = page;
};

const handleItemsPerPageChange = () => {
  currentPage.value = 1; // Reset to first page when changing items per page
};

const handleSearch = () => {
  currentPage.value = 1; // Reset to first page when searching
};

const isItemSelectable = (item) => {
  return true;
};

const addNew = async () => {
  console.log("Add new customer");
  if (voucher.type === "public") {
    const dataAdd = {
      // id: 1,
      ma: voucher.code,
      ten: voucher.name,
      // loaiKhuyenMai: "phan tram",
      phanTramGiamGia: voucher.value,
      soTienGiam: voucher.maxValue,
      ngayBatDau : moment(voucher.startDate).format('YYYY-MM-DDTHH:mm:ss'),
      ngayKetThuc : moment(voucher.endDate).format('YYYY-MM-DDTHH:mm:ss'),
      loaiKhuyenMai: valueSelect.value === "Phần trăm" ? "phan tram" : "so tien",
      soLuong: voucher.quantity,
      // dieuKien: "Áp dụng cho đơn hàng trên 500k",
      khuyenMaiTuGia: voucher.condition,
      // trangThai: "Đang chờ duyệt",
      loaiApDung: "TOAN_BO",
      // userIds: [1, 2, 3],
    };
    try{
          const result = await addKhuyenMai(dataAdd);
    if (result.status === 201) {
      voucherStore.fetchVouchers();
      closeDialog();
      toast.success("Thêm khuyến mãi thành công");
    }
    }catch(e){
      toast.error( e.response.data.message);
    }

  } else {
    console.log(selected.value);
    const selectedUserIds = selected.value.map((customer) => customer.id);
    const emailList = selected.value.map((customer) => customer.email);
    const dataAdd = {
      // id: 1,
      ma: voucher.code,
      ten: voucher.name,
      // loaiKhuyenMai: "phan tram",
      phanTramGiamGia: voucher.value,
      soTienGiam: voucher.maxValue,
       ngayBatDau : moment(voucher.startDate).format('YYYY-MM-DDTHH:mm:ss'),
       ngayKetThuc : moment(voucher.endDate).format('YYYY-MM-DDTHH:mm:ss'),
      loaiKhuyenMai: valueSelect.value === "Phần trăm" ? "phan tram" : "so tien",
      soLuong: voucher.quantity,
      // dieuKien: "Áp dụng cho đơn hàng trên 500k",
      khuyenMaiTuGia: voucher.condition,
      // trangThai: "Còn hiệu lực",
      loaiApDung: "CA_NHAN",
      userIds: selectedUserIds,
    };
    try{
          const result = await addKhuyenMai(dataAdd);
    if (result.status === 201) {
      voucherStore.fetchVouchers();
      toast.success("Thêm khuyến mãi thành công");
      closeDialog();
      try {
        const promises = emailList.map((email) => sendMail(dataAdd, email));
        const results = await Promise.all(promises);

        // Kiểm tra nếu tất cả email đều gửi thành công
        if (results.every((result) => result.status === 200)) {
          toast.success("Gửi mail thành công");
        }
      } catch (error) {
        toast.error("Có lỗi xảy ra khi gửi mail");
      }
    }
    }catch(e){
      toast.error( e.response.data.message);
    }

  }
};

// Fetch data
const fetchCustomers = async () => {
  try {
    loading.value = true;
    const result = await layTatCaKhachHang();
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
