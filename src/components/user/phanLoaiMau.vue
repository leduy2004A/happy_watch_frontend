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
          :elevation="isSelected(item.id) ? 5 : 1"
          :class="{'selected-item': isSelected(item.id)}"
          @click="selectItem(index, item.id)"
        >
          <v-img
            :src="item.hinhAnhUrls[0]"
            max-height="70"
            class="align-center"
            cover
          ></v-img>
          <v-card-text class="text-center pa-2">
            <div :class="{'text-primary': isSelected(item.id), 'text--secondary': !isSelected(item.id)}">
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
import { onMounted, watch } from 'vue'
import { useChiTietSanPhamStore } from '@/store/chiTietSanPhamStore'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const chiTietSanPhamStore = useChiTietSanPhamStore()

// Kiểm tra sản phẩm có được chọn không
const isSelected = (id) => {
  return id === parseInt(route.params.id)
}

const loadData = async (id) => {
  // Reset data trước khi load mới
  chiTietSanPhamStore.resetState()
  await Promise.all([
    chiTietSanPhamStore.fetchChiTietSanPham(id),
    chiTietSanPhamStore.fetchChiTietSanPhamCungLoai(id)
  ])
}

// Theo dõi thay đổi route
watch(
  () => route.params.id,
  async (newId, oldId) => {
    if (newId && newId !== oldId) {
      await loadData(newId)
    }
  }
)

onMounted(async () => {
  if (route.params.id) {
    await loadData(route.params.id)
  }
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
  try {
    await router.push(`/product/detail/${id}`)
  } catch (error) {
    console.error('Navigation error:', error)
  }
}
</script>

<style scoped>
.selected-item {
  border: 2px solid #1867C0;
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