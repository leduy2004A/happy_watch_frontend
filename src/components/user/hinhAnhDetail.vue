<template>
  <v-app>
    <v-main>
      <v-container>
        <v-row>
          <v-col cols="12" md="12">
            <v-card class="image-gallery-card" elevation="0">
              <!-- Carousel hình ảnh chính -->
              <v-carousel
                v-model="currentImage"
                hide-delimiters
                height="500"
                show-arrows="hover"
                class="main-carousel"
              >
                <v-carousel-item
                  v-for="(image, index) in useChiTietStore.chiTietSanPham.hinhAnhUrls"
                  :key="index"
                >
                  <v-img
                    :src="image"
                    height="500"
                    cover
                    class="align-center cursor-pointer main-image"
                    @click="openModal"
                  ></v-img>
                </v-carousel-item>
              </v-carousel>

              <!-- Preview ảnh nhỏ -->
              <v-sheet class="thumbnail-container mx-auto mt-4" max-width="800">
                <v-slide-group
                  v-model="currentImage"
                  show-arrows
                  class="pa-2"
                >
                  <v-slide-group-item
                    v-for="(image, index) in useChiTietStore.chiTietSanPham.hinhAnhUrls"
                    :key="index"
                    v-slot="{ isSelected, toggle }"
                  >
                    <v-card
                      class="ma-2 thumbnail-card"
                      :class="{ 'selected-thumbnail': isSelected }"
                      @click="currentImage = index"
                    >
                      <v-img
                        :src="image"
                        width="100"
                        height="100"
                        cover
                        class="thumbnail"
                      ></v-img>
                    </v-card>
                  </v-slide-group-item>
                </v-slide-group>
              </v-sheet>
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
          <v-toolbar flat dark color="transparent" class="modal-toolbar">
            <v-btn icon @click="showModal = false" class="close-btn">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <div class="image-counter">
              {{ currentImage + 1 }}/{{ useChiTietStore.chiTietSanPham.hinhAnhUrls.length }}
            </div>
          </v-toolbar>

          <v-card-text class="modal-content pa-0">
            <v-carousel
              v-model="currentImage"
              height="calc(100vh - 64px)"
              hide-delimiters
              show-arrows="hover"
              class="modal-carousel"
            >
              <v-carousel-item
                v-for="(image, index) in useChiTietStore.chiTietSanPham.hinhAnhUrls"
                :key="index"
              >
                <div class="d-flex justify-center align-center modal-image-container">
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

onMounted(()=>{
  useChiTietStore.fetchChiTietSanPham(route.params.id)
})

function openModal() {
  showModal.value = true
}
</script>

<style scoped>
.image-gallery-card {
  background: transparent;
  border-radius: 16px;
  overflow: hidden;
}

.main-carousel {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
}

.main-image {
  transition: transform 0.3s ease;
}

.main-image:hover {
  transform: scale(1.02);
}

.thumbnail-container {
  background: transparent;
}

.thumbnail-card {
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.thumbnail {
  cursor: pointer;
  transition: all 0.3s ease;
}

.selected-thumbnail {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(24, 103, 192, 0.3);
  border: 2px solid #1867C0;
}

.thumbnail-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 16px rgba(0,0,0,0.15);
}

.modal-card {
  background: rgba(18, 18, 18, 0.98);
}

.modal-toolbar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1;
  background: linear-gradient(to bottom, rgba(0,0,0,0.5), transparent);
}

.close-btn {
  background: rgba(255,255,255,0.1) !important;
  margin: 8px;
}

.image-counter {
  color: white;
  background: rgba(0,0,0,0.5);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 14px;
}

.modal-content {
  height: 100vh;
}

.modal-image-container {
  height: 100%;
  padding: 32px;
}

.modal-image {
  max-width: 95vw;
  border-radius: 8px;
}

:deep(.v-carousel .v-btn) {
  background: rgba(255,255,255,0.15) !important;
  backdrop-filter: blur(8px);
  transition: all 0.3s ease;
}

:deep(.v-carousel .v-btn:hover) {
  background: rgba(255,255,255,0.25) !important;
  transform: scale(1.1);
}

:deep(.v-slide-group__prev),
:deep(.v-slide-group__next) {
  background: rgba(0,0,0,0.05) !important;
  border-radius: 50%;
  margin: 0 8px;
}
</style>