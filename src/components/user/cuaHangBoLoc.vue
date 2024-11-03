<template>
  <v-container class="pa-0">
    <!-- Active Filters -->
    <v-card class="mb-6 premium-card" elevation="0">
      <v-card-title class="d-flex justify-space-between align-center py-4 px-4">
        <span class="premium-title">ACTIVE FILTERS</span>
        <v-icon color="grey darken-2" size="20">mdi-chevron-down</v-icon>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text class="px-4 py-3">
        <div class="d-flex flex-wrap">
          <v-chip
            v-for="filter in activeFilters"
            :key="filter"
            class="ma-1 premium-chip"
            closable
            label
            @click:close="removeFilter(filter)"
          >
            {{ filter }}
          </v-chip>
          <v-btn
            v-if="activeFilters.length"
            text
            x-small
            color="primary"
            class="ml-2 text-none reset-btn"
            @click="resetFilters"
          >
            Reset
          </v-btn>
        </div>
      </v-card-text>
    </v-card>

    <!-- Categories -->
    <v-card class="mb-6 premium-card" elevation="0">
      <v-card-title class="d-flex justify-space-between align-center py-4 px-4">
        <span class="premium-title">DANH MỤC</span>
        <v-icon color="grey darken-2" size="20">mdi-chevron-down</v-icon>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text class="pa-0">
        <v-list class="premium-list">
          <v-list-item
            v-for="category in categories"
            :key="category.value"
            @click="toggleFilter(category.value)"
            class="premium-list-item"
            :class="{'selected': activeFilters.includes(category.value)}"
            dense
          >
            <v-list-item-content>
              <v-list-item-title 
                class="category-title"
                :class="{'font-weight-medium': activeFilters.includes(category.value)}"
              >
                {{ category.text }}
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-action class="ma-0">
              <v-chip
                x-small
                label
                class="count-chip"
                :color="activeFilters.includes(category.value) ? 'primary lighten-5' : 'grey lighten-4'"
                :text-color="activeFilters.includes(category.value) ? 'primary' : 'grey darken-2'"
              >
                {{ category.count }}
              </v-chip>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>

    <!-- Price Filter -->
    <v-card class="premium-card" elevation="0">
      <v-card-title class="d-flex justify-space-between align-center py-4 px-4">
        <span class="premium-title">LỌC GIÁ</span>
        <v-icon color="grey darken-2" size="20">mdi-chevron-down</v-icon>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text class="px-4 pt-6 pb-4">
        <v-range-slider
          v-model="priceRange"
          :min="minPrice"
          :max="maxPrice"
          :step="1000"
          thumb-label="always"
          class="price-slider"
          color="primary"
          track-color="grey lighten-2"
        >
          <template v-slot:thumb-label="{ value }">
            {{ formatPriceShort(value) }}
          </template>
        </v-range-slider>
        <div class="d-flex justify-space-between mt-3">
          <span class="price-label">{{ formatPrice(priceRange[0]) }}đ</span>
          <span class="price-label">{{ formatPrice(priceRange[1]) }}đ</span>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      activeFilters: ['Đồng hồ cặp đôi'],
      categories: [
        { value: 'CASIO', text: 'CASIO', count: 2 },
        { value: 'CITIZEN', text: 'CITIZEN', count: 1 },
        { value: 'Đồng hồ cặp đôi', text: 'ĐỒNG HỒ CẶP ĐÔI', count: 5 },
        { value: 'Đồng hồ nam', text: 'ĐỒNG HỒ NAM', count: 3 },
        { value: 'Đồng hồ nữ', text: 'ĐỒNG HỒ NỮ', count: 2 },
        { value: 'ROLEX', text: 'ROLEX', count: 1 },
        { value: 'SALE', text: 'SALE', count: 1 },
        { value: 'Sản phẩm hot', text: 'SẢN PHẨM HOT', count: 1 }
      ],
      minPrice: 639000,
      maxPrice: 739370000,
      priceRange: [639000, 739370000],
    }
  },
  methods: {
    toggleFilter(filter) {
      if (this.activeFilters.includes(filter)) {
        this.activeFilters = this.activeFilters.filter(f => f !== filter);
      } else {
        this.activeFilters.push(filter);
      }
    },
    removeFilter(filter) {
      this.activeFilters = this.activeFilters.filter(f => f !== filter);
    },
    resetFilters() {
      this.activeFilters = [];
      this.priceRange = [this.minPrice, this.maxPrice];
    },
    formatPrice(value) {
      return new Intl.NumberFormat('vi-VN').format(value);
    },
    formatPriceShort(value) {
      if (value >= 1000000) {
        return (value / 1000000).toFixed(1) + 'M';
      }
      return (value / 1000).toFixed(0) + 'K';
    }
  }
}
</script>

<style scoped>
.premium-card {
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  transition: all 0.3s ease;
  background: white !important;
  overflow: hidden;
}

.premium-card:hover {
  border-color: rgba(0, 0, 0, 0.12);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05) !important;
}

.premium-title {
  font-size: 0.875rem;
  letter-spacing: 0.5px;
  color: rgba(0, 0, 0, 0.87);
  font-weight: 600;
}

.premium-chip {
  background-color: #f5f5f5 !important;
  color: rgba(0, 0, 0, 0.7);
  font-size: 0.8125rem;
  font-weight: 500;
  height: 28px !important;
  transition: all 0.2s ease;
}

.premium-chip:hover {
  background-color: #eeeeee !important;
}

.premium-chip .v-icon {
  font-size: 16px;
  color: rgba(0, 0, 0, 0.6);
}

.reset-btn {
  font-size: 0.8125rem;
  font-weight: 500;
  letter-spacing: 0.4px;
  height: 28px !important;
}

.premium-list {
  padding: 4px !important;
}

.premium-list-item {
  border-radius: 8px;
  margin: 2px 4px;
  min-height: 40px !important;
  transition: all 0.2s ease;
  cursor: pointer;
}

.premium-list-item:hover {
  background-color: #fafafa;
}

.premium-list-item.selected {
  background-color: #f5f9ff !important;
}

.category-title {
  font-size: 0.875rem !important;
  color: rgba(0, 0, 0, 0.75);
  letter-spacing: 0.2px;
}

.count-chip {
  min-width: 24px;
  height: 20px !important;
  font-size: 0.75rem;
  font-weight: 500;
}

.price-slider {
  margin-top: 12px;
}

.price-slider .v-slider__thumb {
  transform: scale(0.8);
  transition: transform 0.2s ease;
}

.price-slider .v-slider__thumb:hover {
  transform: scale(1);
}

.price-slider .v-slider__thumb-label {
  font-size: 0.75rem;
  font-weight: 500;
}

.price-label {
  font-size: 0.8125rem;
  color: rgba(0, 0, 0, 0.6);
  font-weight: 500;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>