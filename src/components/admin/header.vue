<template>
  <div class="header">
    <v-app-bar :elevation="2">
      <template v-slot:prepend>
        <v-app-bar-nav-icon></v-app-bar-nav-icon>
      </template>

      <template v-slot:append>
        <div class="avatar-menu">
          <v-avatar @click="toggleMenu" style="cursor: pointer">
            <v-img
              alt="John"
              src="https://cdn.vuetifyjs.com/images/john.jpg"
            ></v-img>
          </v-avatar>
          
          <Menu ref="menu" :model="items" :popup="true" class="my-4">
          </Menu>
        </div>
      </template>
    </v-app-bar>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Menu from 'primevue/menu'

const menu = ref()
const items = ref([
  {
    label: 'Profile',
    icon: 'pi pi-user',
    command: () => {
      // handle profile click
    }
  },
  {
    label: 'Settings',
    icon: 'pi pi-cog',
    command: () => {
      // handle settings click  
    }
  },
  {
    separator: true
  },
  {
    label: 'Logout',
    icon: 'pi pi-power-off',
    command: () => {
      // handle logout click
    }
  }
])

const toggleMenu = (event) => {
  menu.value.toggle(event)
}
</script>

<style scoped>
.avatar-menu {
  position: relative;
}
</style>