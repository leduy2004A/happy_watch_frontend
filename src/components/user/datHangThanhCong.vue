<template>
    <v-container class="order-success">
      <!-- Order Status Header -->
      <v-card class="mb-6 success-card" elevation="0">
        <div class="d-flex align-center py-4 px-6">
          <v-avatar color="success" class="mr-4" size="52">
            <v-icon dark size="32">mdi-check</v-icon>
          </v-avatar>
          <div>
            <h1 class="text-h5 font-weight-bold mb-1">Đặt hàng thành công</h1>
            <div class="text-subtitle-1 grey--text text--darken-1">
              Mã đơn hàng: <span class="font-weight-medium">{{ orderStore.orderNumber }}</span>
            </div>
          </div>
        </div>
      </v-card>
  
      <div class="d-flex flex-wrap">
        <!-- Left Column -->
        <div class="order-details flex-grow-1 pr-md-4" style="min-width: 280px; flex-basis: 60%;">
          <!-- Delivery Info -->
          <v-card class="mb-6" elevation="0">
            <v-card-title class="py-2 px-4">
              <v-icon left color="primary">mdi-truck-delivery-outline</v-icon>
              Thông tin giao hàng
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="pt-4">
              <div class="delivery-info">
                <div class="mb-2">
                  <div class="font-weight-medium">{{ orderStore.customerInfo.fullName }}</div>
                  <div>{{ orderStore.customerInfo.phone }}</div>
                </div>
                <div class="grey--text">
                  {{ orderStore.customerInfo.address.ward }},
                  {{ orderStore.customerInfo.address.district }},
                  {{ orderStore.customerInfo.address.city }},
                  {{ orderStore.customerInfo.address.province }}
                </div>
              </div>
            </v-card-text>
          </v-card>
  
          <!-- Products List -->
          <v-card elevation="0">
            <v-card-title class="py-2 px-4">
              <v-icon left color="primary">mdi-package-variant-closed</v-icon>
              Sản phẩm đã đặt
            </v-card-title>
            <v-divider></v-divider>
  
            <v-card-text class="pa-0">
              <v-list>
                <template 
                  v-for="(product, index) in orderStore.products" 
                  :key="product.productGoc.id"
                >
                  <v-list-item>
                    <v-list-item-avatar tile size="80" class="rounded-lg">
                      <img :src="product.productGoc.image" :alt="product.productGoc.name" width="150">
                    </v-list-item-avatar>
                    
                    <v-list-item-content>
                      <v-list-item-title class="font-weight-medium mb-1">
                        {{ product.productGoc.name }}
                      </v-list-item-title>
                      <v-list-item-subtitle class="grey--text text--darken-1">
                        Số lượng: {{ product.productGoc.soLuongChon }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
  
                    <v-list-item-action class="text-right">
                      <div class="text-subtitle-1 font-weight-bold primary--text">
                        {{ orderStore.formatPrice(product.productGoc.price) }}
                      </div>
                    </v-list-item-action>
                  </v-list-item>
                  
                  <v-divider 
                    v-if="index < orderStore.products.length - 1"
                  ></v-divider>
                </template>
              </v-list>
            </v-card-text>
          </v-card>
        </div>
  
        <!-- Right Column - Order Summary -->
        <div class="order-summary mt-6 mt-md-0" style="min-width: 280px; flex-basis: 40%;">
          <v-card elevation="0" class="">
            <v-card-title class="py-2 px-4">
              <v-icon left color="primary">mdi-receipt</v-icon>
              Tổng quan đơn hàng
            </v-card-title>
            <v-divider></v-divider>
            
            <v-list class="py-0">
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title class="grey--text">Tạm tính</v-list-item-title>
                </v-list-item-content>
                <v-list-item-action class="text-right">
                  {{ orderStore.formatPrice(checkOutStore.tinhTongTienHang())  }}
                </v-list-item-action>
              </v-list-item>
  
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title class="grey--text">Phí vận chuyển</v-list-item-title>
                </v-list-item-content>
                <v-list-item-action class="text-right">
                  <span class="success--text">
                    {{orderStore.formatPrice(orderStore.shipping.fee)  }}
                  </span>
                </v-list-item-action>
              </v-list-item>
  
              <v-divider class="mx-4"></v-divider>
  
              <v-list-item class="total-amount">
                <v-list-item-content>
                  <v-list-item-title class="font-weight-bold">Tổng cộng</v-list-item-title>
                </v-list-item-content>
                <v-list-item-action class="text-right">
                  <div class="text-h6 primary--text font-weight-bold">
                    {{orderStore.formatPrice(checkOutStore.tinhTongTien()) }}
                  </div>
                </v-list-item-action>
              </v-list-item>
            </v-list>
  
            <v-card-actions class="px-4 pb-4">
              <v-btn
                block
                x-large
                color="primary"
                elevation="2"
                @click="continueShopping"
              >
                Tiếp tục mua hàng
              </v-btn>
            </v-card-actions>
          </v-card>
        </div>
      </div>
    </v-container>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router'
  import { useSuccesStore } from '@/store/successStore'
  import { useCheckOutStore } from '@/store/checkOutStore';
  const checkOutStore = useCheckOutStore()
  const router = useRouter()
  const orderStore = useSuccesStore()
  
  function continueShopping() {
    router.push('/product/cua-hang')
  }
  </script>
  
  
  <style scoped>
  .order-success {
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .success-card {
    background: linear-gradient(to right, #4CAF50, #45a049);
    color: white;
  }
  
  .success-card .grey--text {
    color: rgba(255, 255, 255, 0.9) !important;
  }
  
  .sticky-summary {
    position: sticky;
    top: 20px;
  }
  
  /* Responsive Styles */
  @media (max-width: 959px) {
    .order-details {
      margin-right: 0 !important;
    }
    
    .sticky-summary {
      position: static;
    }
  }
  
  .v-card {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
  }
  
  .total-amount {
    background-color: #f5f5f5;
    border-radius: 0 0 8px 8px;
  }
  
  .delivery-info {
    line-height: 1.5;
  }
  
  /* Hover effects */
  .v-list-item:hover {
    background-color: #f5f5f5;
    transition: background-color 0.2s ease;
  }
  </style>