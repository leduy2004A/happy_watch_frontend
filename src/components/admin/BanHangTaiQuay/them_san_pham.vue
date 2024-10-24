<template>
  <div v-if="hoaDonStore.hoaDonId !=0">
    <!-- Header chứa thông tin sản phẩm -->
    <div class="header mb-4">
      <v-card variant="outlined" class="pa-4" color="#F3E5F5" style="border-radius: 12px;">
        <div class="d-flex justify-space-between align-center">
          <div class="header-title text-h6 font-weight-bold">
            Sản phẩm
          </div>

          <div class="header-actions">
            <v-btn color="#8E24AA" class="mr-3 white--text" elevation="2">
              Quét QR sản phẩm
            </v-btn>
            <v-btn color="#AB47BC" class="white--text" elevation="2" @click="openDialog()">
              Thêm sản phẩm
            </v-btn>
          </div>
        </div>
      </v-card>
    </div>

    <!-- Nội dung các tab sản phẩm -->
    <div class="content">
      <v-tabs-window v-model="tab" class="product-tabs">
        <v-tabs-window-item
          v-for="item in tabs"
          :key="item.id"
          :value="item.id"
          class="tab-item"
        >
          <san_pham 
            :lstSanPham="lstSanPham" 
            :key="`${item.id}-${lstSanPham.length}-${reloadKey}`" 
            :hoa_don_id="tab"
          ></san_pham>
        </v-tabs-window-item>
      </v-tabs-window>
    </div>
  </div>
  <dialog_sanpham :modal="modal"></dialog_sanpham>
</template>

<script setup>
import { getSanPhamTheoHoaDon } from '@/axios/hoadon';
import { addSanPhamVaoHoaDon } from '@/axios/hoadon';
import useEmitter from '@/useEmitter';
import san_pham from './san_pham.vue';
import { onMounted, ref, watch } from 'vue';
import dialog_sanpham from './dialog_sanpham.vue';
import { useInvoiceStore } from "@/store/invoiceStore";
import { useToast } from 'vue-toastification';
const toast = useToast()
const hoaDonStore = useInvoiceStore();
const emitter = useEmitter()
const tab = ref(0)
const tabs = ref([])
const modal = ref(false)
const lstSanPham = ref([])
const tongSanPhamTrongHoaDon = ref([])
const reloadKey = ref(0) // Added to force re-render

const dataAdd = ref({
  hoaDonId: 0,
  chiTietSanPhamId: 0,
  gia: 0,
  soLuong:0
})

// Tách logic load sản phẩm thành function riêng
const loadProducts = async (tabId) => {
  try {
    const result = await getSanPhamTheoHoaDon(tabId);
    
    if (result.status === 200) {
      lstSanPham.value = result.data.chiTietHoaDons;
      tongSanPhamTrongHoaDon.value = result.data
      emitter.emit("tongsanpham", result.data)
      // Force re-render
      reloadKey.value++
    } else {
      console.log("Không có sản phẩm phù hợp.");
      lstSanPham.value = [];
    }
  } catch (error) {
    console.error("Đã xảy ra lỗi khi lấy sản phẩm:", error);
    lstSanPham.value = [];
  }
}

// Watch sự thay đổi của tab
watch(tab, async (newTabId) => {
  if (newTabId) {
    await loadProducts(newTabId)
  }
}, { immediate: true })

onMounted(() => {
  emitter.on("addTab", async data => {
    tab.value = data
    await loadProducts(data)
  })

  emitter.on("getTab", data => {
    tabs.value = data
  })

  emitter.on("close_dialog", data => {
    modal.value = data
  })

  emitter.on("chiTietSanPhamId", async data => {
    dataAdd.value.chiTietSanPhamId = data.chiTietSanPhamId
    dataAdd.value.gia = data.giaSauGiam
    dataAdd.value.hoaDonId = tab.value
    dataAdd.value.soLuong = data.soLuong
    console.log(dataAdd.value)
    const dataResult = await addSanPhamVaoHoaDon(dataAdd.value)
    if(dataResult.status === 200)
    {
      toast.success("Thêm sản phẩm thành công")
      emitter.emit("closeChonSanPham",false)
    }
    // Reload products after adding new product
    await loadProducts(tab.value)
  })
})

const openDialog = async () => {
  modal.value = true
}
</script>

<style scoped>
/* Style cho phần header */
.header {
  margin-bottom: 24px;
}

.header-title {
  color: #4A148C;
}

.header-actions .v-btn {
  padding: 10px 20px;
  border-radius: 8px;
}

/* Style cho tabs */
.product-tabs .tab-item {
  background-color: #F3E5F5;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
}

.tab-item {
  font-size: 18px;
  color: #4A148C;
}

.tab-item .san_pham {
  margin-top: 16px;
}

</style>
