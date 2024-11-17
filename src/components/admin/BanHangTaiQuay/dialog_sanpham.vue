<template>
  <teleport to='body'>
     <v-dialog v-model="dialogVisible" max-width="1300" persistent :scrollable="true">
    <template v-slot:default>
      <v-card title="Dialog" min-height="500" >
        <v-card-text>
          <sanpham_dialog></sanpham_dialog>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            text="Close Dialog"
            @click="closeDialog"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
  </teleport>
 
</template>

<script setup>
import sanpham_dialog from './sanpham_dialog.vue';
import { ref, watch, defineProps, onMounted } from 'vue';
import useEmitter from '@/useEmitter';
// import { getSanPhamTheoHoaDon } from '@/axios/hoadon';
const emitter = useEmitter();
// Định nghĩa props
const dataProps = defineProps({
  modal: Boolean
});

// Quản lý trạng thái hiển thị dialog
const dialogVisible = ref(dataProps.modal);
const idTab = ref("")
// Theo dõi thay đổi của prop modal để đồng bộ
watch(() => dataProps.modal, (newVal) => {
  dialogVisible.value = newVal;
});
onMounted(()=>{
  emitter.on("addTab",async data=>{
    idTab.value = data
})

})
// Hàm để đóng dialog và cập nhật lại giá trị prop
const closeDialog = async () => {
  
    // const result = (await getSanPhamTheoHoaDon(idTab.value)).data
    // emitter.emit("resultSanPhamHoaDon",result)
  
  dialogVisible.value = false;
  emitter.emit("close_dialog", false);
};
</script>

<style scoped>
/* Bạn có thể thêm các style tùy chỉnh ở đây nếu cần */
</style>
