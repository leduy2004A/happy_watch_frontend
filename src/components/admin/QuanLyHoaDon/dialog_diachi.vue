<template>
  <v-dialog v-model="dialog" max-width="600px">
    <v-card>
      <v-card-title class="text-h6 pa-4">
      Cập nhật địa chỉ
      </v-card-title>
      <v-card-text>
        <v-form ref="formRef" v-model="valid">
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.ten"
                label="Tên người nhận"
                outlined
                dense
                placeholder="Tên người nhận"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.phone"
                label="Số điện thoại"
                outlined
                dense
                placeholder="0473029182"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="4">
              <v-select
                v-model="store.selectedProvinceId"
                :items="store.provinces"
                label="Tỉnh/thành phố"
                item-title="text"
                item-value="value"
                outlined
                dense
                @update:model-value="handleProvinceChange"
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-select
                v-model="store.selectedDistrictId"
                :items="store.districts"
                label="Quận/huyện"
                item-title="text"
                item-value="value"
                outlined
                dense
                @update:model-value="handleDistrictChange"
                :disabled="!store.selectedProvinceId"
              ></v-select>
            </v-col>
            <v-col cols="12" md="4">
              <v-select
                v-model="store.selectedWardId"
                :items="store.wards"
                label="Xã/phường/thị trấn"
                item-title="text"
                item-value="value"
                outlined
                dense
                :disabled="!store.selectedDistrictId"
              ></v-select>
            </v-col>

            <v-col cols="12" md="12">
              <v-text-field
                v-model="formData.detailAddress"
                label="Địa chỉ cụ thể"
                outlined
                dense
                placeholder="aaaaa"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="12">
              <div class="d-flex justify-space-between align-center">
          <div class="text-subtitle-1 font-weight-bold">Phí Ship:</div>
          <div class="text-h6 font-weight-bold text-red-500">
            {{store.formatPrice(store.shippingFee ) }}
          </div>
        </div>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" variant="text" @click="close()">Hủy</v-btn>
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
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useDiaChiTrongHoaDonStore } from "@/store/diaChiTrongHoaDonStore";
import useEmitter from "@/useEmitter";
import { updateDiaChiNhanHangTheoMaHoaDon } from "@/axios/quanlihoadon";
import { useToast } from "vue-toastification";
import { capNhatPhiShipTheoMaHoaDon } from "@/axios/quanlihoadon";
import { useOrderSummaryStore } from "@/store/orderSumaryStore";
const orderSumaryStore = useOrderSummaryStore()
const toast = useToast()
const emitter = useEmitter();
const store = useDiaChiTrongHoaDonStore();
const dialog = ref(false);
const valid = ref(false);
const formRef = ref(null);
import { useRoute } from "vue-router";
const route = useRoute();
// Form data local state
const formData = ref({
  ten: "",
  phone: "",
  detailAddress: "",
});

const props = defineProps({
  modal: Boolean,
  editingAddress: Boolean,
  orderId: {
    type: String,
    default: "",
  },
});

watch(
  () => props.modal,
  async (newVal) => {
    dialog.value = newVal;
    if (newVal) {
      await loadAddressData();
    }
  }
);

const loadAddressData = async () => {
  try {
    await store.fetchDiaChiData(route.params.ma);
    // Đổ dữ liệu từ API vào form
    formData.value = {
      ten: store.diaChi.tenNguoiNhan || "",
      phone: store.diaChi.dienThoai || "",
      detailAddress: store.diaChi.diaChiCuThe || "",
    };
  } catch (error) {
    console.error("Error loading address data:", error);
  }
};

const handleProvinceChange = async (provinceId) => {
  store.districts = [];
  store.wards = [];
  store.selectedDistrictId = null;
  store.selectedWardId = null;
  if (provinceId) {
    await store.fetchDistricts(provinceId);
  }
};

const handleDistrictChange = async (districtId) => {
  store.wards = [];
  store.selectedWardId = null;
  if (districtId) {
    await store.fetchWards(districtId);
  }
};

onMounted(async () => {
  await store.fetchProvinces();
  // if (props.editingAddress && props.orderId) {
  await loadAddressData();
  // }
});

const close = () => {
  dialog.value = false;
  emitter.emit("closeModalDiaChi", false);
  // Reset form
  // formData.value = {
  //   ten: '',
  //   phone: '',
  //   detailAddress: ''
  // };
  // // Reset địa chỉ selections
  // store.selectedProvinceId = null;
  // store.selectedDistrictId = null;
  // store.selectedWardId = null;
  // store.districts = [];
  // store.wards = [];
};
watch(
  () => [store.selectedProvinceId, store.selectedDistrictId, store.selectedWardId],
  async ([provinceId, districtId, wardId]) => {
    if (provinceId && districtId && wardId) {
     store.calculateShippingFee(districtId,wardId)
    }
  },
  { deep: true }
);
const saveAddress = async () => {
  // Lấy text của các địa chỉ đã chọn
  const selectedProvince = store.provinces.find(
    (p) => p.value === store.selectedProvinceId
  )?.text;
  const selectedDistrict = store.districts.find(
    (d) => d.value === store.selectedDistrictId
  )?.text;
  const selectedWard = store.wards.find(
    (w) => w.value === store.selectedWardId
  )?.text;

  const addressData = {
    tenNguoiNhan: formData.value.ten,
    dienThoai: formData.value.phone,
    tinhThanhPho: selectedProvince,
    quanHuyen: selectedDistrict,
    xaPhuongThiTran: selectedWard,
    diaChiCuThe: formData.value.detailAddress,
  };
  if( addressData.quanHuyen !== undefined &&
  addressData.tinhThanhPho !== undefined &&
  addressData.xaPhuongThiTran !== undefined)
  {
      try{
    const result =await updateDiaChiNhanHangTheoMaHoaDon(route.params.ma,addressData)
    if(result.status === 200)
    {
      const updateShip =await capNhatPhiShipTheoMaHoaDon(route.params.ma,store.shippingFee)
      if(updateShip.status === 200)
      {
       toast.success("Cập nhật địa chỉ thành công") 
       orderSumaryStore.fetchOrderData(route.params.ma)
      }
      
    }
  }
 catch(e){
    toast.error("Có lỗi xảy ra")
 }
  close();
  }
else{
  toast.error("Kiểm tra lại các trường địa chỉ")
}
};
</script>

<style scoped></style>
