<template>
    <v-container class="watch-features">
      <v-row align="center" class="fill-height">
        <!-- Left side - Image -->
        <v-col cols="12" md="6" class="position-relative">
          <div class="diagonal-bg"></div>
          <v-img
            src="https://curnonwatch.com/blog/wp-content/uploads/2021/03/dong-ho-nu-bia-1140x641.jpg"
            class="watch-image"
            alt="Luxury Watch"
            contain
          >
            <template v-slot:placeholder>
              <v-row align="center" justify="center">
                <v-progress-circular indeterminate></v-progress-circular>
              </v-row>
            </template>
          </v-img>
        </v-col>
  
        <!-- Right side - Content -->
        <v-col cols="12" md="6" class="pl-md-8">
          <h1 class="text-h3 font-weight-regular mb-8">
            ĐỒNG HỒ MANG TÍNH<br>
            THỜI THƯỢNG
          </h1>
  
          <!-- Features list -->
          <v-list class="pa-0" flat>
            <v-list-item class="px-0 mb-6">
              <v-list-item-icon class="mr-4">
                <v-icon color="red">mdi-check</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title class="text-h6 mb-2">
                  Sự chính xác và độ tin cậy của đồng hồ cơ
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
  
            <v-list-item class="px-0 mb-6">
              <v-list-item-icon class="mr-4">
                <v-icon color="red">mdi-check</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title class="text-h6 mb-2">
                  Nâng tầm bản thân
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
  
            <v-list-item class="px-0">
              <v-list-item-icon class="mr-4">
                <v-icon color="red">mdi-check</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title class="text-h6">
                  Dành cho những người yêu thích sự cổ điển và đầy mê hoặc
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  export default {
    name: 'WatchFeatures'
  }
  </script>
  
  <style scoped>
  .watch-features {
    position: relative;
    padding: 64px 0;
    overflow: hidden;
  }
  
  .diagonal-bg {
    position: absolute;
    bottom: -20%;
    left: -10%;
    width: 100%;
    height: 140%;
    background: linear-gradient(135deg, #ff5252 0%, #ff867f 100%);
    transform: rotate(-12deg);
    z-index: -1;
  }
  
  .watch-image {
    position: relative;
    z-index: 1;
  }
  
  /* Responsive adjustments */
  @media (max-width: 960px) {
    .diagonal-bg {
      bottom: -10%;
      left: -20%;
      width: 140%;
      transform: rotate(-8deg);
    }
    
    .text-h3 {
      font-size: 2rem !important;
      line-height: 1.2 !important;
    }
  }
  
  @media (max-width: 600px) {
    .watch-features {
      padding: 32px 0;
    }
    
    .text-h6 {
      font-size: 1.1rem !important;
    }
  }
  </style>