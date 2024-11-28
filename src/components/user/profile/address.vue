<template>
    <div class="address-container">
      <div class="header">
        <h2>Địa Chỉ của tôi</h2>
        <Button 
          label="Thêm địa chỉ" 
          icon="pi pi-plus" 
          @click="openNewAddressDialog"
          severity="success"
          class="my-2"
        />
      </div>
  
      <div class="address-list">
        <Card v-for="address in addresses" :key="address.id" class="address-card">
          <template #title>
            {{ address.name }}
          </template>
          <template #subtitle>
            {{ address.phone }}
          </template>
          <template #content>
            <p>{{ address.fullAddress }}</p>
          </template>
          <template #footer>
            <div class="card-footer">
              <Button 
                label="Cập nhật" 
                icon="pi pi-pencil" 
                @click="editAddress(address)"
                severity="secondary" 
                text
              />
             
            </div>
          </template>
        </Card>
      </div>
  
      <!-- Dialog thêm/sửa địa chỉ -->
      <Dialog 
        v-model:visible="dialogVisible"
        :header="dialogMode === 'add' ? 'Thêm địa chỉ mới' : 'Cập nhật địa chỉ'"
        :modal="true"
        class="address-dialog"
      >
        <div class="p-fluid">
          <div class="field">
            <label for="name">Tên địa chỉ</label>
            <InputText 
              id="name" 
              v-model="addressForm.name" 
              placeholder="VD: Nhà riêng, Văn phòng..."
            />
          </div>
  
          <div class="field">
            <label for="phone">Số điện thoại</label>
            <InputText 
              id="phone" 
              v-model="addressForm.phone"
              placeholder="Nhập số điện thoại"
            />
          </div>
  
          <div class="field">
            <label for="address">Địa chỉ chi tiết</label>
            <Textarea 
              id="address" 
              v-model="addressForm.fullAddress"
              rows="3"
              placeholder="Nhập địa chỉ chi tiết"
            />
          </div>
  
          <div class="field-checkbox">
            <Checkbox 
              v-model="addressForm.isDefault" 
              :binary="true" 
              id="default"
            />
            <label for="default">Đặt làm địa chỉ mặc định</label>
          </div>
        </div>
  
        <template #footer>
          <Button 
            label="Hủy" 
            icon="pi pi-times" 
            @click="closeDialog" 
            text
          />
          <Button 
            label="Lưu" 
            icon="pi pi-check" 
            @click="saveAddress" 
            severity="success"
          />
        </template>
      </Dialog>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive } from 'vue'
  
  const dialogVisible = ref(false)
  const dialogMode = ref('add') // 'add' hoặc 'edit'
  
  const addressForm = reactive({
    id: null,
    name: '',
    phone: '',
    fullAddress: '',
    isDefault: false
  })
  
  const addresses = ref([
    {
      id: 1,
      name: 'Địa chỉ 12',
      phone: '0473029182',
      fullAddress: 'aaaaa, Xã Mường Giàng, Huyện Quỳnh Nhai, Sơn La',
      isDefault: true
    }
  ])
  
  const openNewAddressDialog = () => {
    dialogMode.value = 'add'
    resetForm()
    dialogVisible.value = true
  }
  
  const editAddress = (address) => {
    dialogMode.value = 'edit'
    Object.assign(addressForm, address)
    dialogVisible.value = true
  }
  
  const closeDialog = () => {
    dialogVisible.value = false
    resetForm()
  }
  
  const resetForm = () => {
    addressForm.id = null
    addressForm.name = ''
    addressForm.phone = ''
    addressForm.fullAddress = ''
    addressForm.isDefault = false
  }
  
  const saveAddress = () => {
    if (dialogMode.value === 'add') {
      // Xử lý thêm địa chỉ mới
      addresses.value.push({
        id: Date.now(),
        ...addressForm
      })
    } else {
      // Xử lý cập nhật địa chỉ
      const index = addresses.value.findIndex(a => a.id === addressForm.id)
      if (index !== -1) {
        addresses.value[index] = { ...addressForm }
      }
    }
    closeDialog()
  }
  
  const setDefaultAddress = (address) => {
    addresses.value.forEach(a => a.isDefault = false)
    const index = addresses.value.findIndex(a => a.id === address.id)
    if (index !== -1) {
      addresses.value[index].isDefault = true
    }
  }
  </script>
  
  <style scoped>
  /* .address-container {
    padding: 1rem;
  }
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }
  
  .address-list {
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
  
  .address-card {
    margin-bottom: 1rem;
  }
  
  .card-footer {
    display: flex;
    justify-content: flex-start;
    gap: 0.5rem;
  }
  
  .address-dialog {
    max-width: 500px;
  }
  
  .field {
    margin-bottom: 1.5rem;
  }
  
  .field-checkbox {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  :deep(.p-card) {
    background-color: #fff;
  }
  
  :deep(.p-button.p-button-text) {
    padding: 0.5rem;
  }
  
  :deep(.p-card-content) {
    padding-top: 0.5rem;
  } */
  .address-card {
    margin-bottom: 1rem;
  }
  </style>