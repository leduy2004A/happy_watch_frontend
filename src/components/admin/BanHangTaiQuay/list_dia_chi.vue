<template>
  <v-container>
    <!-- Header -->
    <v-row class="header mb-4">
      <v-col cols="1">
        <div class="text-subtitle-2 font-weight-medium">STT</div>
      </v-col>
      <v-col cols="3">
        <div class="text-subtitle-2 font-weight-medium">Tên người nhận</div>
      </v-col>
      <v-col cols="2">
        <div class="text-subtitle-2 font-weight-medium">Số điện thoại</div>
      </v-col>
      <v-col cols="4">
        <div class="text-subtitle-2 font-weight-medium">Địa chỉ</div>
      </v-col>
      <v-col cols="2">
        <div class="text-subtitle-2 font-weight-medium">Thao tác</div>
      </v-col>
    </v-row>

    <!-- Address List -->
    <v-row
      v-for="(address, index) in khachHangStore.data"
      :key="index"
      class="address-item py-2"
    >
      <v-col cols="1">
        {{ index + 1 }}
      </v-col>
      <v-col cols="3">
        {{ address.tenNguoiNhan }}
      </v-col>
      <v-col cols="2">
        {{ address.dienThoai }}
      </v-col>
      <v-col cols="4">
        {{ address.diaChiCuThe }}
      </v-col>
      <v-col cols="2">
        <v-btn
          color="warning"
          variant="text"
          class="px-2"
          @click="selectAddress(address)"
        >
          CHỌN
        </v-btn>
      </v-col>
    </v-row>

    <!-- Add Address Button -->
    <v-row class="mt-4">
      <v-col cols="12">
        <v-btn
          color="warning"
          variant="outlined"
          class="text-none"
          @click="openAddDialog"
        >
          THÊM ĐỊA CHỈ
        </v-btn>
      </v-col>
    </v-row>

    <!-- Pagination -->
    <v-row class="mt-4 justify-end">
      <v-col cols="auto">
        <v-pagination
          v-model="currentPage"
          :length="totalPages"
          :total-visible="7"
          rounded
        ></v-pagination>
      </v-col>
    </v-row>

    <!-- Add/Edit Address Dialog -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title class="text-h6 pa-4">
          {{ editingAddress ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ mới" }}
        </v-card-title>
        <v-card-text>
          <v-form ref="formRef" v-model="valid">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="store.formData.ten"
                  label="Tên người nhận"
                  outlined
                  dense
                  placeholder="Tên người nhận"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="store.formData.phone"
                  label="Số điện thoại"
                  outlined
                  dense
                  placeholder="0473029182"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="4">
                <v-select
                  v-model="store.formData.province"
                  :items="store.provinces"
                  label="Tỉnh/thành phố"
                  item-title="text"
                  item-value="value"
                  outlined
                  dense
                  @update:modelValue="store.handleProvinceChange"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-select
                  v-model="store.formData.district"
                  :items="store.districts"
                  label="Quận/huyện"
                  item-title="text"
                  item-value="value"
                  outlined
                  dense
                  @update:modelValue="store.handleDistrictChange"
                ></v-select>
              </v-col>
              <v-col cols="12" md="4">
                <v-select
                  v-model="store.formData.ward"
                  :items="store.wards"
                  label="Xã/phường/thị trấn"
                  item-title="text"
                  item-value="value"
                  outlined
                  dense
                ></v-select>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="store.formData.detailAddress"
                  label="Địa chỉ cụ thể"
                  outlined
                  dense
                  placeholder="aaaaa"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6"> </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" variant="text" @click="dialog = false"
            >Hủy</v-btn
          >
          <v-btn
            color="success"
            variant="text"
            @click="saveAddress"
            :disabled="!valid"
          >
            Lưu
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useToast } from "vue-toastification";
import { useKhachHangStore } from "@/store/khachHangStore";
import { useAddressStore } from "@/store/diaChiStore";
import { themDiaChiKhachHang } from "@/axios/khachhang";
import useEmitter from "@/useEmitter";
const khachHangStore = useKhachHangStore();
const addressStore = useAddressStore();
const toast = useToast();
const store = useAddressStore();
const emitter = useEmitter()
// Data
const addresses = ref([
  {
    id: 1,
    name: "Địa chỉ 12",
    phone: "0473029182",
    fullAddress: "aaaaa, Xã Mường Giàng, Huyện Quỳnh Nhai, Sơn La",
  },
  {
    id: 1,
    name: "Địa chỉ 12",
    phone: "0473029182",
    fullAddress: "aaaaa, Xã Mường Giàng, Huyện Quỳnh Nhai, Sơn La",
  },
  {
    id: 1,
    name: "Địa chỉ 12",
    phone: "0473029182",
    fullAddress: "aaaaa, Xã Mường Giàng, Huyện Quỳnh Nhai, Sơn La",
  },
  {
    id: 1,
    name: "Địa chỉ 12",
    phone: "0473029182",
    fullAddress: "aaaaa, Xã Mường Giàng, Huyện Quỳnh Nhai, Sơn La",
  },
  {
    id: 1,
    name: "Địa chỉ 12",
    phone: "0473029182",
    fullAddress: "aaaaa, Xã Mường Giàng, Huyện Quỳnh Nhai, Sơn La",
  },
  {
    id: 1,
    name: "Địa chỉ 12",
    phone: "0473029182",
    fullAddress: "aaaaa, Xã Mường Giàng, Huyện Quỳnh Nhai, Sơn La",
  },
  {
    id: 1,
    name: "Địa chỉ 12",
    phone: "0473029182",
    fullAddress: "aaaaa, Xã Mường Giàng, Huyện Quỳnh Nhai, Sơn La",
  },
]);

const dialog = ref(false);
const valid = ref(false);
const form = ref(null);
const currentPage = ref(1);
const totalPages = ref(1);
const editingAddress = ref(null);

const formData = ref({
  name: "",
  phone: "",
  address: "",
});
onMounted(async () => {
  await khachHangStore.fetchDataDiaChiNguoiDung(khachHangStore.idNguoiDung);
});
// Methods
const openAddDialog = () => {
  editingAddress.value = null;
  formData.value = {
    name: "",
    phone: "",
    address: "",
  };
  dialog.value = true;
};


const selectAddress = async (address) => {
  console.log(address);
  // Gán các thông tin cơ bản
  addressStore.formData.ten = address.tenNguoiNhan;
  addressStore.formData.phone = address.dienThoai;
  addressStore.formData.detailAddress = address.diaChiCuThe;

  // Tìm và gán mã tỉnh/thành phố
  const province = addressStore.provinces.find(
    p => p.text === address.tinhThanhPho
  );
  if (province) {
    addressStore.formData.province = province.value;
    // Load districts cho tỉnh/thành được chọn
    await addressStore.handleProvinceChange(province.value);
  }

  // Tìm và gán mã quận/huyện
  const district = addressStore.districts.find(
    d => d.text === address.quanHuyen
  );
  if (district) {
    addressStore.formData.district = district.value;
    // Load wards cho quận/huyện được chọn
    await addressStore.handleDistrictChange(district.value);
  }

  // Tìm và gán mã phường/xã
  const ward = addressStore.wards.find(
    w => w.text === address.xaPhuongThiTran
  );
  if (ward) {
    addressStore.formData.ward = ward.value;
  }

  toast.success("Đã chọn địa chỉ thành công");
};

const saveAddress = async () => {
  const result = await khachHangStore.themDiaChiKhachHang()
  if(result)
  {
    dialog.value = false
  }
};

// Emit events
const emit = defineEmits(["select-address"]);

// Lifecycle hooks
onMounted(() => {
  // You can fetch addresses from API here
  totalPages.value = Math.ceil(addresses.value.length / 10);
});
</script>

<style scoped>
.address-item {
  border-bottom: 1px solid #e0e0e0;
}

.address-item:hover {
  background-color: #f5f5f5;
}
</style>
