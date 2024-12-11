<template>
    <v-carousel
      cycle
      height="600"
      hide-delimiter-background
      show-arrows="hover"
    >
      <v-carousel-item v-for="(item, index) in slides" :key="index">
        <v-sheet
          class="fill-height"
          :style="`background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${item.image}) center/cover`"
        >
          <v-container class="fill-height">
            <v-row
              align="center"
              justify="start"
              class="fill-height"
            >
              <v-col cols="12" md="6">
                <div class="text-h6 text-white mb-2">{{ item.title }}</div>
                <div class="text-h3 font-weight-bold text-white mb-6">{{ item.subtitle }}</div>
                <v-btn
                  color="white"
                  variant="outlined"
                  size="large"
                  class="text-none"
                >
                  MUA NGAY
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-sheet>
      </v-carousel-item>
    </v-carousel>
  </template>
  
  <script setup>
  import { reactive } from 'vue'
  
  const slides = reactive([
    {
      title: 'Đẳng Cấp Và Thời Thượng Gọi Tên',
      subtitle: 'Happy Watch',
      image: 'https://png.pngtree.com/thumb_back/fw800/back_our/20190620/ourmid/pngtree-classic-quartz-watch-big-black-banner-image_166389.jpg'
    },
    {
      title: 'Cập Nhật Sản Phẩm Mới Liên Tục',
      subtitle: 'Nhấn Vào Mua Ngay !!!',
      image: 'https://media.licdn.com/dms/image/v2/C5112AQEfptQtGhQJzg/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1520153250066?e=2147483647&v=beta&t=1R2ByfjdBQtLMYU6RUFqREn9z57HxAgAdKPjdOLOX50'
    }
    // Add more slides as needed
  ])
  </script>
  
  <style scoped>
  .v-carousel {
    box-shadow: none;
  }
  
  .text-h3 {
    letter-spacing: 1px;
  }
  
  /* Optional: Add hover effect to the button */
  .v-btn:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  </style>
  