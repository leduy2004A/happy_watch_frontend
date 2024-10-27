<template>
    <v-container class="py-16">
      <div class="text-center mb-12">
        <h2 class="text-h3 font-weight-bold mb-3">SẢN PHẨM MỚI</h2>
        <div class="d-flex justify-center mb-6">
          <div class="diamond-divider">
            <span v-for="n in 5" :key="n" class="diamond-dot">♦</span>
          </div>
        </div>
        <p class="text-subtitle-1 text-grey-darken-1">
          Sản phẩm mới nhất trên trang web bán hàng của chúng tôi sẽ làm bạn phong cách và đẳng cấp hơn bao giờ hết.
        </p>
      </div>
      <!-- Men's Watches Section -->
      <div class="mb-16">
        <h2 class="text-h4 font-weight-medium text-center mb-12">ĐỒNG HỒ NAM</h2>
        <v-row>
          <v-col
            v-for="watch in mensWatches"
            :key="watch.id"
            cols="12"
            sm="6"
            md="3"
          >
            <v-hover v-slot="{ isHovering, props }">
              <v-card
                v-bind="props"
                :elevation="isHovering ? 4 : 0"
                class="watch-card h-100"
              >
                <!-- Sale Badge -->
                <div v-if="watch.discount" class="sale-badge">
                  -{{ watch.discount }}%
                </div>
  
                <!-- Product Image -->
                <v-img
                  :src="watch.image"
                  height="250"
                  cover
                  class="product-image"
                >
                  <!-- Quick Action Buttons -->
                  <div
                    class="action-buttons"
                    :class="{ 'show-actions': isHovering }"
                  >
                    <v-btn icon="mdi-heart" variant="text" class="action-btn"></v-btn>
                    <v-btn icon="mdi-cart" variant="text" class="action-btn"></v-btn>
                    <v-btn icon="mdi-eye" variant="text" class="action-btn"></v-btn>
                  </div>
                </v-img>
  
                <!-- Product Info -->
                <v-card-text class="text-center">
                  <div class="text-subtitle-1 text-truncate mb-2">
                    {{ watch.name }}
                  </div>
                  <div class="d-flex justify-center align-center">
                    <span class="text-grey-darken-1 text-decoration-line-through me-2" v-if="watch.oldPrice">
                      {{ formatPrice(watch.oldPrice) }}
                    </span>
                    <span class="text-primary font-weight-bold">
                      {{ formatPrice(watch.price) }}
                    </span>
                  </div>
                </v-card-text>
              </v-card>
            </v-hover>
          </v-col>
        </v-row>
      </div>
  
      <!-- Women's Watches Section -->
      <div>
        <h2 class="text-h4 font-weight-medium text-center mb-12">ĐỒNG HỒ NỮ</h2>
        <v-row>
          <v-col
            v-for="watch in womensWatches"
            :key="watch.id"
            cols="12"
            sm="6"
            md="3"
          >
            <v-hover v-slot="{ isHovering, props }">
              <v-card
                v-bind="props"
                :elevation="isHovering ? 4 : 0"
                class="watch-card h-100"
              >
                <!-- Sale Badge -->
                <div v-if="watch.discount" class="sale-badge">
                  -{{ watch.discount }}%
                </div>
  
                <!-- Product Image -->
                <v-img
                  :src="watch.image"
                  height="250"
                  cover
                  class="product-image"
                >
                  <!-- Quick Action Buttons -->
                  <div
                    class="action-buttons"
                    :class="{ 'show-actions': isHovering }"
                  >
                    <v-btn icon="mdi-heart" variant="text" class="action-btn"></v-btn>
                    <v-btn icon="mdi-cart" variant="text" class="action-btn"></v-btn>
                    <v-btn icon="mdi-eye" variant="text" class="action-btn"></v-btn>
                  </div>
                </v-img>
  
                <!-- Product Info -->
                <v-card-text class="text-center">
                  <div class="text-subtitle-1 text-truncate mb-2">
                    {{ watch.name }}
                  </div>
                  <div class="d-flex justify-center align-center">
                    <span class="text-grey-darken-1 text-decoration-line-through me-2" v-if="watch.oldPrice">
                      {{ formatPrice(watch.oldPrice) }}
                    </span>
                    <span class="text-primary font-weight-bold">
                      {{ formatPrice(watch.price) }}
                    </span>
                  </div>
                </v-card-text>
              </v-card>
            </v-hover>
          </v-col>
        </v-row>
      </div>
    </v-container>
  </template>
  
  <script setup>
  const mensWatches = [
    {
      id: 1,
      name: 'ĐỒNG HỒ LOUIS ERARD',
      image: 'https://bizweb.dktcdn.net/100/364/978/files/7d179ecf88152e79404f28e5bbfd116d.jpg?v=1597742320551',
      price: 88150000,
      oldPrice: null,
      discount: 20
    },
    {
      id: 2,
      name: 'ĐỒNG HỒ CITIZEN AU1080-20A',
      image: 'https://donghoolevs.vn/wp-content/uploads/2022/11/hinh-anh-chinh-5-21-1.jpg',
      price: 5000000,
      oldPrice: null,
      discount: 25
    },
    {
      id: 3,
      name: 'ĐỒNG HỒ TISSOT',
      image: 'https://png.pngtree.com/png-vector/20240321/ourlarge/pngtree-gold-mechanical-wristwatch-png-image_12021746.png',
      price: 21550000,
      oldPrice: null,
      discount: null
    },
    {
      id: 4,
      name: 'ĐỒNG HỒ SEIKO SGEG99P1 NAM',
      image: 'https://donghoolevs.vn/wp-content/uploads/2022/09/hinh-anh-chinh-5-1.jpg',
      price: 3550000,
      oldPrice: null,
      discount: null
    }
  ]
  
  const womensWatches = [
    {
      id: 5,
      name: 'MOVADO MUSEUM 70TH',
      image: 'https://donghoolevs.vn/wp-content/uploads/2022/11/hinh-anh-chinh-5-19.jpg',
      price: 8350000,
      oldPrice: 10000000,
      discount: 25
    },
    {
      id: 6,
      name: 'OMEGA DE VILLE PRESTIGE',
      image: 'https://bizweb.dktcdn.net/thumb/1024x1024/100/344/177/products/dong-ho-nu-hanboro-automatic-tu-dong-lo-may-rose-gold-34mm-3.jpg?v=1669866242887',
      price: 11900000,
      oldPrice: null,
      discount: 15
    },
    {
      id: 7,
      name: 'BULOVA CORPORATION',
      image: 'https://donghoduyanh.com/images/news/2024/05/31/large/t0502073701704_1717139824.jpg',
      price: 14000000,
      oldPrice: null,
      discount: null
    },
    {
      id: 8,
      name: 'BULOVA MARINE STAR DIAMOND',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzpuykTccqzEFi0TJcepegyfL3G7Sf-DqO-A&s',
      price: 12550000,
      oldPrice: null,
      discount: null
    }
  ]
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(price)
  }
  </script>
  
  <style scoped>
  .watch-card {
    position: relative;
    transition: all 0.3s ease;
    border: 1px solid #eee;
  }
  
  .sale-badge {
    position: absolute;
    top: 10px;
    left: 10px;
    background-color: #ff4081;
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    z-index: 1;
  }
  
  .product-image {
    position: relative;
    overflow: hidden;
  }
  
  .action-buttons {
    position: absolute;
    bottom: -50px;
    left: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.9);
    display: flex;
    justify-content: center;
    gap: 8px;
    padding: 8px 0;
    transition: all 0.3s ease;
  }
  
  .show-actions {
    bottom: 0;
  }
  
  .action-btn {
    color: #333;
  }
  
  .action-btn:hover {
    color: #1976d2;
  }
  
  /* Price formatting */
  .text-primary {
    color: #1976d2 !important;
  }
  
  /* Hover effects */
  .watch-card:hover {
    border-color: #1976d2;
  }
  </style>