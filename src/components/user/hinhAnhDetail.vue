<template>
  <v-app>
    <v-main>
      <v-container>
        <v-row>
          <v-col cols="12" md="12">
            <v-card flat variant="outlined">
              <!-- Carousel hình ảnh chính -->
              <v-carousel
                v-model="currentImage"
                hide-delimiters
                height="400"
                show-arrows="hover"
              >
                <v-carousel-item
                  v-for="(image, index) in useChiTietStore.chiTietSanPham.hinhAnhUrls"
                  :key="index"
                >
                  <v-img
                    :src="image"
                    height="400"
                    cover
                    class="align-center cursor-pointer"
                    @click="openModal"
                  ></v-img>
                </v-carousel-item>
              </v-carousel>

              <!-- Preview ảnh nhỏ -->
              <v-row justify="center" class="mt-4 pa-2">
                <v-col
                  v-for="(image, index) in useChiTietStore.chiTietSanPham.hinhAnhUrls"
                  :key="index"
                  cols="auto"
                >
                  <v-img
                    :src="image"
                    width="80"
                    height="80"
                    cover
                    class="thumbnail"
                    :class="{'selected-thumbnail': index === currentImage}"
                    @click="currentImage = index"
                  ></v-img>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <!-- Modal hiển thị ảnh phóng to -->
      <v-dialog
        v-model="showModal"
        fullscreen
        transition="dialog-bottom-transition"
        hide-overlay
      >
        <v-card class="modal-card">
          <!-- Thanh công cụ phía trên -->
          <v-toolbar dark color="primary">
            <v-btn icon @click="showModal = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>Hình ảnh {{ currentImage + 1 }}/{{ useChiTietStore.chiTietSanPham.hinhAnhUrls.length }}</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>

          <!-- Phần hiển thị ảnh -->
          <v-card-text class="modal-content pa-0">
            <v-carousel
              v-model="currentImage"
              height="calc(100vh - 64px)"
              hide-delimiters
              show-arrows="hover"
            >
              <v-carousel-item
                v-for="(image, index) in useChiTietStore.chiTietSanPham.hinhAnhUrls"
                :key="index"
              >
                <div class="d-flex justify-center align-center" style="height: 100%">
                  <v-img
                    :src="image"
                    max-height="90vh"
                    contain
                    class="modal-image"
                  ></v-img>
                </div>
              </v-carousel-item>
            </v-carousel>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-main>
  </v-app>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useChiTietSanPhamStore } from '@/store/chiTietSanPhamStore';
const useChiTietStore = useChiTietSanPhamStore()
import { useRoute } from 'vue-router';
const route = useRoute()
const currentImage = ref(0)
const showModal = ref(false)
const watchImages = [
  'https://tintuc.dienthoaigiakho.vn/wp-content/uploads/2023/04/hinh-nen-3d-dep-10.jpg',
  'https://img.pikbest.com/origin/06/43/44/88JpIkbEsTsAQ.jpg!w700wp',
  'https://cdn.pixabay.com/photo/2023/04/26/17/59/wrist-watch-7953062_640.jpg',
]
onMounted(()=>{
  useChiTietStore.fetchChiTietSanPham(route.params.id)
})
function openModal() {
  showModal.value = true
}
</script>

<style scoped>
.thumbnail {
  cursor: pointer;
  border: 2px solid transparent;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.selected-thumbnail {
  border-color: #1867C0;
  transform: scale(1.05);
}

.thumbnail:hover {
  opacity: 0.8;
}

.modal-card {
  background: #121212;
}

.modal-content {
  height: calc(100vh - 64px);
  background: #121212;
}

.modal-image {
  max-width: 90vw;
}

.cursor-pointer {
  cursor: pointer;
}

/* Tùy chỉnh màu nút điều hướng trong modal */
:deep(.v-carousel .v-btn) {
  background-color: rgba(255, 255, 255, 0.1) !important;
}

:deep(.v-carousel .v-btn:hover) {
  background-color: rgba(255, 255, 255, 0.2) !important;
}
</style>