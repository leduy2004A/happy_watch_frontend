<template>
    <v-container class="pa-4">
      <!-- Profile Header -->
      <v-row class="mb-6">
        <v-col cols="12" class="d-flex align-center">
          <v-avatar size="64" class="mr-4">
            <v-img :src="profile.avatar" alt="Profile Picture"></v-img>
          </v-avatar>
          <div>
            <h2 class="text-h5">{{ profile.name }}</h2>
            <v-btn
              variant="text"
              density="comfortable"
              prepend-icon="mdi-pencil"
              class="pa-0"
            >
              Sửa hồ sơ
            </v-btn>
          </div>
        </v-col>
      </v-row>
  
      <!-- Navigation Menu -->
      <v-list>
        <v-list-item
          v-for="(item, index) in menuItems"
          :key="index"
          :prepend-icon="item.icon"
          :title="item.title"
          :to="item.route"
          class="py-2"
        >
        </v-list-item>
      </v-list>
    </v-container>
  </template>
  
  <script setup>
import { onMounted, reactive } from 'vue';

const profile = reactive({
  name: 'Nguyễn Thị Thùy Dương',
  avatar: 'https://cdn.kona-blue.com/upload/kona-blue_com/post/images/2024/09/18/458/avatar-dep-4.jpg' // URL của avatar
});

const menuItems = [
  {
    title: 'Hồ sơ',
    icon: 'mdi-card-account-details',
    route: '/profile/ho-so'
  },
  {
    title: 'Địa chỉ',
    icon: 'mdi-map-marker',
    route: '/profile/address'
  },
  {
    title: 'Đơn mua',
    icon: 'mdi-file-document',
    route: '/profile/hoa-don'
  },
  {
    title: 'Phiếu giảm giá',
    icon: 'mdi-ticket-percent',
    route: '/profile/voucher'
  },
  {
    title: 'Đổi mật khẩu',
    icon: 'mdi-key',
    route: '/profile/change-password'
  }
];
onMounted(()=>{
  const data = JSON.parse(localStorage.getItem("user")) 
  profile.avatar = data.avatar
  profile.name = data.ten
})
</script>
  
  <style scoped>
  .v-list-item {
    min-height: 44px;
  }
  
  .v-list-item:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }
  </style>