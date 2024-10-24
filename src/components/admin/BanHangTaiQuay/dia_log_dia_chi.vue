<template>
 
        <v-dialog max-width="1300" v-model="modal" persistent :scrollable="true">
    <template v-slot:default>
      <v-card title="Dialog" min-height="500">
        <v-card-text>
          <list_dia_chi></list_dia_chi>
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
import { ref,watch } from 'vue';
import useEmitter from '@/useEmitter';
import list_dia_chi from './list_dia_chi.vue';
const emitter = useEmitter()
const props = defineProps({
  dialog:Boolean
})
const modal = ref(false)
    const closeDialog = ()=>{
        emitter.emit("closeDialogDiaChi",false)
    }
    
    watch(() => props.dialog, (newValue) => {
      modal.value = newValue
});
    
    // modal.value = props.dialog
</script>
<style scoped>
    
</style>