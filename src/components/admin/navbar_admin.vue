<template>
  <div class="nav-admin">
    <v-navigation-drawer permanent width="300">
      <!-- Logo và Tiêu đề -->

      <v-list-item class="drawer-header">
        <v-avatar class="drawer-avatar" size="40">
          <v-img
            src="https://png.pngtree.com/png-vector/20240328/ourlarge/pngtree-mechanical-pocket-watch-pattern-cartoon-style-png-image_12237907.png"
          ></v-img>
        </v-avatar>

        <v-list-item-content>
          <v-list-item-title class="drawer-title">HappyWatch</v-list-item-title>

          <v-list-item-subtitle class="drawer-subtitle"
            >Cửa hàng đồng hồ vui vẻ</v-list-item-subtitle
          >
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <!-- Danh sách menu -->
      <v-list density="compact">
        <template v-for="(item, index) in menuItems" :key="index">
          <!-- Nếu item có children thì render như group -->
          <v-list-group v-if="item.children" :value="false">
            <template v-slot:activator="{ props }">
              <v-list-item
                v-bind="props"
                :prepend-icon="item.icon"
                :title="item.title"
                class="nav-parent-item"
              ></v-list-item>
            </template>

            <v-list-item
              v-for="(child, childIndex) in item.children"
              :key="childIndex"
              :title="child.title"
              :to="child.path"
              :prepend-icon="child.icon"
              class="nav-child-item"
            ></v-list-item>
          </v-list-group>

          <!-- Nếu item không có children thì render bình thường -->
          <v-list-item
            v-else
            :to="item.path"
            :prepend-icon="item.icon"
            :title="item.title"
            class="nav-item"
          ></v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script setup>
import { ref } from "vue";

const avatar =
  "https://png.pngtree.com/png-vector/20240328/ourlarge/pngtree-mechanical-pocket-watch-pattern-cartoon-style-png-image_12237907.png";

// Định nghĩa menu items với sub-items

const menuItems = ref([
  {
    title: "Bán hàng tại quầy",

    path: "/admin/sell",

    icon: "mdi-cash",
  },

  {
    title: "Quản lý hoá đơn",

    path: "/admin/bill",

    icon: "mdi-google-analytics",
  },

  {
    title: "Quản lý sản phẩm",

    icon: "mdi-package-variant-closed",

    children: [
      {
        title: "Sản phẩm",

        path: "/admin/product-list",

        icon: "mdi-format-list-bulleted",
      },

      {
        title: "Thương Hiệu",

        path: "/admin/thuong-hieu",

        icon: "mdi-shape",
      },

      {
        title: "Màu Sắc",

        path: "/admin/mau-sac",

        icon: "mdi-palette",
      },

      {
        title: "Hình Dáng",

        path: "/admin/hinh-dang",

        icon: "mdi-shape-plus-outline",
      },

      {
        title: "Loại Máy",

        path: "/admin/loai-may",

        icon: "mdi-dharmachakra",
      },

      {
        title: "Chất liệu vỏ",

        path: "/admin/chat-lieu-vo",

        icon: "mdi-material-ui",
      },

      {
        title: "Chất liệu dây",

        path: "/admin/chat-lieu-day",

        icon: "mdi-graph-outline",
      },

      {
        title: "Loại kính",

        path: "/admin/loai-kinh",

        icon: "mdi-clipboard-check",
      },
    ],
  },

  {
    title: "Trả hàng",

    path: "/admin/bill-return",

    icon: "mdi-chart-bar",
  },

  {
    title: "Quản lý khuyến mãi",

    icon: "mdi-ticket-percent",

    children: [
      {
        title: "Phiếu giảm giá",

        path: "/admin/voucher",

        icon: "mdi-format-list-bulleted",
      },

      {
        title: "Giảm giá sản phẩm",

        path: "/admin/voucher-sanpham",

        icon: "mdi-shape",
      },
    ],
  },

  {
    title: "Quản lý người dùng",

    icon: "mdi-account-group",

    children: [
      {
        title: "Khách Hàng",

        path: "/admin/khach-hang",

        icon: "mdi-import",
      },

      {
        title: "Nhân Viên",

        path: "/admin/nhan-vien",

        icon: "mdi-clipboard-check",
      },
    ],
  },

  {
    title: "Thống kê",

    path: "/admin/thong-ke",

    icon: "mdi-chart-bar",
  },
]);
</script>

<style scoped>
.drawer-header {
  padding: 12px;

  background-color: #f5f5f5;
}

.drawer-avatar {
  margin-right: 12px;
}

.drawer-title {
  font-size: 16px;

  font-weight: 600;

  color: #333;

  line-height: 1.2;
}

.drawer-subtitle {
  font-size: 12px;

  color: #666;
}

.nav-item,
.nav-parent-item {
  font-size: 14px;

  color: #333;

  height: 40px;

  margin: 4px 0;
}

.nav-child-item {
  font-size: 13px;

  padding-left: 12px !important;

  height: 36px;

  opacity: 0.9;
}

.nav-item:hover,
.nav-parent-item:hover,
.nav-child-item:hover {
  background-color: rgba(25, 118, 210, 0.08);
}

.v-divider {
  margin: 8px 0;
}

.nav-item.router-link-active,
.nav-child-item.router-link-active {
  background-color: rgba(25, 118, 210, 0.12);

  color: #1976d2;

  font-weight: 500;
}

:deep(.v-list-group__items) {
  margin-left: 8px;
}
</style>
