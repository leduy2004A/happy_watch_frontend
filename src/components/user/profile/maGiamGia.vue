<template>
    <div class="card">
      <TabMenu :model="items" />
      
      <div class="coupon-container mt-3">
        <div class="flex align-items-center p-3 border-round border-1 border-orange-300 surface-ground">
          <div class="flex align-items-center gap-3">
            <div class="brand-logo">
              <i class="pi pi-shopping-bag text-orange-500 text-2xl"></i>
              <span class="font-bold ml-2">Fshoes</span>
            </div>
            
            <div class="coupon-details">
              <div class="mb-2">
                <span class="font-semibold">Giá trị: </span>
                <span>10%</span>
              </div>
              <div class="mb-2">
                <span class="font-semibold">Tối đa: </span>
                <span>400,000 đ</span>
              </div>
              <div>
                <span class="font-semibold">Tối thiểu: </span>
                <span>1,200,000 đ</span>
              </div>
            </div>
          </div>
          
          <Button 
            label="Xem" 
            class="ml-auto p-button-text p-button-secondary"
            @click="viewCoupon"
          />
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const items = ref([
    {
      label: 'CÔNG KHAI',
      command: () => {
        // Handle tab change
      }
    },
    {
      label: 'CÁ NHÂN',
      command: () => {
        // Handle tab change
      }
    }
  ])
  
  const viewCoupon = () => {
    // Handle view coupon action
  }
  </script>
  
  <style scoped>
  .coupon-container {
    max-width: 600px;
  }
  
  .brand-logo {
    display: flex;
    align-items: center;
    min-width: 120px;
  }
  
  .coupon-details {
    line-height: 1.5;
  }
  </style>