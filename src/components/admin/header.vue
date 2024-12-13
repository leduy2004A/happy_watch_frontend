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
              :src="avatar"
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
import { ref,onMounted } from 'vue'
import { useRouter } from 'vue-router';
const router = useRouter()
const avatar = ref("")
const menu = ref()
const items = ref([
  {
    label: 'Profile',
    icon: 'pi pi-user',
    command: () => {
      // handle profile click
      router.push('/admin/thong-tin-ca-nhan')
    }
  },
  {
    label: 'Đổi mật khẩu',
    icon: 'pi pi-cog',
    command: () => {
      // handle settings click  
      router.push('/admin/doi-mat-khau')
    }
  },
  {
    separator: true
  },
  {
    label: 'Logout',
    icon: 'pi pi-power-off',
    command: () => {
      localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/';
    }
  }
])
onMounted(async () => {


   avatar.value =JSON.parse(localStorage.getItem("user")).avatar

});
const toggleMenu = (event) => {
  menu.value.toggle(event)
}
</script>

<style scoped>
.avatar-menu {
  position: relative;
}
</style>