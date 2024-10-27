<template>
  <v-app-bar
    app
    class="px-3"
    height="80"
    color="white"
    elevation="1"
  >
    <!-- Logo -->
    <v-app-bar-title class="d-flex align-center">
      <router-link to="/" class="d-flex align-center text-decoration-none">
        <img
          src="https://thumuadonghohieu.com/wp-content/uploads/2019/03/Logo-Rolex.jpg"
          alt="Mona Watches Shop"
          width="120"
          :contain="true"
        />
      </router-link>
    </v-app-bar-title>

    <!-- Navigation Menu -->
    <v-spacer />
    
    <div class="d-none d-md-flex">
      <v-btn
        v-for="(item, index) in menuItems"
        :key="index"
        :to="item.path"
        variant="text"
        class="text-none font-weight-medium mx-2"
        color="grey-darken-3"
      >
        {{ item.title }}
      </v-btn>
    </div>

    <!-- Right Icons -->
    <v-spacer />
    
    <div class="d-flex align-center">
      <!-- Search Icon -->
      <v-btn icon class="mr-2">
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

      <!-- User Account Icon -->
      <v-btn icon class="mr-2">
        <v-icon>mdi-account</v-icon>
      </v-btn>

      <!-- Shopping Cart -->
      <v-btn icon class="position-relative">
        <v-icon>mdi-cart</v-icon>
        <v-badge
          content="5"
          color="red"
          floating
          dot
          offset-x="-5"
          offset-y="5"
        ></v-badge>
      </v-btn>
    </div>

    <!-- Mobile Menu Button -->
    <v-app-bar-nav-icon
      class="d-md-none"
      @click="drawer = !drawer"
    ></v-app-bar-nav-icon>

    <!-- Mobile Navigation Drawer -->
    <v-navigation-drawer
      v-model="drawer"
      location="right"
      temporary
    >
      <v-list>
        <v-list-item
          v-for="(item, index) in menuItems"
          :key="index"
          :to="item.path"
          :title="item.title"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-app-bar>
</template>

<script>
export default {
  data() {
    return {
      drawer: false,
      menuItems: [
        { title: 'TRANG CHỦ', path: '/' },
        { title: 'GIỚI THIỆU', path: '/gioi-thieu' },
        { title: 'CỬA HÀNG', path: '/cua-hang' },
        { title: 'TIN TỨC', path: '/tin-tuc' },
        { title: 'LIÊN HỆ', path: '/lien-he' },
      ]
    }
  }
}
</script>

<style scoped>
.v-btn {
  text-transform: none;
  letter-spacing: 0.5px;
}

/* Hover effect for navigation buttons */
.v-btn:hover {
  opacity: 0.8;
}

/* Custom badge styling */
.position-relative {
  position: relative;
}

/* Add transition effects */
.v-btn {
  transition: all 0.3s ease;
}

/* Optional: Add active link styling */
.v-btn.router-link-active {
  color: #000;
  font-weight: bold;
}
</style>
