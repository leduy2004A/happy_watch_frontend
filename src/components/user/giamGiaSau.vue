<template>
  <div class="bg-black">
        <v-container class="pa-8">
      <div class="d-flex align-center justify-center">
        <h1 class="text-h4 font-weight-bold text-white">GIẢM GIÁ</h1>
     
      </div>
         <div class="diamond-divider d-flex align-center justify-center mb-8">
          <span v-for="n in 5" :key="n" class="diamond">♦</span>
        </div>
      <v-row>
        <v-col cols="12">
          <v-carousel
            show-arrows="hover"
            height="auto"
            hide-delimiter-background
            :show-arrows="false"
          >
            <v-carousel-item
              v-for="(group, i) in chunkedProducts"
              :key="i"
            >
              <v-row>
                <v-col
                  v-for="product in group"
                  :key="product.id"
                  cols="12"
                  sm="6"
                  md="3"
                >
                  <v-card class="h-100" color="white">
                    <div class="position-relative">
                      <v-chip
                        v-if="product.isNew"
                        color="red"
                        class="position-absolute ma-2"
                      >
                        NEW!
                      </v-chip>
                      <v-chip
                        v-if="product.discount"
                        color="yellow"
                        class="position-absolute ma-2"
                        style="left: 65px"
                      >
                        -{{ product.discount }}%
                      </v-chip>
                      <v-img
                        :src="product.image"
                        height="250"
                        cover
                        class="bg-grey-lighten-2"
                      >
                        <template v-slot:placeholder>
                          <div class="d-flex align-center justify-center fill-height">
                            <v-progress-circular
                              indeterminate
                              color="grey-lighten-4"
                            />
                          </div>
                        </template>
                      </v-img>
                    </div>
  
                    <v-card-title class="text-subtitle-1 text-truncate pt-4">
                      {{ product.name }}
                    </v-card-title>
  
                    <v-card-text>
                      <div class="d-flex flex-column">
                        <div class="text-body-2 text-decoration-line-through text-grey mb-1">
                          {{ formatPrice(product.originalPrice) }}
                        </div>
                        <div class="text-h6 text-red">
                          {{ formatPrice(product.salePrice) }}
                        </div>
                      </div>
                      <div class="d-flex justify-center mt-4 mb-2">
                        <v-btn
                          v-for="(icon, index) in ['mdi-heart-outline', 'mdi-shopping-outline', 'mdi-magnify']"
                          :key="index"
                          :icon="icon"
                          variant="text"
                          class="mx-1"
                        />
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-carousel-item>
          </v-carousel>
        </v-col>
      </v-row>
    </v-container>
  </div>

  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  
  const products = ref([
    {
      id: 1,
      name: 'Dịch Vụ In Logo Mẫu Lên Mặt Số',
      image: 'https://lh5.googleusercontent.com/proxy/D2R0iAXSS6a04m0Pw5qpPO7sWnkiUYrHMydLZbi9sj5cKY-2vtLGNOUsse7f59opPuvlALVBGq6l9hSn',
      originalPrice: 2990000,
      salePrice: 2590000,
      discount: 15,
      isNew: true
    },
    {
      id: 2,
      name: 'DÂY DA ZRC 654 TASMAN',
      image: 'https://donghoduyanh.com/upload_images/images/2023/12/08/25-nam-may-co-9s-31.jpg',
      originalPrice: 710000,
      salePrice: 639000,
      discount: 10,
      isNew: true
    },
    {
      id: 3,
      name: 'ĐỒNG HỒ ĐÔI SUNRISE SG',
      image: 'https://cdn.tgdd.vn/Files/2021/11/13/1397804/co1_1280x628-800-resize.jpg',
      originalPrice: 4700000,
      salePrice: 4230000,
      discount: 10,
      isNew: true
    },
    {
      id: 4,
      name: 'ĐỒNG HỒ ĐÔI OLYMPIA STAR',
      image: 'https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:quality(100)/2024_3_8_638454875983791681_harabo-nen.jpg',
      originalPrice: 7728000,
      salePrice: 6955000,
      discount: 10,
      isNew: true
    },
    {
      id: 4,
      name: 'ĐỒNG HỒ ĐÔI OLYMPIA STAR',
      image: 'https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:quality(100)/2024_3_8_638454875983791681_harabo-nen.jpg',
      originalPrice: 7728000,
      salePrice: 6955000,
      discount: 10,
      isNew: true
    }
  ])
  
  const chunkedProducts = computed(() => {
    const chunks = []
    for (let i = 0; i < products.value.length; i += 4) {
      chunks.push(products.value.slice(i, i + 4))
    }
    return chunks
  })
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }
  </script>
  
  <style scoped>
  .position-relative {
    position: relative;
  }
  
  .position-absolute {
    position: absolute;
    z-index: 1;
  }
  
  .diamond-divider {
    display: flex;
    align-items: center;
    margin-left: 10px;
  }
  
  .diamond {
    color: white;
    font-size: 12px;
    margin: 0 2px;
  }
  
  /* Custom scrollbar for Webkit browsers */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: #1a1a1a;
  }
  
  ::-webkit-scrollbar-thumb {
    background: #666;
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: #888;
  }
  </style>