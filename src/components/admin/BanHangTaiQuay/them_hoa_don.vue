<template>
  <div class="add-hoa-don">
    <v-divider :thickness="2" color="primary" class="mb-4"></v-divider>

    <v-card-text class="text-end d-flex justify-end align-center mb-4">
      <v-btn
        append-icon="mdi-invoice-remove"
        prepend-icon="mdi-close-circle"
        class="btn-huy mr-4"
        :disabled="!invoiceStore.hasTabs"
        text="Huỷ hoá đơn"
        variant="text"
        @click="handleRemoveInvoice"
      >
        <template v-slot:prepend>
          <v-icon color="red"></v-icon>
        </template>
        <template v-slot:append>
          <v-icon color="red"></v-icon>
        </template>
      </v-btn>

      <v-btn
        append-icon="mdi-invoice-plus"
        prepend-icon="mdi-check-circle"
        class="btn-add"
        text="Thêm hoá đơn"
        variant="contained"
        @click="handleAddInvoice"
      >
        <template v-slot:prepend>
          <v-icon color="green"></v-icon>
        </template>
        <template v-slot:append>
          <v-icon color="green"></v-icon>
        </template>
      </v-btn>
    </v-card-text>

    <v-tabs
      v-model="selectedTab"
      align-with-title
      class="mb-3"
    >
      <v-tab
        v-for="tabItem in invoiceStore.getAllTabs"
        :key="tabItem.id"
        :text="`Đơn hàng - ${tabItem.ma}`"
        prepend-icon="mdi-cart"
        :value="tabItem"
        @click="handleTabClick(tabItem.id)"
        class="tab-item"
      ></v-tab>
    </v-tabs>

    <v-divider :thickness="2" color="primary" class="mt-4"></v-divider>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useInvoiceStore } from '@/store/invoiceStore'
import { useKhachHangStore } from '@/store/khachHangStore';
import { useOrderStore } from '@/store/tienStore';
const orderStore = useOrderStore()
const khachHangStore = useKhachHangStore()
import useEmitter from '@/useEmitter'
const hoa_don_id = ref(0)
const emitter = useEmitter()
const invoiceStore = useInvoiceStore()
const selectedTab = ref(null)

onMounted(async () => {
  const tabs = await invoiceStore.fetchInvoices()
  emitter.emit("getTab", tabs)
})

const handleTabClick = (tabId) => {
  
  invoiceStore.setHoaDonId(tabId)
  emitter.emit("addTab", tabId)
}

const handleAddInvoice = async () => {
  try {
    // invoiceStore.setHoaDonId(tabId)
    
    console.log(hoa_don_id.value)
    const newInvoice = await invoiceStore.addNewInvoice()
    invoiceStore.hoaDonId = newInvoice.id
    selectedTab.value = newInvoice
    emitter.emit("getTab", invoiceStore.getAllTabs)
    emitter.emit("addTab", newInvoice.id)
  } catch (error) {
    console.error('Error adding invoice:', error)
  }
}

const handleRemoveInvoice = async () => {
  try {
    const result = await invoiceStore.removeInvoice(selectedTab.value)
    if (result) {
      selectedTab.value = result // Cập nhật giá trị cho selectedTab

      emitter.emit("addTab", result.id)
    } else {
      selectedTab.value = null
    
    }
    emitter.emit("getTab", invoiceStore.getAllTabs)

  } catch (error) {
    console.error('Error removing invoice:', error)
  }
}
</script>

<style scoped>
.btn-huy {
  background-color: #fce4ec;
  color: #e91e63;
  border-radius: 8px;
  font-weight: bold;
}

.btn-add {
  background-color: #e8f5e9;
  color: #4caf50;
  border-radius: 8px;
  font-weight: bold;
}

.v-btn {
  padding: 10px 20px;
}

.tab-item {
  font-size: 16px;
  font-weight: 500;
  padding: 10px 20px;
  color: #1976d2;
}

.add-hoa-don {
  background-color: #f4f6f8;
}

.header-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

/* Các style khác giữ nguyên như cũ */
</style>