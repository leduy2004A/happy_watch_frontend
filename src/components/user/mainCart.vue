<template >
    <v-container>
         <div class="main-cart">
        <tableCart class="tableCart"></tableCart>
        <tongTienCart class="tongTien"></tongTienCart>
    </div>   
    </v-container>

</template>
<script setup>
import tableCart from './tableCart.vue';
import tongTienCart from './tongTienCart.vue';
</script>
<style scoped>
    .main-cart{
        display: flex;
        padding: 50px 0;
    }
    .tableCart{
        flex: 2;
    }
    .tongTien{
        flex: 1
    }
</style>