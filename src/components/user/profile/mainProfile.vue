<template>
    <div>
        <headerUser></headerUser>
     
            <div class="d-flex container" >
            <navbarProfile class="nav"></navbarProfile>
            <router-view class="item"></router-view>
        </div> 
       
       
        
        <footerUser></footerUser>
    </div>
</template>
<script setup>
import navbarProfile from './navbarProfile.vue';
import headerUser from '../headerUser.vue';
import footerUser from '../footerUser.vue';
import timeLineDonHang from './timeLineDonHang.vue';
</script>
<style scoped>
    .nav{
        flex: 1;
    }
    .item{
        flex: 5;
    }
    .container{
        padding: 40px 20px;
    }
</style>