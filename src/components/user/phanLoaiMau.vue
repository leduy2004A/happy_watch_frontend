<template>
  <v-container>
    <v-row>
      <v-col
        v-for="(item, index) in chiTietSanPhamStore.lstSanPhamCungLoai.chiTietSanPhamList"
        :key="item.id"
        cols="6"
        md="3"
      >
   
          <v-card
          :elevation="selectedIndex === index ? 5 : 1"
          :class="{'selected-item': selectedIndex === index}"
          @click="selectItem(index, item.id)"
        >
          <v-img
            :src="item.hinhAnhUrls[0]"
            max-height="70"
            class="align-center"
            cover
          ></v-img>
          <v-card-text class="text-center pa-2">
            <div :class="{'text-primary': selectedIndex === index, 'text--secondary': selectedIndex !== index}">
              {{ formatPrice(item.giaSauGiam) }}
            </div>
            <div class="text-caption text--secondary">
              Mã: {{ item.ma }}
            </div>
          </v-card-text>
        </v-card>
    
      
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useChiTietSanPhamStore } from '@/store/chiTietSanPhamStore'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router';
const router = useRouter()
const chiTietSanPhamStore = useChiTietSanPhamStore()
const route = useRoute()
const selectedIndex = ref(0)

// Lấy danh sách chi tiết sản phẩm từ store
const chiTietSanPhamList = computed(() => {
  return chiTietSanPhamStore.lstSanPhamCungLoai
})

onMounted(() => {
  chiTietSanPhamStore.fetchChiTietSanPhamCungLoai(route.params.id)
  console.log(chiTietSanPhamStore.lstSanPhamCungLoai)
})

// Format giá tiền
const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price)
}

// Xử lý khi chọn sản phẩm
const selectItem = async (index, id) => {
  console.log('selectItem called with id:', id)
  try {
    await router.push(`/product/detail/${id}`)
    selectedIndex.value = index
  } catch (error) {
    console.error('Navigation error:', error)
  }
}
</script>

<style scoped>
.selected-item {
  border: 2px solid #1867C0; /* Màu primary của Vuetify */
}

.text-primary {
  color: #1867C0;
}

.text--secondary {
  color: rgba(0, 0, 0, 0.6);
}

.v-card {
  transition: all 0.3s ease;
}

.v-card:hover {
  transform: translateY(-2px);
}

.v-card-text {
  padding: 8px;
}
</style>