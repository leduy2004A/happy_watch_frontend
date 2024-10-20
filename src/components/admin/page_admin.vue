<template>
    <div class="page-admin">
              <HeaderAdmin></HeaderAdmin>
      <navbar_admin></navbar_admin>
      <RouterView></RouterView>
    </div>
   
</template>
<script setup>
import HeaderAdmin from './header.vue';
import navbar_admin from './navbar_admin.vue';
</script>
<style scoped>
    .page-admin{
      background-color: #DACCE4;
    }
</style>