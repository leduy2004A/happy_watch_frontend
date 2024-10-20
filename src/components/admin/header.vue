<template>
  <div class="header">
    <v-app-bar :elevation="2">
      <template v-slot:prepend>
        <v-app-bar-nav-icon></v-app-bar-nav-icon>
      </template>

      <template v-slot:append>
        
          <v-avatar>
            <v-img
              alt="John"
              src="https://cdn.vuetifyjs.com/images/john.jpg"
            ></v-img>
          </v-avatar>
      
      </template>
    </v-app-bar>
  </div>
</template>
<script setup></script>
<style scoped></style>
