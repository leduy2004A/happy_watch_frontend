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
            @input="handleSearch"
          />
        </span>
        <Button label="Bỏ bộ lọc" @click="deleteBoLoc()" />
      </div>

      <!-- Date filters and type selection -->
      <div class="col-12 flex align-items-center">
        <div class="flex align-items-center">
          <span class="p-float-label mr-4" style="width: 180px">
            <Calendar
              v-model="dateFrom"
              :show-time="true"
              dateFormat="dd/mm/yy"
              showIcon
              inputId="dateFrom"
              @change="handleDateChange"
            />
            <label for="dateFrom">Từ ngày</label>
          </span>

          <span class="p-float-label mr-6" style="width: 180px">
            <Calendar
              v-model="dateTo"
              :show-time="true"
              dateFormat="dd/mm/yy"
              showIcon
              inputId="dateTo"
              @change="handleDateChange"
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
              @change="handleTypeChange"
            />
            <label for="all" class="mr-4">Tất cả</label>

            <RadioButton
              v-model="invoiceType"
              inputId="online"
              name="type"
              value="online"
              class="mr-2"
              @change="handleTypeChange"
            />
            <label for="online" class="mr-4">Trực tuyến</label>

            <RadioButton
              v-model="invoiceType"
              inputId="offline"
              name="type"
              value="offline"
              class="mr-2"
              @change="handleTypeChange"
            />
            <label for="offline">Tại quầy</label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { quanLyHoaDonStore } from "@/store/quanLyhoaDonStore";

const store = quanLyHoaDonStore();

const searchQuery = ref("");
const dateFrom = ref("");
const dateTo = ref("");
const invoiceType = ref("all");

// Handlers
const handleSearch = () => {
  store.setSearchQuery(searchQuery.value);
};

const handleDateChange = () => {
  store.setDateRange(dateFrom.value, dateTo.value);
};

const handleTypeChange = () => {
  store.setInvoiceType(invoiceType.value);
};
const deleteBoLoc = () => {
  searchQuery.value = "";
  dateFrom.value = "";
  dateTo.value = "";
  invoiceType.value = "all";
  store.deleteBoLoc();
};
// Watch changes
watch(searchQuery, (newVal) => {
  store.setSearchQuery(newVal);
});

watch([dateFrom, dateTo], ([newFrom, newTo]) => {
  store.setDateRange(newFrom, newTo);
});

watch(invoiceType, (newVal) => {
  store.setInvoiceType(newVal);
});
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
