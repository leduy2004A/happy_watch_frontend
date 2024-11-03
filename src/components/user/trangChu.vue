<template>
    <div>
        <headerUser></headerUser>
        <router-view :key="route.fullPath"></router-view>
        <footerUser class="mt-10"></footerUser>
    </div>
   
</template>
<script setup>
import { useRoute } from 'vue-router';
const route = useRoute()
import headerUser from './headerUser.vue';
import footerUser from './footerUser.vue';
</script>
<style scoped>
    
</style>