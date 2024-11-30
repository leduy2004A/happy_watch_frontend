<template>
    <div class="d-flex">
        <Avatar
        :image="image || employee.avatar"
        class="mr-4 avatar"
        size="xlarge"
        shape="circle"
        v-model="employee.avatar"
        @click="themAnh()"
      />
      <div class="grid">
        <div class="field col-12 md:col-6">
          <label for="fullName">Họ và tên</label>
          <InputText id="fullName" v-model="employee.ten" class="w-full" />
        </div>
        <div class="field col-12 md:col-6">
          <label for="email">Email</label>
          <InputText
            id="email"
            v-model="employee.email"
            type="email"
            class="w-full"
          />
        </div>
        <div class="field col-12 md:col-6">
          <label for="phone">Số điện thoại</label>
          <InputText id="phone" v-model="employee.dienThoai" class="w-full" />
        </div>

        <div class="field col-12 md:col-6">
          <label for="gender">Giới tính</label>
          <Dropdown
            id="gender"
            v-model="employee.gioiTinh"
            :options="genderOptions"
            class="w-full"
          />
        </div>
        <!-- <div class="field col-12 md:col-6">
          <label for="status">Trạng thái</label>
          <Dropdown
            id="status"
            v-model="employee.trangThai"
            :options="statusOptions"
            class="w-full"
          />
        </div> -->
      </div>
    </div>
</template>
<script setup>
import { ref } from 'vue';
const genderOptions = ["Nam", "Nữ"];
const employee = ref({});
const employees = ref([]);
</script>
<style scoped>
    .p-avatar{
      font-size: 100px;
      width: 200px;
      height: 200px;
    }
</style>