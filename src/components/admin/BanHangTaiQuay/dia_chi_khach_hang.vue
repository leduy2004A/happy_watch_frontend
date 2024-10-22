<template>

      <div class="diachi2">
    <v-form ref="formRef" v-model="store.valid">
      <v-btn variant="outlined" class="mb-5 diachi"> thêm địa chỉ </v-btn>
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
      <giao_hang_nhanh></giao_hang_nhanh>
    </v-form>
  </div>


</template>

<script setup>
import { useToast } from "vue-toastification";
import { ref, onMounted, watch } from "vue"
import { useAddressStore } from "@/store/diaChiStore";
import { useOrderStore } from "@/store/tienStore";
import giao_hang_nhanh from "./giao_hang_nhanh.vue"
import useEmitter from "@/useEmitter";
const emitter = useEmitter()
const store = useAddressStore()
const formRef = ref(null)
const tienStore = useOrderStore()
const toast = useToast()
const props = defineProps({
  diachi: {
    type: Object,
    default: () => ({}),
  },
})

// Watch for changes in address data to emit shipping info
watch(
  () => store.getFormData,
  async (newFormData) => {
    if (newFormData.province && newFormData.district && newFormData.ward) {
      emitter.emit("dataShip", store.getShippingData)
    }
  },
  { deep: true }
)

// Watch for changes in props.diachi
watch(
  () => props.diachi,
  async (newDiachi) => {
    await store.updateAddressFromProps(newDiachi)
  },
  { immediate: true, deep: true }
)

onMounted(async () => {
  await store.fetchProvinces()
  
  emitter.on("addTab", (data) => {
    store.setHoaDonId(data)
  })
  
  emitter.on("orderClick", async () => {
    console.log("duy nè")
    try {
      const result = await store.xacNhanDonHang()
      console.log(result)
      if(result.status == 200)
      {
        toast.success("Đã xác nhận đơn hàng")
        setTimeout(()=>{
          window.location.href = window.location.href
        },2000)
        
      }
      
    } catch (error) {
      toast.error("Có lỗi xảy ra")
      
    }
  })
})
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
.diachi2 {
  width: 600px;
}

</style>