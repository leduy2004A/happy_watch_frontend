<template>

        <div class="card px-10 py-10">
      <!-- Header Controls -->
      <div class="flex justify-content-between mb-3">
        <div class="flex gap-2">
          <Dropdown v-model="filters.gender" :options="genderOptions" placeholder="Giới tính" class="w-10rem" />
          <Dropdown v-model="filters.position" :options="positionOptions" placeholder="Chức vụ" class="w-10rem" />
          <Dropdown v-model="filters.status" :options="statusOptions" placeholder="Trạng thái" class="w-10rem" />
          <Button label="XUẤT EXCEL" icon="pi pi-file-excel" @click="exportExcel" />
        </div>
        <div>
          <Button label="TẠO NHÂN VIÊN" icon="pi pi-plus" severity="success" @click="openNewDialog" />
        </div>
      </div>
  
      <!-- Search Input -->
      <div class="flex justify-content-between mb-3">
        <span class="p-input-icon-left flex-grow-1">
          <InputText v-model="filters.search" placeholder="Tên hoặc sđt hoặc email" class="w-full" />
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
        <Column field="code" header="Code" style="width: 10%" />
        <Column field="fullName" header="Họ và tên" style="width: 15%" />
        <Column field="email" header="Email" style="width: 20%" />
        <Column field="phone" header="SĐT" style="width: 10%" />
        <Column field="birthday" header="Ngày sinh" style="width: 10%" />
        <Column field="gender" header="Giới tính" style="width: 10%" />
        <Column field="position" header="Chức vụ" style="width: 10%" />
        <Column field="status" header="Trạng thái" style="width: 10%">
          <template #body="{ data }">
            <Tag :severity="data.status === 'Hoạt động' ? 'success' : 'danger'" :value="data.status" />
          </template>
        </Column>
        <Column header="Thao tác" style="width: 10%">
          <template #body="{ data }">
            <Button icon="pi pi-pencil" rounded text severity="info" @click="editEmployee(data)" />
          </template>
        </Column>
      </DataTable>
  
      <!-- Dialog Form -->
      <Dialog v-model:visible="dialogVisible" :header="dialogHeader" modal class="w-11 md:w-6">
  <div class="grid formgrid p-fluid">
    <div class="field col-12 md:col-6">
      <label for="employeeCode">Mã nhân viên</label>
      <InputText id="employeeCode" v-model="employee.code" class="ml-3"/>
    </div>
    <div class="field col-12 md:col-6">
      <label for="fullName">Họ và tên</label>
      <InputText id="fullName" v-model="employee.fullName" />
    </div>
    <div class="field col-12 md:col-6">
      <label for="email">Email</label>
      <InputText id="email" v-model="employee.email" type="email" />
    </div>
    <div class="field col-12 md:col-6">
      <label for="phone">Số điện thoại</label>
      <InputText id="phone" v-model="employee.phone" />
    </div>
    <div class="field col-12 md:col-6">
      <label for="birthday">Ngày sinh</label>
      <Calendar id="birthday" v-model="employee.birthday" dateFormat="dd-mm-yy" />
    </div>
    <div class="field col-12 md:col-6">
      <label for="gender">Giới tính</label>
      <Dropdown id="gender" v-model="employee.gender" :options="genderOptions" />
    </div>
    <div class="field col-12 md:col-6">
      <label for="position">Chức vụ</label>
      <Dropdown id="position" v-model="employee.position" :options="positionOptions" />
    </div>
    <div class="field col-12 md:col-6">
      <label for="status">Trạng thái</label>
      <Dropdown id="status" v-model="employee.status" :options="statusOptions" />
    </div>
  </div>
  <template #footer>
    <Button label="Hủy" icon="pi pi-times" text @click="closeDialog" />
    <Button label="Lưu" icon="pi pi-check" @click="saveEmployee" />
  </template>
</Dialog>

    </div>


  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useToast } from 'vue-toastification';
  import { getNhanVien } from '@/axios/sanpham';
  const toast = useToast();
  
  // Options for dropdowns
  const genderOptions = ['Nam', 'Nữ'];
  const positionOptions = ['Nhân viên', 'Quản lý', 'Giám đốc'];
  const statusOptions = ['Hoạt động', 'Không hoạt động'];
  
  // Reactive state
  const employees = ref([
    {
      code: 'NV3',
      fullName: 'Nguyễn Văn Nhật',
      email: 'Nhatdz@gmail.com',
      phone: '0971083478',
      birthday: '20-12-2003',
      gender: 'Nam',
      position: 'Nhân viên',
      status: 'Hoạt động',
      avatar: 'path/to/avatar1.jpg'
    },
    {
      code: 'NV2',
      fullName: 'Nguyễn Văn Tuấn',
      email: 'tuannv28@gmail.com',
      phone: '0472819462',
      birthday: '20-12-2002',
      gender: 'Nam',
      position: 'Nhân viên',
      status: 'Hoạt động',
      avatar: 'path/to/avatar2.jpg'
    }
  ]);
  
  const filters = ref({
    search: '',
    gender: null,
    position: null,
    status: null
  });
  
  const dialogVisible = ref(false);
  const dialogHeader = ref('');
  const employee = ref({});
  
  // Computed properties
  const filteredEmployees = computed(() => {
    return employees.value.filter(emp => {
      const matchSearch = !filters.value.search || 
        emp.fullName.toLowerCase().includes(filters.value.search.toLowerCase()) ||
        emp.email.toLowerCase().includes(filters.value.search.toLowerCase()) ||
        emp.phone.includes(filters.value.search);
      
      const matchGender = !filters.value.gender || emp.gender === filters.value.gender;
      const matchPosition = !filters.value.position || emp.position === filters.value.position;
      const matchStatus = !filters.value.status || emp.status === filters.value.status;
  
      return matchSearch && matchGender && matchPosition && matchStatus;
    });
  });
  
  // Methods
  const openNewDialog = () => {
    employee.value = {
      code: '',
      fullName: '',
      email: '',
      phone: '',
      birthday: null,
      gender: null,
      position: null,
      status: 'Hoạt động'
    };
    dialogHeader.value = 'Thêm nhân viên mới';
    dialogVisible.value = true;
  };
  
  const editEmployee = (data) => {
    employee.value = { ...data };
    dialogHeader.value = 'Chỉnh sửa nhân viên';
    dialogVisible.value = true;
  };
  
  const closeDialog = () => {
    dialogVisible.value = false;
    employee.value = {};
  };
  
  const saveEmployee = () => {
    if (!employee.value.code || !employee.value.fullName) {
      toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Vui lòng điền đầy đủ thông tin bắt buộc', life: 3000 });
      return;
    }
  
    const index = employees.value.findIndex(emp => emp.code === employee.value.code);
    if (index !== -1) {
      employees.value[index] = { ...employee.value };
      toast.add({ severity: 'success', summary: 'Thành công', detail: 'Cập nhật nhân viên thành công', life: 3000 });
    } else {
      employees.value.push({ ...employee.value });
      toast.add({ severity: 'success', summary: 'Thành công', detail: 'Thêm nhân viên thành công', life: 3000 });
    }
  
    dialogVisible.value = false;
  };
  
  const exportExcel = () => {
    // Implement Excel export logic here
    toast.add({ severity: 'info', summary: 'Thông báo', detail: 'Tính năng đang được phát triển', life: 3000 });
  };
  onMounted(async ()=>{
    const result = await getNhanVien()
    if(result.status === 200)
    {
      employees.value = result.data
    }
    
  })
  </script>
  
  <style scoped>
  .p-dialog {
    max-height: 90vh;
    overflow-y: auto;
  }
  </style>