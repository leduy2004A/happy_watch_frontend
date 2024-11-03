<template>
  <div class="page-admin">
      <HeaderAdmin></HeaderAdmin>
      <navbar_admin></navbar_admin>
      <router-view v-slot="{ Component }">
          <keep-alive>
              <component :is="Component" :key="$route.fullPath" />
          </keep-alive>
      </router-view>
  </div>
</template>

<script setup>
import HeaderAdmin from './header.vue';
import navbar_admin from './navbar_admin.vue';
</script>