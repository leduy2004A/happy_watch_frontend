<template>
  <div class="nav-admin">
    <v-navigation-drawer permanent>
      <!-- Logo và Tiêu đề -->
      <v-list-item class="drawer-header">
        <v-avatar class="drawer-avatar" size="56">
          <v-img src="https://png.pngtree.com/png-vector/20240328/ourlarge/pngtree-mechanical-pocket-watch-pattern-cartoon-style-png-image_12237907.png"></v-img>
        </v-avatar>
        <v-list-item-content>
          <v-list-item-title class="drawer-title">HappyWatch</v-list-item-title>
          <v-list-item-subtitle class="drawer-subtitle">Cửa hàng đồng hồ vui vẻ</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      
      <v-divider></v-divider>

      <!-- Danh sách menu -->
      <v-list>
        <v-list-item 
          v-for="(item, index) in menuItems" 
          :key="index"
          :to="item.path"
          :prepend-icon="item.icon"
          :title="item.title"
          class="nav-item"
        >
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const avatar = "https://png.pngtree.com/png-vector/20240328/ourlarge/pngtree-mechanical-pocket-watch-pattern-cartoon-style-png-image_12237907.png";

// Định nghĩa menu items
const menuItems = ref([
  {
    title: 'Bán hàng tại quầy',
    path: '/admin/sell',
    icon: 'mdi-cash'
  },
  {
    title: 'Quản lý hoá đơn',
    path: '/admin/bill',
    icon: 'mdi-google-analytics'
  },
  {
    title: 'Quản lý sản phẩm',
    path: '/admin/products',
    icon: 'mdi-cash'
  },
  {
    title: 'Quản lý khuyến mãi',
    path: '/admin/promotions',
    icon: 'mdi-google-analytics'
  },
  {
    title: 'Quản lý khách hàng',
    path: '/admin/customers',
    icon: 'mdi-cash'
  },
  {
    title: 'Thống kê',
    path: '/admin/statistics',
    icon: 'mdi-google-analytics'
  }
]);
</script>

<style scoped>
/* Tổng quan */
.nav-admin {
  height: 100%;
}

/* Tiêu đề và logo */
.drawer-header {
  display: flex;
  align-items: center;
  padding: 16px;
  background-color: #f5f5f5;
}

.drawer-avatar {
  margin-right: 16px;
}

.drawer-title {
  font-size: 18px;
  font-weight: bold;
  color: #4a4a4a;
}

.drawer-subtitle {
  font-size: 14px;
  color: #7b7b7b;
}

/* Danh sách menu */
.nav-item {
  font-size: 14px;
  color: #4a4a4a;
  padding: 12px 16px;
  transition: background-color 0.3s ease;
}

/* Hiệu ứng hover */
.nav-item:hover {
  background-color: #e0e0e0;
}

/* Divider */
.v-divider {
  margin: 10px 0;
}

/* Active state cho menu item */
.nav-item.router-link-active {
  background-color: #e0e0e0;
  color: #1976d2;
}
</style>