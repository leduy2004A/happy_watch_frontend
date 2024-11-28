<template>
  <div class="card px-10 py-10">
    <!-- Header Controls -->
    <div class="flex justify-content-between mb-3">
      <div class="flex gap-2">
        <Dropdown
          v-model="filters.gender"
          :options="genderOptions"
          placeholder="Giới tính"
          class="w-10rem"
        />
        <Dropdown
          v-model="filters.position"
          :options="positionOptions"
          placeholder="Chức vụ"
          class="w-10rem"
        />
        <Dropdown
          v-model="filters.status"
          :options="statusOptions"
          placeholder="Trạng thái"
          class="w-10rem"
        />
        <Button
          label="XUẤT EXCEL"
          icon="pi pi-file-excel"
          @click="exportExcel"
        />
      </div>
      <div>
        <Button
          label="TẠO NHÂN VIÊN"
          icon="pi pi-plus"
          severity="success"
          @click="openNewDialog"
        />
      </div>
    </div>

    <!-- Search Input -->
    <div class="flex justify-content-between mb-3">
      <span class="p-input-icon-left flex-grow-1">
        <InputText
          v-model="filters.search"
          placeholder="Tên hoặc sđt hoặc email"
          class="w-full"
        />
      </span>
    </div>

    <!-- Data Table -->
    <DataTable
      :value="filteredEmployees"
      :paginator="true"
      :rows="5"
      :rowsPerPageOptions="[5, 10, 20]"
      responsiveLayout="scroll"
    >
      <Column field="stt" header="STT" style="width: 5%">
        <template #body="{ index }">
          {{ index + 1 }}
        </template>
      </Column>
      <Column field="avatar" header="Ảnh" style="width: 10%">
        <template #body="{ data }">
          <Avatar :image="data.avatar" size="large" shape="circle" />
        </template>
      </Column>
      <Column field="ten" header="Họ và tên" style="width: 15%" />
      <Column field="email" header="Email" style="width: 20%" />
      <Column field="dienThoai" header="SĐT" style="width: 10%" />
      <Column field="gioiTinh" header="Giới tính" style="width: 10%" />
      <Column field="trangThai" header="Trạng thái" style="width: 10%">
        <template #body="{ data }">
          <Tag
            :severity="data.trangThai === true ? 'success' : 'danger'"
            :value="data.trangThai"
          />
        </template>
      </Column>
      <Column header="Thao tác" style="width: 10%">
        <template #body="{ data }">
          <Button
            icon="pi pi-pencil"
            rounded
            text
            severity="info"
            @click="editEmployee(data)"
          />
        </template>
      </Column>
    </DataTable>

    <!-- Dialog Form -->
    <Dialog
      v-model:visible="dialogVisible"
      :header="dialogHeader"
      modal
      class="w-11 md:w-6"
    >
      <Avatar
        :image="image || employee.avatar"
        class="mr-2"
        size="xlarge"
        shape="circle"
        v-model="employee.avatar"
        @click="themAnh()"
      />
      <div class="grid">
        <div class="field col-12 md:col-6">
          <label for="fullName">Họ và tên</label>
          <InputText id="fullName" v-model="employee.ten" class="w-full" />
        </div>
        <div class="field col-12 md:col-6">
          <label for="email">Email</label>
          <InputText
            id="email"
            v-model="employee.email"
            type="email"
            class="w-full"
          />
        </div>
        <div class="field col-12 md:col-6">
          <label for="phone">Số điện thoại</label>
          <InputText id="phone" v-model="employee.dienThoai" class="w-full" />
        </div>

        <div class="field col-12 md:col-6">
          <label for="gender">Giới tính</label>
          <Dropdown
            id="gender"
            v-model="employee.gioiTinh"
            :options="genderOptions"
            class="w-full"
          />
        </div>
        <!-- <div class="field col-12 md:col-6">
          <label for="status">Trạng thái</label>
          <Dropdown
            id="status"
            v-model="employee.trangThai"
            :options="statusOptions"
            class="w-full"
          />
        </div> -->
      </div>
      <template #footer>
        <Button label="Hủy" icon="pi pi-times" text @click="closeDialog" />
        <Button label="Lưu" icon="pi pi-check" @click="saveEmployee" />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useToast } from "vue-toastification";
import { getNhanVien, addNhanVien,updateNhanVien } from "@/axios/sanpham";
const toast = useToast();
const image = ref("");
// Options for dropdowns
const genderOptions = ["Nam", "Nữ"];
const positionOptions = ["Nhân viên", "Quản lý", "Giám đốc"];
const statusOptions = ["Hoạt động", "Không hoạt động"];

// Reactive state
const employees = ref([]);
const widget = window.cloudinary.createUploadWidget(
  {
    cloudName: "donjej4tg",
    uploadPreset: "upload-datn",
    showAdvancedOptions: true,
    sources: ["local", "url"],
    multiple: false,
    clientAllowedFormats: ["image"],
  },
  (error, result) => {
    if (!error && result && result.event === "success") {
      image.value = result.info.url;
      employee.value.avatar = result.info.url
    }
  }
);
const filters = ref({
  search: "",
  gender: null,
  position: null,
  status: null,
});

const dialogVisible = ref(false);
const dialogHeader = ref("");
const employee = ref({});

// Computed properties
const filteredEmployees = computed(() => {
  return employees.value.filter((emp) => {
    const matchSearch =
      !filters.value.search ||
      emp.fullName.toLowerCase().includes(filters.value.search.toLowerCase()) ||
      emp.email.toLowerCase().includes(filters.value.search.toLowerCase()) ||
      emp.phone.includes(filters.value.search);

    const matchGender =
      !filters.value.gender || emp.gender === filters.value.gender;
    const matchPosition =
      !filters.value.position || emp.position === filters.value.position;
    const matchStatus =
      !filters.value.status || emp.status === filters.value.status;

    return matchSearch && matchGender && matchPosition && matchStatus;
  });
});

// Methods
const openNewDialog = () => {
  employee.value = {
    code: "",
    ten: "",
    email: "",
    dienThoai: "",
    birthday: null,
    gioiTinh: null,
    position: null,
    trangThai: true,
  };
  dialogHeader.value = "Thêm nhân viên mới";
  dialogVisible.value = true;
};

const editEmployee = (data) => {
  employee.value = { ...data };
  console.log(employee.value);
  dialogHeader.value = "Chỉnh sửa nhân viên";
  dialogVisible.value = true;
};

const closeDialog = () => {
  dialogVisible.value = false;
  employee.value = {};
};

const saveEmployee = async () => {
  // if (!employee.value.code || !employee.value.fullName) {
  //   toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Vui lòng điền đầy đủ thông tin bắt buộc', life: 3000 });
  //   return;
  // }

  const index = employees.value.findIndex(
    (emp) => emp.id === employee.value.id
  );
  if (index !== -1) {
    employees.value[index] = { ...employee.value };
    const dataAdd = {
      id:employee.value.id,
      avatar:image.value || employee.value.avatar,
      ten: employee.value.ten,
      username: employee.value.email,
      dienThoai: employee.value.dienThoai,
      password: employee.value.email,
      gioiTinh: employee.value.gioiTinh,
      trangThai: true,
      email: employee.value.email,
    };
    const result = await updateNhanVien(dataAdd)
    if(result.status === 200)
    {
      // employees.value.push({ ...employee.value });
      toast.success("Sửa nhân viên thành công")
    }
  } else {
  
    const dataAdd = {
      // ma: "ND02",
      avatar:image.value,
      ten: employee.value.ten,
      username: employee.value.email,
      dienThoai: employee.value.dienThoai,
      password: employee.value.email,
      gioiTinh: employee.value.gioiTinh,
      trangThai: true,
      email: employee.value.email,
    };
    const result = await addNhanVien(dataAdd)
    if(result.status === 200)
    {
      employees.value.push({ ...employee.value });
      toast.success("Thêm nhân viên thành công")
    }
  }

  dialogVisible.value = false;
};
const themAnh = () => {
  widget.open();
};
const exportExcel = () => {
  // Implement Excel export logic here
  toast.add({
    severity: "info",
    summary: "Thông báo",
    detail: "Tính năng đang được phát triển",
    life: 3000,
  });
};
onMounted(async () => {
  const result = await getNhanVien();
  if (result.status === 200) {
    employees.value = result.data;
  }
});
</script>

<style scoped>
.p-dialog {
  max-height: 90vh;
  overflow-y: auto;
}
</style>
