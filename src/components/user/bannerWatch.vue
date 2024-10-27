<template>
    <v-container class="watch-sale">
      <!-- Header section -->
      <v-row justify="center" align="center">
        <v-col cols="12" md="6" class="text-center">
          <div class="text-subtitle-1 grey--text">Giảm giá tới 35%</div>
          <h1 class="text-h3 font-weight-bold mb-4">ĐỒNG HỒ DÂY DA</h1>
          <div class="text-subtitle-1 mb-6">
            Mua sắm thả ga trong giờ khuyến mãi! Giảm thêm 35% cho bạn.
          </div>
          
          <!-- Countdown timer -->
          <v-row justify="center" class="mb-6">
            <v-col v-for="(item, index) in timeItems" :key="index" cols="auto" class="text-center mx-2">
              <v-card
                class="rounded-lg"
                width="80"
                height="80"
                color="grey lighten-4"
                elevation="0"
              >
                <v-card-text class="pa-2">
                  <div class="text-h4 font-weight-bold">{{ item.value }}</div>
                  <div class="text-caption grey--text">{{ item.label }}</div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
  
          <!-- CTA Button -->
          <v-btn
            color="primary"
            outlined
            x-large
            class="text-transform-none px-8"
            @click="handlePurchase"
          >
            MUA NGAY
          </v-btn>
        </v-col>
  
        <!-- Image section -->
        <v-col cols="12" md="6">
          <v-img
            src="https://thejulius.com.vn/wp-content/uploads/2018/12/dong-ho-julius3.png"
            max-width="100%"
            contain
            class="rounded-lg"
          >
            <template v-slot:placeholder>
              <v-row align="center" justify="center">
                <v-progress-circular indeterminate></v-progress-circular>
              </v-row>
            </template>
          </v-img>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  export default {
    name: 'WatchSaleCountdown',
    
    data() {
      return {
        endTime: new Date().getTime() + 24 * 60 * 60 * 1000, // 24 hours from now
        timeItems: [
          { value: '00', label: 'Ngày' },
          { value: '00', label: 'Giờ' },
          { value: '00', label: 'Phút' },
          { value: '00', label: 'Giây' }
        ],
        timer: null
      }
    },
  
    methods: {
      updateTimer() {
        const now = new Date().getTime()
        const distance = this.endTime - now
  
        if (distance < 0) {
          clearInterval(this.timer)
          return
        }
  
        // Calculate time units
        const days = Math.floor(distance / (1000 * 60 * 60 * 24))
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((distance % (1000 * 60)) / 1000)
  
        // Update timeItems with padded values
        this.timeItems[0].value = days.toString().padStart(2, '0')
        this.timeItems[1].value = hours.toString().padStart(2, '0')
        this.timeItems[2].value = minutes.toString().padStart(2, '0')
        this.timeItems[3].value = seconds.toString().padStart(2, '0')
      },
  
      handlePurchase() {
        // Implement purchase logic here
        console.log('Purchase button clicked')
      }
    },
  
    mounted() {
      this.updateTimer()
      this.timer = setInterval(this.updateTimer, 1000)
    },
  
    beforeDestroy() {
      if (this.timer) {
        clearInterval(this.timer)
      }
    }
  }
  </script>
  
  <style scoped>
  .watch-sale {
    padding: 40px 0;
  }
  
  .v-card {
    border-radius: 12px !important;
  }
  
  /* Custom styles for responsive design */
  @media (max-width: 600px) {
    .text-h3 {
      font-size: 1.8rem !important;
    }
    
    .v-card {
      width: 60px !important;
      height: 60px !important;
    }
  }
  </style>