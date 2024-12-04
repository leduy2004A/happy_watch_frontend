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
        
        <!-- Promotion banner -->
        <v-card class="promotion-banner mb-6" outlined>
          <div class="banner-content">
            <div class="scrolling-text">
              <span v-for="(promo, index) in promotions" :key="index">
                {{ promo }} &nbsp;&nbsp;&bull;&nbsp;&nbsp;
              </span>
            </div>
          </div>
        </v-card>

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
  name: 'WatchSale',
  
  data() {
    return {
      promotions: [
        'Uy tín chất lượng',
        'Ngập tràn khuyến mãi',
        'Thao tác dễ dàng',
        'Nhiều voucher dành cho bạn',
        'Đồng hồ chính hãng'
      ]
    }
  },

  methods: {
    handlePurchase() {
      // Implement purchase logic here
      console.log('Purchase button clicked')
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

.promotion-banner {
  height: 60px;
  overflow: hidden;
  position: relative;
  background-color: #f5f5f5 !important;
}

.banner-content {
  height: 100%;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.scrolling-text {
  white-space: nowrap;
  animation: scroll 30s linear infinite;
  color: #333;
  font-weight: 500;
}

@keyframes scroll {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
}

/* Custom styles for responsive design */
@media (max-width: 600px) {
  .text-h3 {
    font-size: 1.8rem !important;
  }
  
  .promotion-banner {
    height: 50px;
  }
}
</style>