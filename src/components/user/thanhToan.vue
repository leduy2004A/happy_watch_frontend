<template>
  <v-card>
    <v-card-title>Thông tin giao hàng</v-card-title>
    <v-card-text>
      <v-form>
        <v-btn variant="outlined" class="mb-5 diachi" @click="openDiaChi()">
          thêm địa chỉ
        </v-btn>
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
          <v-col cols="12" md="6">
            <v-text-field
              v-model="store.formData.note"
              label="Ghi chú"
              outlined
              dense
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" sm="6">
            <v-radio-group
              v-model="deliveryMethod"
              label="Phương thức thanh toán"
            >
              <v-radio label="Thanh toán khi nhận hàng" value="cod"></v-radio>
              <v-radio label="Thanh toán ngay" value="prepaid"></v-radio>
            </v-radio-group>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" @click="submitForm">Đặt hàng</v-btn>
    </v-card-actions>
  </v-card>
  <dia_log_dia_chi :dialog="dialog"></dia_log_dia_chi>
</template>

<script setup>
import dia_log_dia_chi from "../admin/BanHangTaiQuay/dia_log_dia_chi.vue";
import { onMounted, ref, watch } from "vue";
import { useAddressStore } from "@/store/diaChiStore";
import { thanhToanMuaNgay } from "@/axios/thanhtoan";
import { useCheckOutStore } from "@/store/checkOutStore";
import { useToast } from "vue-toastification";
import { useSuccesStore } from "@/store/successStore";
const successStore = useSuccesStore()
const toast = useToast()
const checkOutStore = useCheckOutStore()
import useEmitter from "@/useEmitter";
import { useRouter } from "vue-router";
const emitter = useEmitter();
const deliveryMethod = ref("cod");
const store = useAddressStore();
const router = useRouter()
async function submitForm() {
  // Xử lý logic đặt hàng ở đây
  const selectedProvince = store.provinces.find(
    (p) => p.value === store.formData.province
  );
  const selectedDistrict = store.districts.find(
    (d) => d.value === store.formData.district
  );
  const selectedWard = store.wards.find((w) => w.value === store.formData.ward);
    const chiTietHoaDon = checkOutStore.products.map(product => ({
    chiTietSanPham: {
      ma: product.productGoc.code // Giả sử product có trường ma
    },
    soLuong: product.soLuongChon, // Giả sử product có trường soLuong
    giaTungSanPham: product.productGoc.price // Giả sử product có trường gia
  }));
  const data = {
    hoaDon: {
      tenNguoiNhan: store.formData.ten,
      gia: checkOutStore.tinhTongTien(),
      tinhThanhPho: selectedProvince.text,
      quanHuyen: selectedDistrict.text,
      xaPhuongThiTran: selectedWard.text,
      diaChiCuThe: store.formData.detailAddress,
      dienThoai: store.formData.phone,
      loaiHoaDon: "Trực tuyến",
    },
    chiTietHoaDon
  };
  console.log(data)
  const result = await thanhToanMuaNgay(data)
  if(result.status === 200)
  {
    successStore.customerInfo.phone = store.formData.phone
    successStore.customerInfo.fullName = store.formData.ten
    successStore.customerInfo.address.province = selectedProvince.text,
    successStore.customerInfo.address.district = selectedDistrict.text,
    successStore.customerInfo.address.ward = selectedWard.text,
    successStore.customerInfo.address.city = store.formData.detailAddress
    successStore.products = checkOutStore.products
    successStore.shipping.fee = checkOutStore.shippingFee
    console.log(successStore.products)
    router.push("/product/success")
    toast.success("Đặt hàng thành công")
  }
}
const dialog = ref(false);
const openDiaChi = () => {
  dialog.value = true;
};
onMounted(async () => {
  await store.fetchProvinces();
  emitter.on("closeDialogDiaChi", (data) => {
    dialog.value = data;
  });
});
watch(
  () => store.getFormData,
  async (newFormData) => {
    if (newFormData.province && newFormData.district && newFormData.ward) {
      emitter.emit("dataShip", store.getShippingData);
    }
  },
  { deep: true }
);
</script>
<style scoped>
.v-text-field :v-deep .v-field__append-inner {
  padding-inline-end: 0;
}
.v-card {
  width: 700px;
}
</style>
