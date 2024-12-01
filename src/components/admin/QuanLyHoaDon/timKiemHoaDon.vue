<template>
  <div class="container">
    <div class="grid">
      <!-- Search bar and buttons -->
      <div class="col-12 flex align-items-center mb-3">
        <span class="p-input-icon-left mr-4" style="max-width: 400px">
          <InputText 
            v-model="searchQuery"
            placeholder="Tìm kiếm hoá đơn"
            class="search-field"
          />
        </span>

        
      </div>

      <!-- Date filters and type selection -->
      <div class="col-12 flex align-items-center">
        <div class="flex align-items-center">
          <span class="p-float-label mr-4" style="width: 180px">
            <Calendar
              v-model="dateFrom"
              dateFormat="dd/mm/yy"
              showIcon
              inputId="dateFrom"
            />
            <label for="dateFrom">Từ ngày</label>
          </span>

          <span class="p-float-label mr-6" style="width: 180px">
            <Calendar
              v-model="dateTo"
              dateFormat="dd/mm/yy"
              showIcon
              inputId="dateTo"
            />
            <label for="dateTo">Đến ngày</label>
          </span>
        </div>

        <div class="flex align-items-center mr-6">
          <span class="mr-3 text-subtitle-1">Loại:</span>
          <div class="flex">
            <RadioButton
              v-model="invoiceType"
              inputId="all"
              name="type"
              value="all"
              class="mr-2"
            />
            <label for="all" class="mr-4">Tất cả</label>

            <RadioButton
              v-model="invoiceType"
              inputId="online"
              name="type"
              value="online"
              class="mr-2"
            />
            <label for="online" class="mr-4">Trực tuyến</label>

            <RadioButton
              v-model="invoiceType"
              inputId="offline"
              name="type"
              value="offline"
              class="mr-2"
            />
            <label for="offline">Tại quầy</label>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// State
const searchQuery = ref('')
const dateFrom = ref('')
const dateTo = ref('')
const invoiceType = ref('all')

// Methods
const handleSearch = () => {
  console.log('Searching:', {
    query: searchQuery.value,
    dateFrom: dateFrom.value,
    dateTo: dateTo.value,
    type: invoiceType.value
  })
}

const handleExport = () => {
  console.log('Exporting to Excel...')
}

const handleScan = () => {
  console.log('Opening scanner...')
}

const handleCreate = () => {
  console.log('Creating new invoice...')
}
</script>

<style scoped>
.search-field {
  width: 100%;
}

:deep(.p-inputtext),
:deep(.p-button) {
  height: 44px;
}

:deep(.p-float-label) {
  display: block;
}

:deep(.p-float-label label) {
  background: white;
}

:deep(.p-radiobutton) {
  width: 20px;
  height: 20px;
}

:deep(.p-button) {
  font-weight: 500;
}

label {
  font-size: 14px;
}
</style>