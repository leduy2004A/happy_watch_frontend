<template>
    <v-card class="product-list pa-4" variant="outlined">
      <h5 class="text-h6 font-weight-bold">Danh sách sản phẩm hoàn hàng</h5>
      <v-divider class="mb-4"></v-divider>
      
      <div v-for="product in products" :key="product.id" class="product-item mb-4">
        <v-row align="center">
          <v-col cols="12" sm="2">
            <v-img
              :src="product.image"
              :alt="product.name"
              height="100"
              contain
              class="bg-grey-lighten-2 rounded"
            ></v-img>
          </v-col>
          
          <v-col cols="12" sm="4">
            <div class="product-info">
              <h3 class="text-subtitle-1 font-weight-medium mb-1">{{ product.name }}</h3>
              <div class="text-red-500 mb-1">{{ formatPrice(product.price) }}</div>
              <div class="text-body-2 text-grey">Size: {{ product.size }}</div>
              <div class="text-body-2 text-grey">x{{ product.quantity }}</div>
            </div>
          </v-col>
          
          <v-col cols="12" sm="3">
            <div class="d-flex align-center justify-center">
              <v-btn
                density="comfortable"
                icon="mdi-minus"
                variant="outlined"
                @click="decreaseQuantity(product)"
                :disabled="product.selectedQuantity <= 1"
              ></v-btn>
              
              <div class="mx-4 text-body-1">{{ product.selectedQuantity }}</div>
              
              <v-btn
                density="comfortable"
                icon="mdi-plus"
                variant="outlined"
                @click="increaseQuantity(product)"
                :disabled="product.selectedQuantity >= product.quantity"
              ></v-btn>
            </div>
          </v-col>
          
          <v-col cols="12" sm="3" class="text-right">
            <div class="text-red-500 text-h6 font-weight-bold">
              {{ formatPrice(product.price * product.selectedQuantity) }}
            </div>
          </v-col>
        </v-row>
        <v-divider class="mt-4"></v-divider>
      </div>
    </v-card>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const products = ref([
    {
      id: 1,
      name: 'Balen Grey 2023 Tím',
      price: 137500,
      size: 41,
      quantity: 4,
      selectedQuantity: 4,
      image: 'https://file.hstatic.net/1000284478/file/uu-diem-cua-dong-ho-co-nam_271adf593134445cb89d6f04c6df07a2.jpg' // Placeholder for demo
    },
    {
      id: 2,
      name: 'Kkkk Xanh dương',
      price: 80000,
      size: 40,
      quantity: 3,
      selectedQuantity: 3,
      image: 'https://donghott.com/upload/images/dong-ho-co-paul-buhre-suu-tam.jpg' // Placeholder for demo
    }
  ]);
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };
  
  const increaseQuantity = (product) => {
    if (product.selectedQuantity < product.quantity) {
      product.selectedQuantity++;
    }
  };
  
  const decreaseQuantity = (product) => {
    if (product.selectedQuantity > 1) {
      product.selectedQuantity--;
    }
  };
  </script>
  
  <style scoped>
  .product-list {
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .product-item {
    transition: all 0.3s ease;
  }
  
  .product-item:hover {
    background-color: rgb(250, 250, 250);
  }
  
  .product-info {
    line-height: 1.5;
  }
  </style>