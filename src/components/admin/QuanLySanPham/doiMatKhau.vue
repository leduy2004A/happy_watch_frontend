<template>
    <v-container class="profile-container pa-6">
      <v-card class="profile-card" elevation="3">
        <v-card-text>
          <v-row justify="center">
            <v-col cols="12" md="8" lg="6">
              <div class="text-center mb-6">
                <h2 class="text-h5 font-weight-bold primary--text">
                  <v-icon large color="primary" class="mr-2">mdi-lock-reset</v-icon>
                  Đổi mật khẩu
                </h2>
                <v-divider class="mt-3"></v-divider>
              </div>
  
              <v-form ref="form" class="password-form">
                <div class="form-group mb-4">
                  <label class="form-label mb-2">Mật khẩu cũ</label>
                  <Password
                    class="w-full password-input"
                    v-model="employee.oldPass"
                    :toggleMask="true"
                    placeholder="Nhập mật khẩu hiện tại"
                  />
                </div>
  
                <div class="form-group mb-4">
                  <label class="form-label mb-2">Mật khẩu mới</label>
                  <Password
                    class="w-full password-input"
                    v-model="employee.password"
                    :toggleMask="true"
                    placeholder="Nhập mật khẩu mới"
                  />
                </div>
  
                <div class="form-group mb-6">
                  <label class="form-label mb-2">Xác nhận mật khẩu</label>
                  <Password
                    class="w-full password-input"
                    v-model="employee.confirm_password"
                    :toggleMask="true"
                    placeholder="Xác nhận lại mật khẩu mới"
                  />
                  <h5 class="mt-3 text-red">{{ errorMessage }}</h5>
                </div>
  
                <div class="text-center" v-if="isCheckOkk">
                  <v-btn
                    color="primary"
                    @click="changePasswordCf()"
                    class="save-button text-capitalize px-6"
                    elevation="2"
                    rounded
                  
                  >
                    <v-icon left>mdi-content-save</v-icon>
                    Lưu thay đổi
                  </v-btn>
                </div>
              </v-form>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-container>
  </template>
  <script setup>
  import { ref, watch } from 'vue';
  import { changePassword } from '@/axios/sanpham';
  import { useToast } from 'vue-toastification';
  const toast = useToast()
  const employee = ref({})
  const errorMessage = ref("")
  const isCheckOkk = ref(false)
  watch(()=>employee.value.confirm_password,newVal =>{
    if(newVal !== employee.value.password)
    {
      errorMessage.value = 'Mật khẩu không trùng khớp'
      isCheckOkk.value = false
    }else{
      errorMessage.value = ''
      isCheckOkk.value = true
    }
  })
  const changePasswordCf =async ()=>{
    const data = {
      password:employee.value.oldPass,
      newPassword:employee.value.password
    }
    try{
       const resultChange = await changePassword(data)
    if(resultChange.status === 200)
    {
      toast.success("Thay đổi mật khẩu thành công")
    }
    }catch(e)
    {
      console.log(e)
      toast.error(e.response.data.message)
    }
   
  }
  </script>
  <style scoped>
      .profile-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    background-color: #f5f5f5;
  }
  
  .profile-card {
    width: 100%;
    border-radius: 12px;
    background-color: white;
  }
  
  .form-group {
    position: relative;
  }
  
  .form-label {
    display: block;
    font-weight: 500;
    color: #666;
    font-size: 0.95rem;
  }
  
  :deep(.p-password) {
    width: 100%;
  }
  
  :deep(.p-password input) {
    width: 100%;
    padding: 12px;
    border-radius: 8px;
    border: 1px solid #ddd;
    transition: all 0.3s ease;
  }
  
  :deep(.p-password input:focus) {
    border-color: var(--v-primary-base);
    box-shadow: 0 0 0 2px rgba(var(--v-primary-base), 0.1);
  }
  
  :deep(.p-password input:hover) {
    border-color: var(--v-primary-base);
  }
  
  .save-button {
    min-width: 160px;
    height: 44px;
    font-weight: 500;
  }
  
  .password-form {
    padding: 20px;
  }
  
  @media (max-width: 600px) {
    .profile-container {
      padding: 16px !important;
    }
    
    .password-form {
      padding: 10px;
    }
  }
  </style>