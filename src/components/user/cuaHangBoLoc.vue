<template>
  <div class="container">
    <!-- Active Filters -->
    <Card class="mb-4">
      <template #header>
        <div class="flex justify-content-between align-items-center p-3">
          <span class="text-lg font-semibold">ACTIVE FILTERS</span>
          <i class="pi pi-chevron-down text-600"></i>
        </div>
      </template>
      <template #content>
        <div class="flex flex-wrap gap-2">
          <Chip v-for="filter in activeFilters"
                :key="filter"
                :label="filter"
                removable
                @remove="removeFilter(filter)"
                class="custom-chip"
          />
          <Button v-if="activeFilters.length"
                  label="Reset"
                  link
                  size="small"
                  @click="resetFilters"
          />
        </div>
      </template>
    </Card>

    <!-- Categories -->
    <Card class="mb-4">
      <template #header>
        <div class="flex justify-content-between align-items-center p-3">
          <span class="text-lg font-semibold">DANH MỤC</span>
          <i class="pi pi-chevron-down text-600"></i>
        </div>
      </template>
      <template #content>
        <ul class="list-none p-0 m-0">
          <li v-for="category in categories" 
              :key="category.value"
              @click="toggleFilter(category.value)"
              class="category-item p-3 flex justify-content-between align-items-center cursor-pointer"
              :class="{'selected': activeFilters.includes(category.value)}"
          >
            <span :class="{'font-medium': activeFilters.includes(category.value)}">
              {{ category.text }}
            </span>
            <Badge :value="category.count" 
                   :severity="activeFilters.includes(category.value) ? 'info' : 'secondary'"
            />
          </li>
        </ul>
      </template>
    </Card>

    <!-- Price Filter -->
    <Card>
      <template #header>
        <div class="flex justify-content-between align-items-center p-3">
          <span class="text-lg font-semibold">LỌC GIÁ</span>
          <i class="pi pi-chevron-down text-600"></i>
        </div>
      </template>
      <template #content>
        <div class="p-3">
          <Slider v-model="priceRange" 
                  :min="minPrice" 
                  :max="maxPrice" 
                  :step="1000"
                  range
                  class="mt-4"
          />
          <div class="flex justify-content-between mt-3">
            <span class="text-sm text-600">{{ formatPrice(priceRange[0]) }}đ</span>
            <span class="text-sm text-600">{{ formatPrice(priceRange[1]) }}đ</span>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const activeFilters = ref(['Đồng hồ cặp đôi']);
const categories = ref([
  { value: 'CASIO', text: 'CASIO', count: 2 },
  { value: 'CITIZEN', text: 'CITIZEN', count: 1 },
  { value: 'Đồng hồ cặp đôi', text: 'ĐỒNG HỒ CẶP ĐÔI', count: 5 },
  { value: 'Đồng hồ nam', text: 'ĐỒNG HỒ NAM', count: 3 },
  { value: 'Đồng hồ nữ', text: 'ĐỒNG HỒ NỮ', count: 2 },
  { value: 'ROLEX', text: 'ROLEX', count: 1 },
  { value: 'SALE', text: 'SALE', count: 1 },
  { value: 'Sản phẩm hot', text: 'SẢN PHẨM HOT', count: 1 }
]);

const minPrice = ref(639000);
const maxPrice = ref(739370000);
const priceRange = ref([639000, 739370000]);

const toggleFilter = (filter) => {
  if (activeFilters.value.includes(filter)) {
    activeFilters.value = activeFilters.value.filter(f => f !== filter);
  } else {
    activeFilters.value.push(filter);
  }
};

const removeFilter = (filter) => {
  activeFilters.value = activeFilters.value.filter(f => f !== filter);
};

const resetFilters = () => {
  activeFilters.value = [];
  priceRange.value = [minPrice.value, maxPrice.value];
};

const formatPrice = (value) => {
  return new Intl.NumberFormat('vi-VN').format(value);
};
</script>

<style scoped>
.category-item {
  border-radius: 6px;
  transition: background-color 0.2s;
}

.category-item:hover {
  background-color: var(--surface-100);
}

.category-item.selected {
  background-color: var(--primary-50);
}

.custom-chip {
  background: var(--surface-200);
  color: var(--text-color-secondary);
}

:deep(.p-card) {
  border-radius: 12px;
  border: 1px solid var(--surface-200);
}

:deep(.p-card-header) {
  padding: 0;
  border-bottom: 1px solid var(--surface-200);
}

:deep(.p-slider) {
  background: var(--surface-200);
}

:deep(.p-slider .p-slider-range) {
  background: var(--primary-color);
}

:deep(.p-badge) {
  font-size: 0.75rem;
  font-weight: 500;
}

:deep(.p-chip) {
  background: var(--surface-200);
}

:deep(.p-chip .p-chip-remove-icon) {
  margin-left: 0.5rem;
}
</style>