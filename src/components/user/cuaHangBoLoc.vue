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
        <div class="flex justify-content-between align-items-center p-3 cursor-pointer"
             @click="toggleCategorySection">
          <span class="text-lg font-semibold">DANH MỤC</span>
          <i class="pi" :class="[isCategoryExpanded ? 'pi-chevron-up' : 'pi-chevron-down']"></i>
        </div>
      </template>
      <template #content>
        <Collapse :modelValue="isCategoryExpanded">
          <ul class="list-none p-0 m-0">
            <li v-for="category in productCategories" 
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
        </Collapse>
      </template>
    </Card>

    <!-- Brands -->
    <Card class="mb-4">
    <template #header>
      <div class="flex justify-content-between align-items-center p-3 cursor-pointer"
           @click="toggleBrandSection">
        <span class="text-lg font-semibold">THƯƠNG HIỆU</span>
        <i class="pi" :class="[isBrandExpanded ? 'pi-chevron-up' : 'pi-chevron-down']"></i>
      </div>
    </template>
    <template #content>
      <div class="brand-content" :class="{ 'expanded': isBrandExpanded }">
        <ul class="list-none p-0 m-0">
          <li v-for="brand in brands" 
              :key="brand.value"
              @click="toggleFilter(brand.value)"
              class="category-item p-3 flex justify-content-between align-items-center cursor-pointer"
              :class="{'selected': activeFilters.includes(brand.value)}"
          >
            <span :class="{'font-medium': activeFilters.includes(brand.value)}">
              {{ brand.text }}
            </span>
            <Badge :value="brand.count" 
                   :severity="activeFilters.includes(brand.value) ? 'info' : 'secondary'"
            />
          </li>
        </ul>
      </div>
    </template>
  </Card>

  <Card class="mb-4">
    <template #header>
      <div class="flex justify-content-between align-items-center p-3 cursor-pointer"
           @click="toggleLoaiMaySection">
        <span class="text-lg font-semibold">LOẠI MÁY</span>
        <i class="pi" :class="[isLoaiMayExpanded ? 'pi-chevron-up' : 'pi-chevron-down']"></i>
      </div>
    </template>
    <template #content>
      <div class="brand-content" :class="{ 'expanded': isLoaiMayExpanded }">
        <ul class="list-none p-0 m-0">
          <li v-for="brand in loaiMay" 
              :key="brand.value"
              @click="toggleFilter(brand.value)"
              class="category-item p-3 flex justify-content-between align-items-center cursor-pointer"
              :class="{'selected': activeFilters.includes(brand.value)}"
          >
            <span :class="{'font-medium': activeFilters.includes(brand.value)}">
              {{ brand.text }}
            </span>
            <Badge :value="brand.count" 
                   :severity="activeFilters.includes(brand.value) ? 'info' : 'secondary'"
            />
          </li>
        </ul>
      </div>
    </template>
  </Card>
    <!-- Price Filter -->
    <Card>
      <template #header>
        <div class="flex justify-content-between align-items-center p-3 cursor-pointer"
             @click="togglePriceSection">
          <span class="text-lg font-semibold">LỌC GIÁ</span>
          <i class="pi" :class="[isPriceExpanded ? 'pi-chevron-up' : 'pi-chevron-down']"></i>
        </div>
      </template>
      <template #content>
        <Collapse :modelValue="isPriceExpanded">
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
        </Collapse>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { sanPhamCuaHangStore } from '@/store/sanPhamCuaHangStore';
import { layLoaiMayKemSoLuong, layThuongHieuKemSoLuong } from '@/axios/sanpham';
const isCategoryExpanded = ref(true);
const isBrandExpanded = ref(false);
const isLoaiMayExpanded = ref(false);
const isPriceExpanded = ref(true);

const toggleCategorySection = () => {
  isCategoryExpanded.value = !isCategoryExpanded.value;
};

const toggleBrandSection =async () => {
  isBrandExpanded.value = !isBrandExpanded.value;
  if(isBrandExpanded.value === true)
  {
    const result = await layThuongHieuKemSoLuong()
    if(result.status === 200)
    {
      const brand = result.data.map((item)=>({
         value: item.tenThuongHieu, text: item.tenThuongHieu, count: item.soLuong
      }))
      brands.value = brand
    }
  }
};
const toggleLoaiMaySection =async () => {
  isLoaiMayExpanded.value = !isLoaiMayExpanded.value;
  if(isLoaiMayExpanded.value === true)
  {
    const result = await layLoaiMayKemSoLuong()
    if(result.status === 200)
    {
      const brand = result.data.map((item)=>({
         value: item.tenLoaiMay, text: item.tenLoaiMay, count: item.soLuong
      }))
      loaiMay.value = brand
    }
  }
};
const togglePriceSection = () => {
  isPriceExpanded.value = !isPriceExpanded.value;
};


const formatPrice = (value) => {
  return new Intl.NumberFormat('vi-VN').format(value);
};



const store = sanPhamCuaHangStore();
const { activeFilters } = storeToRefs(store);

// Các ref khác giữ nguyên
const productCategories = ref([
  // { value: 'Đồng hồ cặp đôi', text: 'ĐỒNG HỒ CẶP ĐÔI', count: 5 },
  { value: 'Nam', text: 'ĐỒNG HỒ NAM' },
  { value: 'Nữ', text: 'ĐỒNG HỒ NỮ'},
  // { value: 'SALE', text: 'SALE', count: 1 },
  // { value: 'Đồng hồ haiz class', text: 'Đồng hồ haiz class', count: 1 }
]);

const brands = ref([
  { value: 'CASIO', text: 'CASIO', count: 2 },
  { value: 'CITIZEN', text: 'CITIZEN', count: 1 },
  { value: 'ROLEX', text: 'ROLEX', count: 1 },
]);
const loaiMay = ref([
  { value: 'CASIO', text: 'CASIO', count: 2 },
  { value: 'CITIZEN', text: 'CITIZEN', count: 1 },
  { value: 'ROLEX', text: 'ROLEX', count: 1 },
]);

const minPrice = ref(639000);
const maxPrice = ref(739370000);
const priceRange = ref([639000, 739370000]);

// Watch các thay đổi của bộ lọc
watch(activeFilters, (newFilters) => {
  store.setFilters(newFilters);
}, { deep: true });

watch(priceRange, (newRange) => {
  store.setPriceRange(newRange);
}, { deep: true });

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
  store.resetFilters();
  priceRange.value = [minPrice.value, maxPrice.value];
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

/* Thêm animation co dãn cho phần thương hiệu */
:deep(.p-collapse-content) {
  transition: all 0.3s ease-in-out;
}
.brand-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease-out;
}

.brand-content.expanded {
  max-height: 500px; /* Điều chỉnh giá trị này tùy theo số lượng thương hiệu */
}

:deep(.p-collapse-content-wrapper) {
  overflow: hidden;
}

/* Style cho phần thương hiệu khi co dãn */
:deep(.p-collapse-content-enter-from),
:deep(.p-collapse-content-leave-to) {
  max-height: 0;
  opacity: 0;
}

:deep(.p-collapse-content-enter-to),
:deep(.p-collapse-content-leave-from) {
  max-height: 1000px;
  opacity: 1;
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

/* Style mới cho thanh trượt giá */
:deep(.p-slider) {
  background: #e9ecef;
  height: 4px;
}

:deep(.p-slider .p-slider-range) {
  background: linear-gradient(to right, #4CAF50, #2196F3);
  height: 4px;
}

:deep(.p-slider .p-slider-handle) {
  background: #ffffff;
  border: 2px solid #2196F3;
  border-radius: 50%;
  height: 16px;
  width: 16px;
  margin-top: -6px;
  transition: background-color 0.2s, border-color 0.2s, box-shadow 0.2s;
}

:deep(.p-slider .p-slider-handle:hover) {
  background: #2196F3;
  border-color: #2196F3;
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

/* Animation cho việc mở rộng/thu gọn các section */
.p-collapse-content-wrapper {
  transition: max-height 0.3s ease-out;
}
</style>