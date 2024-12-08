<template>
    <v-container class="py-16">
      <!-- Section Header -->
      <div class="text-center mb-12">
        <h2 class="text-h3 font-weight-bold mb-3">PHỔ BIẾN</h2>
        <div class="d-flex justify-center mb-6">
          <div class="diamond-divider">
            <span v-for="n in 5" :key="n" class="diamond-dot">♦</span>
          </div>
        </div>
        <p class="text-subtitle-1 text-grey-darken-1">
          Trang web mang đến cho bạn một bộ sưu tập đa dạng các đồng hồ chất lượng cao và thời thượng.
        </p>
      </div>
  
      <!-- Categories Grid -->
      <v-row>
        <v-col
          v-for="(category, index) in categories"
          :key="index"
          cols="12"
          sm="6"
          md="3"
        >
          <v-hover v-slot="{ isHovering, props }">
            <v-card
              v-bind="props"
              :elevation="isHovering ? 8 : 2"
              class="rounded-lg category-card"
            >
              <v-img
                :src="category.image"
                height="300"
                cover
                class="position-relative"
              >
                <!-- Overlay on hover -->
                <div
                  class="overlay d-flex align-center justify-center"
                  :class="{ 'show-overlay': isHovering }"
                >
                  <v-btn
                    color="white"
                    variant="outlined"
                    size="large"
                    class="text-none"
                    @click="loc(category)"
                  >
                    Xem thêm
                  </v-btn>
                </div>
  
                <!-- Category Title -->
                <div class="category-title text-center">
                  <v-chip
                    color="black"
                    class="px-6 py-3 text-body-1 font-weight-medium"
                  >
                    {{ category.title }}
                  </v-chip>
                </div>
              </v-img>
            </v-card>
          </v-hover>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router';
  const router = useRouter()
  import { sanPhamCuaHangStore } from '@/store/sanPhamCuaHangStore';
  const store = sanPhamCuaHangStore()
  const categories = [
    {
      title: 'Nam',
      image: 'https://donghoolevs.vn/wp-content/uploads/2024/01/hinh-anh-chinh-5-10.jpg'
    },
    {
      title: 'Nữ',
      image: 'https://channel.mediacdn.vn/2019/9/25/photo-1-1569390566273627570347.jpg'
    },
    {
      title: 'Rolex',
      image: 'https://bandonghocu.com/wp-content/uploads/2021/05/dong-ho-franck-muller-vanguard-v32-sc-at-f0-mau-den-dinh-kim-cuong-1.jpg'
    },
    {
      title: 'Automatic',
      image: 'https://cdn.tgdd.vn/News/1474099/top-10-mau-dong-ho-kim-cuong-dat-nhat-the-gioi-5-800x450.jpg'
    }
  ]
  const loc = (cate)=>{
    router.push("/product/cua-hang")
    store.setFilters([cate.title])
  }
  </script>
  
  <style scoped>
  .diamond-divider {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .diamond-dot {
    color: #000;
    font-size: 14px;
  }
  
  .category-card {
    transition: all 0.3s ease;
    cursor: pointer;
    overflow: hidden;
    margin: 0 auto;
  }
  
  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  .show-overlay {
    opacity: 1;
  }
  
  .category-title {
    position: absolute;
    bottom: 20px;
    left: 0;
    right: 0;
  }
  
  .v-chip {
    background: rgba(255, 255, 255, 0.9) !important;
  }
  </style>