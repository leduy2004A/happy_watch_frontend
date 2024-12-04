<template>
  <v-app-bar app class="px-8" height="80" color="white" elevation="1">
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

      <!-- User Account Menu -->
      <v-menu
        v-model="accountMenu"
        :close-on-content-click="false"
        location="bottom end"
        offset="10"
        v-if="isAuthenticated"
      >
        <template v-slot:activator="{ props }">
          <v-btn icon class="mr-2" v-bind="props">
            <v-icon>mdi-account</v-icon>
          </v-btn>
        </template>

        <v-card min-width="200" class="account-menu">
          <v-list>
            <v-list-item to="/profile/hoa-don" class="account-menu-item">
              <template v-slot:prepend>
                <v-icon>mdi-receipt</v-icon>
              </template>
              <v-list-item-title>Hóa đơn</v-list-item-title>
            </v-list-item>

            <v-list-item to="/profile/ho-so" class="account-menu-item">
              <template v-slot:prepend>
                <v-icon>mdi-account-details</v-icon>
              </template>
              <v-list-item-title>Thông tin tài khoản</v-list-item-title>
            </v-list-item>

            <v-divider></v-divider>

            <v-list-item @click="handleLogout" class="account-menu-item">
              <template v-slot:prepend>
                <v-icon>mdi-logout</v-icon>
              </template>
              <v-list-item-title>Đăng xuất</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>
      <v-btn v-else class="mx-2" @click="redirectToLogin" color="primary">
        Đăng nhập
      </v-btn>
      <!-- Shopping Cart -->
      <v-btn icon class="position-relative" @click="openModalCart()">
        <v-badge
          :content="cartStore.cartItemCount.toString()"
          :value="cartStore.cartItemCount"
          color="red"
          floating
          offset-x="-5"
          offset-y="5"
          class="mr-5"
        >
          <v-icon>mdi-cart</v-icon>
        </v-badge>
      </v-btn>
    </div>

    <!-- Mobile Menu Button -->
    <v-app-bar-nav-icon
      class="d-md-none"
      @click="drawer = !drawer"
    ></v-app-bar-nav-icon>

    <!-- Mobile Navigation Drawer -->
    <v-navigation-drawer v-model="drawer" location="right" temporary>
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
  <cart-over-lay :modal="modalCart"></cart-over-lay>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useCartStore } from "@/store/cartStore";
import cartOverLay from "./cartOverLay.vue";
import useEmitter from "@/useEmitter";

const emitter = useEmitter();
const cartStore = useCartStore();
const modalCart = ref(false);
const drawer = ref(false);
const accountMenu = ref(false);

const menuItems = ref([
  { title: "TRANG CHỦ", path: "/product/" },
  { title: "GIỚI THIỆU", path: "/gioi-thieu" },
  { title: "CỬA HÀNG", path: "/product/cua-hang" },
  { title: "TIN TỨC", path: "/tin-tuc" },
  { title: "LIÊN HỆ", path: "/lien-he" },
]);

const openModalCart = () => {
  modalCart.value = true;
};

// const handleLogout = () => {
//   accountMenu.value = false;
//   // Xử lý logout ở đây
// };
const isAuthenticated = ref(false);

onMounted(() => {
  // Kiểm tra token trong localStorage (hoặc từ Pinia/Vuex)
  const token = localStorage.getItem("token");
  isAuthenticated.value = !!token; // Nếu có token, trạng thái là đăng nhập
});

// Hàm điều hướng tới trang đăng nhập
const redirectToLogin = () => {
  window.location.href = "/"; // Đường dẫn trang đăng nhập
};

// Hàm xử lý logout
const handleLogout = () => {
  localStorage.removeItem('token') // Xóa token
  localStorage.removeItem('user')
  isAuthenticated.value = false // Cập nhật trạng thái đăng xuất
  window.location.href = '/product/cua-hang' // Điều hướng lại trang chủ
}

onMounted(() => {
  emitter.on("closeCartModal", (val) => {
    modalCart.value = val;
  });
});
</script>

<style scoped>
.v-btn {
  text-transform: none;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}

.v-btn:hover {
  opacity: 0.8;
}

.v-btn.router-link-active {
  color: #000;
  font-weight: bold;
}

.position-relative {
  position: relative;
}

.account-menu {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
}

.account-menu-item {
  transition: background-color 0.2s ease;
}

.account-menu-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.v-list-item {
  min-height: 44px;
}
</style>
