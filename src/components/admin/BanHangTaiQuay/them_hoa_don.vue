<template>
  <div class="add-hoa-don">
    <!-- Divider trên cùng -->
    <v-divider :thickness="2" color="primary" class="mb-4"></v-divider>

    <!-- Các nút hủy và thêm hoá đơn -->
    <v-card-text class="text-end d-flex justify-end align-center mb-4">
      <v-btn
        append-icon="mdi-invoice-remove"
        prepend-icon="mdi-close-circle"
        class="btn-huy mr-4"
        :disabled="!tabs.length"
        text="Huỷ hoá đơn"
        variant="text"
        @click="removeTab"
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
        @click="addTab"
      >
        <template v-slot:prepend>
          <v-icon color="green"></v-icon>
        </template>
        <template v-slot:append>
          <v-icon color="green"></v-icon>
        </template>
      </v-btn>
    </v-card-text>

    <!-- Tabs chứa các đơn hàng -->
    <v-tabs v-model="tab" align-with-title class="mb-3">
      <v-tab
        v-for="tabItem in tabs"
        :key="tabItem"
        :text="`Đơn hàng - ${tabItem.ma}`"
        prepend-icon="mdi-cart"
        :value="tabItem"
        @click="naonaonao(tabItem.id)"
        class="tab-item"
      ></v-tab>
    </v-tabs>

    <!-- Divider dưới -->
    <v-divider :thickness="2" color="primary" class="mt-4"></v-divider>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import useEmitter from '@/useEmitter';
import { addHoaDon } from '@/axios/hoadon';
import { hienThiHoaDonChoThanhToan } from '@/axios/hoadon';
import { huyHoaDon } from '@/axios/hoadon';
const emitter = useEmitter()
const tabs = ref([])
const tab = ref(null)
const idHoaDon = ref("")
let nextOrderNumber = ref(1)
onMounted(async ()=>{
  const dataResult = (await hienThiHoaDonChoThanhToan()).data;
console.log(dataResult);

dataResult.forEach(hoaDon => {
  const dataAddHoadon = {
    ma: hoaDon.ma,
    id: hoaDon.id
  };

  console.log(dataAddHoadon);
  tabs.value.push(dataAddHoadon);
  tab.value = nextOrderNumber.value
  nextOrderNumber.value++
  emitter.emit("getTab", tabs.value)
});

})
const naonaonao = (tab) => {
  idHoaDon.value = tab
  emitter.emit("addTab", tab)
}

const addTab = async () => {
  try {
    // Tạo hoá đơn mới
    const data = await (await addHoaDon()).data
    const dataAddHoadon = {
      ma: data.ma,
      id: data.id
    }
    
    tabs.value.push(dataAddHoadon)
  
    tab.value = dataAddHoadon
    emitter.emit("getTab", tabs.value)
    emitter.emit("addTab", dataAddHoadon.id)

  } catch (error) {
    console.error('Lỗi khi thêm hoá đơn:', error)
  }
}

const removeTab = async () => {
  try {
    const currentTab = tab.value
    const currentIndex = tabs.value.findIndex(t => t.id === currentTab.id)
    
    if (currentIndex !== -1) {
      // Huỷ hoá đơn trong database
      await huyHoaDon(currentTab.id)
      
      // Xoá tab khỏi danh sách
      tabs.value.splice(currentIndex, 1)

      if (tabs.value.length > 0) {
        // Nếu còn tab thì chuyển đến tab gần nhất
        // Ưu tiên tab phía sau, nếu không có thì lấy tab trước
        const nextIndex = currentIndex < tabs.value.length 
          ? currentIndex 
          : tabs.value.length - 1
          
        tab.value = tabs.value[nextIndex]
        // Emit để load dữ liệu của tab mới
        emitter.emit("addTab", tab.value.id)
      } else {
        tab.value = null
      }
      
      // Emit để cập nhật UI
      emitter.emit("getTab", tabs.value)
    }
  } catch (error) {
    console.error('Lỗi khi huỷ hoá đơn:', error) 
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
  background-color: #f4f6f8; /* Màu nền nhẹ nhàng hơn */
}

/* Tiêu đề */
.header-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

/* Nút bấm */
.v-btn {
  font-size: 14px;
  font-weight: 500;
  border-radius: 8px;
  padding: 10px 16px;
}

.btn-huy {
  background-color: #ffebee;
  color: #d32f2f;
}

.btn-add {
  background-color: #e8f5e9;
  color: #388e3c;
}

.btn-scan {
  background-color: #d1c4e9;
  color: #5e35b1;
}

.btn-add-product {
  background-color: #d1c4e9;
  color: #5e35b1;
}

/* Tabs */
.v-tab {
  font-size: 14px;
  font-weight: 500;
  color: #3f51b5;
  padding: 8px 12px;
}

/* Giá sản phẩm */
.product-price-old {
  color: #9e9e9e;
  text-decoration: line-through;
  font-size: 14px;
}

.product-price-new {
  color: #d32f2f;
  font-size: 16px;
  font-weight: 500;
}
</style>
