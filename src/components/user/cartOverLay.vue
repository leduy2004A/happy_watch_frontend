<template>
  <Dialog 
    v-model:visible="dialog" 
    position="right" 
    :modal="true"
    :closable="false"
    :draggable="false"
    class="cart-dialog"
  >
    <template #header>
      <div class="dialog-header">
        <Button 
          icon="pi pi-times" 
          @click="closeDialog()" 
          class="p-button-text"
        />
      </div>
    </template>

    <cartModal></cartModal>

  </Dialog>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import cartModal from "./cartModal.vue";
import useEmitter from "@/useEmitter";

const emitter = useEmitter();
const dialog = ref(false);
const notifications = ref(false);
const sound = ref(true);
const widgets = ref(false);

const props = defineProps({
  modal: Boolean
});

watch(
  () => props.modal,
  (newVal) => {
    dialog.value = newVal;
  }
);

const closeDialog = () => {
  dialog.value = false;
  emitter.emit("closeCartModal", false);
};

onMounted(() => {
  emitter.on("openModalCart", data => {
    dialog.value = data;
  });
});
</script>

<style scoped>
.cart-dialog {
  max-width: 300px;
  height: 500px;
  margin: 0;
}

:deep(.p-dialog) {
  margin: 0;
  position: fixed;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

:deep(.p-dialog-header) {
  padding: 0.5rem;
}

:deep(.p-dialog-content) {
  height: calc(100% - 57px);
  overflow-y: auto;
}

.dialog-header {
  display: flex;
  justify-content: flex-end;
}

:deep(.p-button.p-button-text) {
  padding: 0.5rem;
}
</style>