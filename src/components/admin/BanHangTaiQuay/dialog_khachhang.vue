<template>
    <v-dialog v-model="dialogVisible" max-width="1300" persistent :scrollable="true">
      <template v-slot:default>
        <v-card title="Dialog" min-height="500" >
          <v-card-text>
            <khachhang_dialog></khachhang_dialog>
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
  </template>
  
  <script setup>
  
  import { ref, watch, defineProps } from 'vue';
  import useEmitter from '@/useEmitter';
  import khachhang_dialog from './khachhang_dialog.vue';

  const emitter = useEmitter();
  // Định nghĩa props
  const dataProps = defineProps({
    modal: Boolean
  });
  
  // Quản lý trạng thái hiển thị dialog
  const dialogVisible = ref(dataProps.modal);
  
  // Theo dõi thay đổi của prop modal để đồng bộ
  watch(() => dataProps.modal, (newVal) => {
    dialogVisible.value = newVal;
  });
  
  // Hàm để đóng dialog và cập nhật lại giá trị prop
  const closeDialog = () => {
    dialogVisible.value = false;
    emitter.emit("close_dialog", false);
  };
  </script>
  
  <style scoped>
  /* Bạn có thể thêm các style tùy chỉnh ở đây nếu cần */
  </style>
  