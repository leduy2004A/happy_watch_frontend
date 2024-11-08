<template>
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
          <v-btn color="error" variant="text" @click="close()"
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
</template>
<script setup>
import { ref,onMounted,watch } from 'vue';
import { useAddressStore } from "@/store/diaChiStore";
import { useKhachHangStore } from "@/store/khachHangStore";
import useEmitter from '@/useEmitter';
const emitter = useEmitter()
const store = useAddressStore()
const dialog = ref(false)
const props = defineProps({
  modal:Boolean
})
watch(()=>props.modal,(newVal)=>{
  dialog.value = newVal
})
onMounted(async () => {
  await store.fetchProvinces();
});
const close = ()=>{
  dialog.value = false
  emitter.emit("closeModalDiaChi",false)
}
</script>
<style scoped>
    
</style>