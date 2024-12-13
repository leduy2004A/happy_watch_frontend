<template>
  <v-app-bar app class="px-8" height="80" color="white" elevation="1">
    <!-- Logo -->
    <v-app-bar-title class="d-flex align-center">
      <router-link to="/" class="d-flex align-center text-decoration-none">
        <img
          src="https://png.pngtree.com/png-vector/20240328/ourlarge/pngtree-mechanical-pocket-watch-pattern-cartoon-style-png-image_12237907.png"
          alt="Mona Watches Shop"
          width="89"
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
      <!-- Search Icon with Dropdown -->
      <v-menu
        v-model="showSearch"
        :close-on-content-click="false"
        location="bottom end"
      >
        <template v-slot:activator="{ props }">
          <v-btn icon class="mr-2" v-bind="props">
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
        </template>

        <v-card class="pa-4">
          <AutoComplete
            v-model="selectedProduct"
            :suggestions="filteredProducts"
            @complete="searchProducts"
            placeholder="Nhập tên sản phẩm..."
            class="w-100"
          >
            <template #option="slotProps">
              <div
                class="d-flex align-center py-2"
                style="width: 100%"
                @click="selectProduct(slotProps.option)"
              >
                <img
                  :src="slotProps.option.hinhAnhChiTiet"
                  class="mr-4"
                  width="50"
                  height="50"
                  style="flex-shrink: 0; object-fit: cover"
                />
                <div style="flex: 1; min-width: 0">
                  <div
                    style="
                      word-wrap: break-word;
                      white-space: normal;
                      line-height: 1.4;
                      margin-bottom: 4px;
                    "
                  >
                    {{ slotProps.option.sanPham }} –
                    {{ slotProps.option.gioiTinh }} –
                    {{ slotProps.option.loaiKinh }} –
                    {{ slotProps.option.chatLieuVo }} –
                    {{ slotProps.option.loaiMay }} –
                    {{ slotProps.option.chatLieuDay }}
                  </div>
                  <small style="display: block; color: #666">
                    {{ formatPrice(slotProps.option.gia) }} VNĐ
                  </small>
                </div>
              </div>
            </template>
          </AutoComplete>
        </v-card>
      </v-menu>

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
            <v-icon>
              <v-avatar>
                <v-img
                  alt="John"
                  :src="avatar"
                ></v-img>
              </v-avatar>
            </v-icon>
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
import { onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useCartStore } from "@/store/cartStore";
import cartOverLay from "./cartOverLay.vue";
import useEmitter from "@/useEmitter";
import { layTatCaCTSP } from "@/axios/sanpham";
const emitter = useEmitter();
const router = useRouter();
const cartStore = useCartStore();
const modalCart = ref(false);
const drawer = ref(false);
const accountMenu = ref(false);
const showSearch = ref(false);
const selectedProduct = ref("");
const filteredProducts = ref([]);
const avatar = ref('')
const menuItems = ref([
  { title: "TRANG CHỦ", path: "/product/" },
  { title: "GIỚI THIỆU", path: "/gioi-thieu" },
  { title: "CỬA HÀNG", path: "/product/cua-hang" },
  // { title: "TIN TỨC", path: "/tin-tuc" },
  // { title: "LIÊN HỆ", path: "/lien-he" },
]);

const openModalCart = () => {
  modalCart.value = true;
};

const isAuthenticated = ref(false);
const Tet = () => {
  console.log("Duy");
};
const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VN").format(price);
};

const searchProducts = async (event) => {
  try {
    const searchTerm = event.query; // Lấy từ khóa tìm kiếm
    const allProducts = (await layTatCaCTSP()).data;
    filteredProducts.value = allProducts.filter(
      (product) =>
        product.sanPham.toLowerCase().includes(searchTerm.toLowerCase()) ||
        // || product.gioiTinh.toLowerCase().includes(searchTerm.toLowerCase())
        product.loaiKinh.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.loaiMay.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.chatLieuVo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.chatLieuDay.toLowerCase().includes(searchTerm.toLowerCase())
    );
  } catch (error) {
    console.error("Error searching products:", error);
    filteredProducts.value = [];
  }
};
const selectProduct = (item) => {
  router.push(`/product/detail/${item.id}`);
  showSearch.value = false;
  selectedProduct.value =
    item.sanPham +
    "–" +
    item.gioiTinh +
    "–" +
    item.loaiKinh +
    "–" +
    item.chatLieuVo +
    "-" +
    item.loaiMay +
    "–" +
    item.chatLieuDay;
  console.log(selectedProduct.value);
  // console.log(item)
};
// watch(selectedProduct, (newValue) => {
//   if (newValue) {

//     console.log(newValue)
//   }
// });

onMounted(async () => {
  const token = localStorage.getItem("token");
  isAuthenticated.value = !!token;
   avatar.value =JSON.parse(localStorage.getItem("user")).avatar
  emitter.on("closeCartModal", (val) => {
    modalCart.value = val;
  });
});

const redirectToLogin = () => {
  window.location.href = "/";
};

const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  isAuthenticated.value = false;
  window.location.href = "/product/cua-hang";
};
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
.v-card {
  max-height: 400px;
  overflow-y: auto;
}

.autocomplete-item {
  cursor: pointer;
  padding: 8px;
}

.autocomplete-item:hover {
  background-color: #f5f5f5;
}
</style>
