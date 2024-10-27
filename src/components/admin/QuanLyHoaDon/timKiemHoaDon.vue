<template>
  <v-container class="pa-4" fluid>
    <v-row>
      <!-- Search bar and buttons -->
      <v-col cols="12" class="d-flex align-center mb-3">
        <v-text-field
          v-model="searchQuery"
          prepend-inner-icon="mdi-magnify"
          placeholder="Tìm kiếm hoá đơn"
          hide-details
          variant="outlined"
          class="search-field mr-4"
          style="max-width: 400px"
        ></v-text-field>
        
        <v-btn
          color="warning"
          variant="outlined"
          class="mr-3 px-4"
          prepend-icon="mdi-qrcode-scan"
        >
          Quét mã
        </v-btn>
        
        <v-btn
          color="primary"
          class="px-4"
          prepend-icon="mdi-plus"
        >
          Tạo hoá đơn
        </v-btn>
      </v-col>

      <!-- Date filters and type selection -->
      <v-col cols="12" class="d-flex align-center">
        <div class="d-flex align-center">
          <v-menu
            v-model="menuFrom"
            :close-on-content-click="false"
            transition="scale-transition"
          >
            <template v-slot:activator="{ props }">
              <v-text-field
                v-model="dateFrom"
                label="Từ ngày"
                prepend-inner-icon="mdi-calendar"
                readonly
                hide-details
                variant="outlined"
                class="mr-4"
                style="width: 180px"
                v-bind="props"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="dateFrom"
              no-title
              @update:model-value="menuFrom = false"
            ></v-date-picker>
          </v-menu>

          <v-menu
            v-model="menuTo"
            :close-on-content-click="false"
            transition="scale-transition"
          >
            <template v-slot:activator="{ props }">
              <v-text-field
                v-model="dateTo"
                label="Đến ngày"
                prepend-inner-icon="mdi-calendar"
                readonly
                hide-details
                variant="outlined"
                class="mr-6"
                style="width: 180px"
                v-bind="props"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="dateTo"
              no-title
              @update:model-value="menuTo = false"
            ></v-date-picker>
          </v-menu>
        </div>

        <div class="d-flex align-center mr-6">
          <span class="mr-3 text-subtitle-1">Loại:</span>
          <v-radio-group
            v-model="invoiceType"
            inline
            hide-details
            class="mt-1"
          >
            <v-radio
              label="Tất cả"
              value="all"
            ></v-radio>
            <v-radio
              label="Trực tuyến"
              value="online"
            ></v-radio>
            <v-radio
              label="Tại quầy"
              value="offline"
            ></v-radio>
          </v-radio-group>
        </div>

        <v-btn
          color="success"
          class="px-4"
          prepend-icon="mdi-microsoft-excel"
        >
          Export Excel
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'

// State
const searchQuery = ref('')
const dateFrom = ref('')
const dateTo = ref('')
const menuFrom = ref(false)
const menuTo = ref(false)
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
:deep(.v-field) {
  border-radius: 4px;
}

:deep(.v-text-field .v-input__prepend-inner) {
  margin-right: 8px;
}

:deep(.v-radio-group .v-radio) {
  margin-right: 12px;
}

:deep(.v-field__input) {
  min-height: 44px;
  padding: 0 15px;
}

:deep(.v-btn) {
  height: 44px;
  font-weight: 500;
}

:deep(.v-radio label) {
  font-size: 14px;
}
</style>