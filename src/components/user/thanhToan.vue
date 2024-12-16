<template>
  <v-card>
    <v-card-title>Thông tin giao hàng</v-card-title>
    <v-card-text>
      <v-btn variant="outlined" class="mb-5 diachi" @click="openDiaChi()" v-if="store.isNutDiaChi">
          thêm địa chỉ
        </v-btn>
      <v-form v-model="valid">
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="store.formData.ten"
              label="Tên người nhận"
              outlined
              dense
              placeholder="Tên người nhận"
              :rules="[(v) => !!v || 'Tên người nhận là bắt buộc']"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="store.formData.phone"
              label="Số điện thoại"
              outlined
              dense
              placeholder="0473029182"
              :rules="[(v) => !!v || 'Số điện thoại là bắt buộc']"
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
              :rules="[(v) => !!v || 'Tỉnh/thành phố là bắt buộc']"
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
              :rules="[(v) => !!v || 'Quận/huyện là bắt buộc']"
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
              :rules="[(v) => !!v || 'Xã/phường/thị trấn là bắt buộc']"
              dense
            ></v-select>
          </v-col>

          <v-col cols="12" md="12">
            <v-text-field
              v-model="store.formData.detailAddress"
              label="Địa chỉ cụ thể"
              outlined
              dense
              placeholder="aaaaa"
              :rules="[(v) => !!v || 'Địa chỉ cụ thể là bắt buộc']"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="12" v-if="store.isNutDiaChi === false">
            <v-text-field
              v-model="email"
              label="Email"
              outlined
              dense
              placeholder="aaaaa"
              :rules="[(v) => !!v || 'email là bắt buộc để nhận thông tin đơn hàng']"
            ></v-text-field>
          </v-col>
          <!-- <v-col cols="12" md="6">
            <v-text-field
              v-model="store.formData.note"
              label="Ghi chú"
              outlined
              dense
            ></v-text-field>
          </v-col> -->
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
      <v-btn color="primary" @click="submitForm" :disabled="!valid">Đặt hàng</v-btn>
    </v-card-actions>
  </v-card>
  <diaLogDiaChiKhachHang :dialog="dialog"></diaLogDiaChiKhachHang>
</template>

<script setup>
import dia_log_dia_chi from "../admin/BanHangTaiQuay/dia_log_dia_chi.vue";
import diaLogDiaChiKhachHang from "./diaLogDiaChiKhachHang.vue";
import { taoLinkThanhToan } from "@/axios/payment";
import { onMounted, ref, watch } from "vue";
import { useAddressStore } from "@/store/diaChiStore";
import { thanhToanMuaNgay } from "@/axios/thanhtoan";
import { thanhToanNgay } from "@/axios/thanhtoan";
import { useCheckOutStore } from "@/store/checkOutStore";
import { useToast } from "vue-toastification";
import Sweetalert2 from "sweetalert2";
import { layDiaChiDauTienCuaKhachHangToken } from "@/axios/khachhang";
import { addMail } from "@/axios/email";
import { useCartStore } from "@/store/cartStore";
const cart = useCartStore()
const toast = useToast();
const checkOutStore = useCheckOutStore();
import useEmitter from "@/useEmitter";
import { useRouter } from "vue-router";
const emitter = useEmitter();
const deliveryMethod = ref("cod");
const store = useAddressStore();
const email = ref('')
const router = useRouter();
async function submitForm() {
  Sweetalert2.fire({
    title: "Hãy kiểm tra lại kĩ thông tin giao hàng nhé !",
    showCancelButton: true,
    confirmButtonText: "Đặt hàng",
    cancelButtonText: `Huỷ`,
  }).then(async (result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      if (deliveryMethod.value === "cod") {
        const selectedProvince = store.provinces.find(
          (p) => p.value === store.formData.province
        );
        const selectedDistrict = store.districts.find(
          (d) => d.value === store.formData.district
        );
        const selectedWard = store.wards.find(
          (w) => w.value === store.formData.ward
        );
        const chiTietHoaDon = checkOutStore.products.map((product) => ({
          chiTietSanPham: {
            ma: product.productGoc.code, // Giả sử product có trường ma
          },
          soLuong: product.soLuongChon, // Giả sử product có trường soLuong
          giaTungSanPham: product.productGoc.price, // Giả sử product có trường gia
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
            phiShip: checkOutStore.shippingFee,
            khuyenMaiHoaDon: {
              id: checkOutStore.idDiscount,
            },
          },
          chiTietHoaDon,
        };
        try {
          const result = await thanhToanMuaNgay(data);
          console.log(result)
          if (result.status === 200) {
            
            if(store.isNutDiaChi !== true)
            {
              await addMail(email.value,result.data.maHoaDon)
            }
            
            router.push(
              `/product/success/${
                result.data.maHoaDon
              }?soTien=${checkOutStore.tinhTongTien()}`
            );
            toast.success("Đặt hàng thành công");
            localStorage.setItem("cart-items",JSON.stringify([]))
            cart.items = []
          }
        } catch (e) {
          toast.error("Có lỗi xảy ra");
        }
      } else {
        const selectedProvince = store.provinces.find(
          (p) => p.value === store.formData.province
        );
        const selectedDistrict = store.districts.find(
          (d) => d.value === store.formData.district
        );
        const selectedWard = store.wards.find(
          (w) => w.value === store.formData.ward
        );
        const chiTietHoaDon = checkOutStore.products.map((product) => ({
          chiTietSanPham: {
            ma: product.productGoc.code, // Giả sử product có trường ma
          },
          soLuong: product.soLuongChon, // Giả sử product có trường soLuong
          giaTungSanPham: product.productGoc.price, // Giả sử product có trường gia
        }));
        const dataHoaDon = {
          hoaDon: {
            tenNguoiNhan: store.formData.ten,
            gia: checkOutStore.tinhTongTien(),
            tinhThanhPho: selectedProvince.text,
            quanHuyen: selectedDistrict.text,
            xaPhuongThiTran: selectedWard.text,
            diaChiCuThe: store.formData.detailAddress,
            dienThoai: store.formData.phone,
            loaiHoaDon: "Trực tuyến",
            phiShip: checkOutStore.shippingFee,

            khuyenMaiHoaDon: {
              id: checkOutStore.idDiscount,
            },
          },
          chiTietHoaDon,
        };
        try {
          const result = await thanhToanNgay(dataHoaDon);
          if (result.status === 200) {
            const dataThanhToan = {
              amount: checkOutStore.tinhTongTien(),
              ma: result.data.maHoaDon,
            };
            console.log(result);
            console.log(dataThanhToan);
            const data = await taoLinkThanhToan(dataThanhToan);
            if (data.data.code === "00") {
              window.open(data.data.data.checkoutUrl, "_blank");
            } else {
              toast.error("Có lỗi xảy ra");
            }
          } else {
            toast.error("Có lỗi xảy ra");
          }
        } catch (e) {
          toast.error("Kiểm tra lại các trường !");
        }
      }
    }
  });
}
const valid = ref(false)
const dialog = ref(false);
const openDiaChi = () => {
  dialog.value = true;
};
onMounted(async () => {
  const token = localStorage.getItem("token")
  if(token === null)
  {
    store.isNutDiaChi = false
  }
  await store.fetchProvinces();
  emitter.on("closeDialogDiaChi", (data) => {
    dialog.value = data;
  });
  const dataDiaChi = await layDiaChiDauTienCuaKhachHangToken();
  if (dataDiaChi.status === 200) {
    store.formData.ten = dataDiaChi.data.tenNguoiNhan;
    store.formData.phone = dataDiaChi.data.dienThoai;
    store.formData.detailAddress = dataDiaChi.data.diaChiCuThe;

    // Tìm và gán mã tỉnh/thành phố
    const province = store.provinces.find(
      (p) => p.text === dataDiaChi.data.tinhThanhPho
    );
    if (province) {
      store.formData.province = province.value;
      // Load districts cho tỉnh/thành được chọn
      await store.handleProvinceChange(province.value);
    }

    // Tìm và gán mã quận/huyện
    const district = store.districts.find(
      (d) => d.text === dataDiaChi.data.quanHuyen
    );
    if (district) {
      store.formData.district = district.value;
      // Load wards cho quận/huyện được chọn
      await store.handleDistrictChange(district.value);
    }

    // Tìm và gán mã phường/xã
    const ward = store.wards.find(
      (w) => w.text === dataDiaChi.data.xaPhuongThiTran
    );
    if (ward) {
      store.formData.ward = ward.value;
    }
  }
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
