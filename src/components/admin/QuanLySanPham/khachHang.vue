<!-- views/UserManagement.vue -->
<template>
  <BaseCrud
    title="Quản lý khách hàng"
    :items="data"
    :table-headers="headers"
    dialog-width="1200px"
  >
    <template #dialog-content="{ editedItem, showAdress }">
      <v-row>
        <!-- Customer Information Section -->
        <v-col cols="12" :md="showAdress ? 6 : 12">
          <v-card flat>
            <v-card-title>Thông tin khách hàng</v-card-title>
            <v-card-text>
              <v-form ref="customerForm">
                <!-- Avatar Upload -->
                <div class="text-center mb-4">
                  <v-avatar size="150" color="grey-lighten-2">
                    <v-img
                      v-if="editedItem.avatar"
                      :src="editedItem.avatar"
                      alt="Avatar"
                    ></v-img>
                    <span v-else>Chọn ảnh</span>
                  </v-avatar>
                  <v-file-input
                    v-model="avatarFile"
                    accept="image/*"
                    hide-input
                    class="d-none"
                    @change="handleAvatarChange"
                  ></v-file-input>
                </div>

                <!-- Customer Details -->
                <v-text-field
                  v-model="editedItem.ten"
                  label="Tên khách hàng"
                  :rules="[(v) => !!v || 'Vui lòng nhập tên khách hàng']"
                  required
                ></v-text-field>

                <v-text-field
                  v-model="editedItem.email"
                  label="Email"
                  :rules="[
                    (v) => !!v || 'Vui lòng nhập email',
                    (v) => /.+@.+\..+/.test(v) || 'Email không hợp lệ',
                  ]"
                  required
                ></v-text-field>

                <v-text-field
                  v-model="editedItem.dienThoai"
                  label="Số điện thoại"
                  :rules="[
                    (v) => !!v || 'Vui lòng nhập số điện thoại',
                    (v) =>
                      /^\d{10,11}$/.test(v) || 'Số điện thoại không hợp lệ',
                  ]"
                  required
                ></v-text-field>
                <v-radio-group
                  v-model="editedItem.gioiTinh"
                  label="Giới tính"
                  :rules="[(v) => !!v || 'Vui lòng chọn giới tính']"
                  required
                >
                  <v-radio label="Nam" value="Nam"></v-radio>
                  <v-radio label="Nữ" value="Nữ"></v-radio>
                </v-radio-group>

                <div class="col-12" v-if="showAdress">
                  <SelectButton
                    v-model="editedItem.trangThai"
                    :options="optionsSelect"
                    optionLabel="label"
                    optionValue="value"
                     @update:modelValue="updateTrangThai(editedItem)"
                  />
                </div>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Address List Section -->
        <v-col cols="12" md="6" v-if="showAdress">
          <v-card>
            <v-card-title class="d-flex justify-space-between align-center">
              Danh sách địa chỉ
              <v-btn color="primary" variant="text" @click="addNewAddress">
                Thêm địa chỉ
              </v-btn>
            </v-card-title>
            <v-card-text>
              <v-expansion-panels v-model="expandedPanel">
                <v-expansion-panel
                  v-for="(address, index) in addressStore.address"
                  :key="index"
                >
                  <v-expansion-panel-title>
                    Địa chỉ {{ index + 1 }}
                    <template v-slot:actions>
                      <v-btn
                        icon="mdi-delete"
                        variant="text"
                        color="error"
                        @click.stop="removeAddress(index, address)"
                      ></v-btn>
                    </template>
                  </v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <v-form ref="addressForms">
                      <v-text-field
                        v-model="address.tenNguoiNhan"
                        label="Tên"
                        :rules="[(v) => !!v || 'Vui lòng nhập tên']"
                        required
                      ></v-text-field>

                      <v-text-field
                        v-model="address.dienThoai"
                        label="Số điện thoại"
                        :rules="[(v) => !!v || 'Vui lòng nhập số điện thoại']"
                        required
                      ></v-text-field>

                      <v-select
                        v-model="address.tinhThanhPho"
                        :items="addressStore.provinces"
                        item-title="text"
                        item-value="value"
                        label="Tỉnh/thành phố"
                        :rules="[(v) => !!v || 'Vui lòng chọn tỉnh/thành phố']"
                        required
                        @update:modelValue="addressStore.handleProvinceChange"
                      ></v-select>

                      <v-select
                        v-model="address.quanHuyen"
                        :items="addressStore.districts"
                        item-title="text"
                        item-value="value"
                        label="Quận/huyện"
                        :rules="[(v) => !!v || 'Vui lòng chọn quận/huyện']"
                        required
                        @update:modelValue="addressStore.handleDistrictChange"
                      ></v-select>

                      <v-select
                        v-model="address.xaPhuongThiTran"
                        :items="addressStore.wards"
                        item-title="text"
                        item-value="value"
                        label="Xã/phường/thị trấn"
                        :rules="[
                          (v) => !!v || 'Vui lòng chọn xã/phường/thị trấn',
                        ]"
                        required
                      ></v-select>

                      <v-text-field
                        v-model="address.diaChiCuThe"
                        label="Địa chỉ cụ thể"
                        :rules="[(v) => !!v || 'Vui lòng nhập địa chỉ cụ thể']"
                        required
                      ></v-text-field>

                      <v-btn @click="themDiaChiVao(address)">
                        <v-icon>mdi-plus</v-icon>
                      </v-btn>
                    </v-form>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>

    <!-- Custom status column -->
    <template #item.trangThai="{ item }">
      <v-chip
        :color="item.trangThai === true ? 'success' : 'error'"
        size="small"
      >
        {{ item.trangThai === true ? "Hoạt động" : "Ngừng hoạt động" }}
      </v-chip>
    </template>
  </BaseCrud>
</template>

<script setup>
import { ref, onMounted, onUnmounted, reactive, watch } from "vue";
import BaseCrud from "./BaseCrud.vue";
import { useToast } from "vue-toastification";
const toast = useToast();
import useEmitter from "@/useEmitter";
import { useCustomerStore } from "@/store/customerStore";
const addressStore = useCustomerStore();
import {
  layTatCaKhachHang,
  addChatLieuDay,
  updateChatLieuDay,
  themKhachHang,
  updateKhachHang,
} from "@/axios/sanpham";
import { getAllDiaChiKhachHang, themDiaChiKhachHang } from "@/axios/khachhang";
import { updateTrangThaiNhanVien } from "@/axios/sanpham";
// import { addThuongHieu } from "@/axios/sanpham";
const emitter = useEmitter();
// Table headers
const optionsSelect = [
  { label: "Hoạt động", value: true },
  { label: "Không hoạt động", value: false },
];
const headers = [
  // { title: "STT", key: "stt", align: "center" },
  { title: "Họ Tên", key: "ten", align: "center" },
  { title: "Email", key: "email", align: "center" },
  { title: "Số Điện Thoại", key: "dienThoai", align: "center" },
  { title: "Giới Tính", key: "gioiTinh", align: "center" },
  // { title: "Trạng thái", key: "trangThai", align: "center" },
  // { title: "Thao tác", key: "actions", align: "center" },
];
const form = reactive({
  avatar: null,
  customerName: "",
  email: "",
  phone: "",
  birthDate: "",
  gender: "",
  addresses: [],
  trangThai: false,
});
const dialogDiaChi = ref(true);
// References
const customerForm = ref(null);
const addressForms = ref([]);
const expandedPanel = ref(0);
const avatarFile = ref(null);
const idNguoiDung = ref(0);
// Mock data for dropdowns
// watch(
//   () => addressStore.address,
//   async (newDiachi, oldDiachi) => {
//     // Chỉ gọi khi có sự thay đổi thực sự về dữ liệu
//     if (JSON.stringify(newDiachi) !== JSON.stringify(oldDiachi)) {
//       // Thêm flag để tránh vòng lặp
//       if (!addressStore.isUpdating) {
//         addressStore.isUpdating = true;
//         await addressStore.updateAddressFromProps(newDiachi);
//         addressStore.isUpdating = false;
//       }
//     }
//   },
//   { deep: true }
// );
// Methods
const handleAvatarChange = (file) => {
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      form.avatar = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};
const updateTrangThai =async (editedItem)=>{
  const result = await updateTrangThaiNhanVien(editedItem.id)
  if(result.status === 200)
  {
    toast.success("Sửa trạng thái thành công")
  }
}
const addNewAddress = () => {
  addressStore.address.push({
    name: "",
    phone: "",
    province: "",
    district: "",
    ward: "",
    detail: "",
    isDefault: form.addresses.length === 0, // First address is default
  });
  expandedPanel.value = form.addresses.length - 1;
};

const removeAddress = (index, item) => {
  console.log(item);
  addressStore.address.splice(index, 1);
  if (addressStore.address.length === 0) {
    addNewAddress();
  }
};
const themDiaChiVao = async (item) => {
  console.log(item);
  let provinceName = addressStore.provinces.find(
    (p) => p.value === item.tinhThanhPho
  )?.text;
  let districtName = addressStore.districts.find(
    (d) => d.value === item.quanHuyen
  )?.text;
  let wardName = addressStore.wards.find(
    (w) => w.value === item.xaPhuongThiTran
  )?.text;

  // Sử dụng giá trị text đã lưu nếu không tìm được từ value
  provinceName = provinceName || item.tinhThanhPho;
  districtName = districtName || item.quanHuyen;
  wardName = wardName || item.xaPhuongThiTran;
  const dataAdress = {
    ma: "",
    tenNguoiNhan: item.tenNguoiNhan,
    tinhThanhPho: provinceName,
    quanHuyen: districtName,
    xaPhuongThiTran: wardName,
    diaChiCuThe: item.diaChiCuThe,
    dienThoai: item.dienThoai,
    nguoiDung: {
      id: idNguoiDung.value,
    },
  };
  const result = await themDiaChiKhachHang(dataAdress);
  if (result.status === 200) {
    toast.success("Thêm địa chỉ thành công");
  } else {
    toast.error("Thêm địa chỉ thất bại");
  }
};
const handleDefaultAddressChange = (index) => {
  if (addressStore.address[index].isDefault) {
    addressStore.address.forEach((addr, idx) => {
      if (idx !== index) {
        addr.isDefault = false;
      }
    });
  }
};

// Initialize with one empty address
if (addressStore.address.length === 0) {
  addNewAddress();
}

// Default item structure
// const defaultItem = {
//   fullName: '',
//   email: '',
//   phone: '',
//   status: 'Hoạt động'
// }

// Mock data
const data = ref([]);

// CRUD handlers
const handleCreate = async (newItem) => {
  const dataNguoiDung = {
    ten: newItem.ten,
    username: newItem.email,
    dienThoai: newItem.dienThoai,
    password: newItem.email,
    gioiTinh: newItem.gioiTinh,
    trangThai: true,
    email: newItem.email,
  };
  try {
    const result = await themKhachHang(dataNguoiDung);
    if (result.status === 200) {
      toast.success("Thêm người dùng thành công");
      // const dataAdd = { ...newItem, id: data.value.length + 1 };
      console.log(result);
      data.value.push(result.data);
    } else {
      toast.error("Có lỗi xảy ra");
    }
  } catch (error) {
    console.error("Error creating user:", error);
  }
};

const handleUpdate = async ({ item, index }) => {
  console.log(item);
  try {
    const result = await updateKhachHang(item);
    if (result.status === 200) {
      data.value[index] = { ...item, id: data.value[index].id };
      toast.success("Sửa khách hàng thành công");
    } else {
      toast.error("Có lỗi xảy ra");
    }
  } catch (error) {
    console.error("Error updating user:", error);
  }
};
// emitter.on('crud:edit', async (item) => {
//   if (item && item.id) {
//     await fetchUserAddresses(item.id);
//   }
// });

const handleDelete = async (item) => {
  try {
    console.log("Deleting item:", item);

    // Kiểm tra item có tồn tại không
    if (!item || !item.id) {
      console.error("Invalid item to delete:", item);
      return;
    }

    const index = users.value.findIndex((user) => user.id === item.id);
    console.log("Found index:", index, "for id:", item.id);

    if (index > -1) {
      users.value.splice(index, 1);
      console.log("Successfully deleted user at index:", index);
    } else {
      console.warn("User not found with id:", item.id);
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    emitter.emit("crud:error", error);
  }
};

const handleExport = (items) => {
  console.log("Exporting:", items);
};

const handleError = (error) => {
  console.error("Error:", error);
};
emitter.on("crud:edit", async (item) => {
  if (item && item.id) {
    idNguoiDung.value = item.id;
    await addressStore.fetchProvinces();
    const result = await getAllDiaChiKhachHang(item.id);
    if (result.status === 200) {
      addressStore.address = result.data;
      await addressStore.loadAddressesWithLocation(result.data);
    }
    // await fetchUserAddresses(item.id);
  }
});

// Đăng ký listeners khi component được mount
onMounted(async () => {
  emitter.on("crud:create", handleCreate);
  emitter.on("crud:update", handleUpdate);
  emitter.on("crud:delete", handleDelete);
  emitter.on("crud:export", handleExport);
  emitter.on("crud:error", handleError);
  try {
    const result = await layTatCaKhachHang();
    data.value = result.data;
  } catch (e) {
    toast.error("Có lỗi xảy ra");
  }
});

// Hủy đăng ký listeners khi component bị destroy
onUnmounted(() => {
  emitter.off("crud:create", handleCreate);
  emitter.off("crud:update", handleUpdate);
  emitter.off("crud:delete", handleDelete);
  emitter.off("crud:export", handleExport);
  emitter.off("crud:error", handleError);
});
</script>
