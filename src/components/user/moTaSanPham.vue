<template>
  <v-container class="description-container">
    <!-- Mô tả sản phẩm -->
    <v-row>
      <v-col>
        <div class="description-section">
          <div class="heading-wrapper">
            <v-icon large color="primary" class="mr-2">mdi-information</v-icon>
            <h2 class="text-h5 font-weight-bold">MÔ TẢ SẢN PHẨM</h2>
          </div>
          <v-divider class="my-4"></v-divider>
          <div class="content-wrapper" :class="{ 'content-short': isShortDescription }">
            <p v-if="dataMotaSanPham" class="description-text">
              {{ dataMotaSanPham }}
            </p>
            <p v-else class="no-content">
              Chưa có mô tả cho sản phẩm này
            </p>
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- Mô tả chi tiết -->
    <v-row>
      <v-col>
        <div class="description-section">
          <div class="heading-wrapper">
            <v-icon large color="primary" class="mr-2">mdi-text-box</v-icon>
            <h2 class="text-h5 font-weight-bold">MÔ TẢ CHI TIẾT SẢN PHẨM</h2>
          </div>
          <v-divider class="my-4"></v-divider>
          <div class="content-wrapper" :class="{ 'content-short': isShortDetailDescription }">
            <p v-if="dataMotaCTSanPham" class="description-text">
              {{ dataMotaCTSanPham }}
            </p>
            <p v-else class="no-content">
              Chưa có mô tả chi tiết cho sản phẩm này
            </p>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { layMoTaCTSP } from '@/axios/sanpham';
import { onMounted, ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useLoading } from "vue-loading-overlay";

const $loading = useLoading({
  loader: "bars",
  lockScroll: false,
  color: "orange",
  isFullPage: true,
  container: null,
});

const toast = useToast()
const route = useRoute()
const dataMotaSanPham = ref('')
const dataMotaCTSanPham = ref('')

const isShortDescription = computed(() => {
  return dataMotaSanPham.value.length < 100;
})

const isShortDetailDescription = computed(() => {
  return dataMotaCTSanPham.value.length < 100;
})

onMounted(async () => {
  const loader = $loading.show();
  try {
    const resultBinhLuan = await layMoTaCTSP(route.params.id)
    if(resultBinhLuan.status === 200) {
      dataMotaSanPham.value = resultBinhLuan.data.moTaSanPham
      dataMotaCTSanPham.value = resultBinhLuan.data.moTaChiTietSP
    }
  } catch(e) {
    toast.error("Lỗi lấy ra mô tả")
  } finally {
    loader.hide()
  }
})
</script>

<style scoped>
.description-container {
  max-width: 1200px;
  margin: 0 auto;
}

.description-section {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 24px;
}

.heading-wrapper {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.text-h5 {
  color: #673ab7;
  margin: 0;
  font-size: 1.5rem;
}

.content-wrapper {
  min-height: 100px;
  padding: 16px;
  background: #F8FAFC;
  border-radius: 4px;
}

.content-short {
  display: flex;
  align-items: center;
  justify-content: center;
}

.description-text {
  margin: 0;
  line-height: 1.6;
  color: #333;
}

.no-content {
  text-align: center;
  color: #999;
  font-style: italic;
}

@media (max-width: 600px) {
  .description-section {
    padding: 16px;
  }
  
  .text-h5 {
    font-size: 1.2rem;
  }
  
  .content-wrapper {
    padding: 12px;
  }
}
</style>