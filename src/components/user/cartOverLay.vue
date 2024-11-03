<template>
  <v-dialog
    v-model="dialog"
    transition="dialog-bottom-transition"
    persistent
    class="dialog"
  >
  
    <v-card class="v-card--right" height="900">
      <v-toolbar>
        <v-btn icon="mdi-close" @click="closeDialog()"></v-btn>
      </v-toolbar>

      <cartModal></cartModal>
      
    </v-card>
  </v-dialog>
</template>

<script setup>
import cartModal from "./cartModal.vue";
import { onMounted, ref, watch } from "vue";
import useEmitter from "@/useEmitter";
const emitter = useEmitter()
const dialog = ref(false);
const notifications = ref(false);
const sound = ref(true);
const widgets = ref(false);
const props = defineProps({
  modal:Boolean
})
watch(
  () => props.modal,
  (newVal) => {
    dialog.value = newVal;
  }
);
const closeDialog = ()=>{
  dialog.value = false
  emitter.emit("closeCartModal",false)
}
onMounted(()=>{
  emitter.on("openModalCart",data =>{
    dialog.value = data
  })
})
</script>
<style scoped>
.v-card--right {
  position: absolute;
  right: -25px;
  top: -350px;
  height: 500px;
  max-width: 300px;
}
</style>
