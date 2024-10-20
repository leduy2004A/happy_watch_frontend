<template>
  <div class="diachi2">
      <v-form ref="formRef" v-model="valid">
   
      <v-btn variant="outlined" class="mb-5 diachi"> thêm địa chỉ </v-btn>
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

        <!-- Tỉnh/thành phố, Quận/huyện, Xã/phường -->
        <v-col cols="12" md="4">
          <v-select
            v-model="formData.province"
            :items="provinces"
            label="Tỉnh/thành phố"
            item-title="text"
            item-value="value"
            outlined
            dense
            @update:modelValue="handleProvinceChange"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-select
            v-model="formData.district"
            :items="districts"
            label="Quận/huyện"
            item-title="text"
            item-value="value"
            outlined
            dense
            @update:modelValue="handleDistrictChange"
          ></v-select>
        </v-col>
        <v-col cols="12" md="4">
          <v-select
            v-model="formData.ward"
            :items="wards"
            label="Xã/phường/thị trấn"
            item-title="text"
            item-value="value"
            outlined
            dense
          ></v-select>
        </v-col>

        <!-- Địa chỉ cụ thể và Ghi chú -->
        <v-col cols="12" md="6">
          <v-text-field
            v-model="formData.detailAddress"
            label="Địa chỉ cụ thể"
            outlined
            dense
            placeholder="aaaaa"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="formData.note"
            label="Ghi chú"
            outlined
            dense
          ></v-text-field>
        </v-col>
      </v-row>
      <giao_hang_nhanh></giao_hang_nhanh>
    
   
  </v-form>
  </div>

   
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { getTinhThanh, getQuanHuyen, getPhuongXa } from "@/axios/diachi";
import { xacNhanDonHang } from "@/axios/hoadon";
import giao_hang_nhanh from "./giao_hang_nhanh.vue";
import useEmitter from "@/useEmitter";
const emitter = useEmitter()
const valid = ref(true);
const thoiGianDuKien = ref({})
const formData = ref({
  ten: "",
  address: "",
  phone: "",
  province: "Son La",
  district: "",
  ward: "",
  detailAddress: "",
  note: "",
});
watch(
  () => formData.value,
  async (newFormData) => {
    if (newFormData.province && newFormData.district && newFormData.ward) {
      const data = {
        province: newFormData.province,
        district: newFormData.district,
        ward: newFormData.ward
      };
      console.log(data)
    emitter.emit("dataShip",data)
    }
  },
  { deep: true }
);
const provinces = ref(["Son La", "Hà Nội", "TP.HCM"]);
const districts = ref(["Huyện Quỳnh...", "Huyện A", "Huyện B"]);
const wards = ref(["Xã Mường Gi...", "Xã X", "Xã Y"]);
const hoaDonId = ref(0)
const props = defineProps({
  diachi: {
    type: Object,
    default: () => ({}),
  },
});
onMounted(async () => {
  try {
    const apiProvince = await getTinhThanh();
    if (apiProvince.status === 200) {
      provinces.value = apiProvince.data.data.map((province) => ({
        text: province.ProvinceName,
        value: province.ProvinceID,
      }));
    }
  } catch (error) {
    console.error("Error fetching provinces:", error);
  }
  emitter.on("addTab",(data)=>{
    hoaDonId.value = data
  })
  emitter.on("orderClick",async ()=>{
    const data = {
      hoaDonId:hoaDonId.value,
      province:formData.value.province,
      district:formData.value.district,
      ward:formData.value.ward,
      diaChiCuThe:formData.value.detailAddress + ', '+formData.value.ward+', ' +formData.value.district+', '+formData.value.province,
      dienThoai:formData.value.phone
    }
    const result = await xacNhanDonHang(data)
    console.log(result)
  })
  
});

// Update formData when props.diachi changes
 watch(
  () => props.diachi,
  async (newDiachi) => {
    try {
      if (newDiachi) {
        const { tinhThanhPho, dienThoai, quanHuyen, xaPhuongThiTran, nguoiDung } = newDiachi;

        // Lấy dữ liệu tỉnh/thành phố từ API trước
        const apiProvince = await getTinhThanh();
        if (apiProvince.status === 200) {
          provinces.value = apiProvince.data.data.map((province) => ({
            text: province.ProvinceName,
            value: province.ProvinceID,
          }));
          
          // Tìm ID tỉnh/thành phố dựa trên tên
          const foundProvince = apiProvince.data.data.find(
            p => p.ProvinceName.toLowerCase() === tinhThanhPho?.toLowerCase()
          );

          if (foundProvince) {
            formData.value.province = foundProvince.ProvinceID;
            
            // Lấy danh sách quận/huyện của tỉnh đó
            const apiDistrict = await getQuanHuyen(foundProvince.ProvinceID);
            if (apiDistrict.status === 200) {
              districts.value = apiDistrict.data.data.map((district) => ({
                text: district.DistrictName,
                value: district.DistrictID,
              }));
              
              // Tìm ID quận/huyện dựa trên tên
              const foundDistrict = apiDistrict.data.data.find(
                d => d.DistrictName.toLowerCase() === quanHuyen?.toLowerCase()
              );

              if (foundDistrict) {
                formData.value.district = foundDistrict.DistrictID;
                
                // Lấy danh sách phường/xã của quận/huyện đó
                const apiWard = await getPhuongXa(foundDistrict.DistrictID);
                if (apiWard.status === 200) {
                  wards.value = apiWard.data.data.map((ward) => ({
                    text: ward.WardName,
                    value: ward.WardCode,
                  }));
                  
                  // Tìm code phường/xã dựa trên tên
                  const foundWard = apiWard.data.data.find(
                    w => w.WardName.toLowerCase() === xaPhuongThiTran?.toLowerCase()
                  );

                  if (foundWard) {
                    formData.value.ward = foundWard.WardCode;
                  }
                }
              }
            }
          }
        }

        // Cập nhật các thông tin khác
        formData.value.phone = dienThoai ?? "";
        formData.value.ten = nguoiDung?.ten ?? "";
      }
    } catch (error) {
      console.error('Error updating address:', error);
    }
  },
  { immediate: true, deep: true }
);
// Ref for form
const formRef = ref(null);

const handleProvinceChange = async (provinceId) => {
  console.log(provinceId)
  try {
    const apiDistrict = await getQuanHuyen(provinceId);
    if (apiDistrict.status === 200) {
      districts.value = apiDistrict.data.data.map((district) => ({
        text: district.DistrictName,
        value: district.DistrictID,
      }));
    }
  } catch (error) {
    console.error("Error fetching district:", error);
  }
};
const handleDistrictChange = async (districtId) => {
  try {
    const apiWard = await getPhuongXa(districtId);
    if (apiWard.status === 200) {
      wards.value = apiWard.data.data.map((ward) => ({
        text: ward.WardName,
        value: ward.WardCode,
      }));
    }
  } catch (error) {
    console.error("Error fetching ward:", error);
  }
};
</script>

<style scoped>
.v-card {
  margin-top: 20px;
}
.diachi {
  width: 100%;
  display: flex;
  align-self: flex-end;
}
.diachi2{
  width: 600px;
}
</style>
