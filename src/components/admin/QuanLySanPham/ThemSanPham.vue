<template>
  <v-card class="pa-4 py-10" flat>
    <h3 class="my-10">Thông tin sản phẩm</h3>
    
    <v-form>
      <div class="position-relative">
        <v-text-field
          v-model="productName" 
          label="Tên sản phẩm"
          required
          variant="outlined"
          class="mb-4"
          density="comfortable"
          @input="filterSuggestions"
        ></v-text-field>

        <div v-if="showSuggestions && filteredProducts.length > 0" class="suggestions-container">
          <div
            v-for="product in filteredProducts"
            :key="product"
            class="suggestion-item"
            @click="selectProduct(product)"
          >
            {{ product }}
          </div>
        </div>
      </div>

      <div class="d-flex gap-4 mb-4">
        <div class="flex-grow-1 position-relative">
          <v-combobox
            v-model="category"
            label="Danh mục"
            :items="categories"
            required
            variant="outlined"
            density="comfortable"
            @update:search="(v) => onSearchUpdate(v, 'category')"
          ></v-combobox>
          
          <v-btn
            v-if="showAddButton.category"
            class="add-btn"
            color="warning"
            variant="text"
            density="comfortable"
            @click="() => addNewItem('category')"
          >
            Thêm mới "{{ searchTexts.category }}"
          </v-btn>
        </div>

        <div class="flex-grow-1 position-relative">
          <v-combobox
            v-model="brand"
            label="Thương hiệu"
            :items="brands"
            required
            variant="outlined"
            density="comfortable"
            @update:search="(v) => onSearchUpdate(v, 'brand')"
          ></v-combobox>
          
          <v-btn
            v-if="showAddButton.brand"
            class="add-btn"
            color="warning"
            variant="text"
            density="comfortable"
            @click="() => addNewItem('brand')"
          >
            Thêm mới "{{ searchTexts.brand }}"
          </v-btn>
        </div>
      </div>

      <div class="d-flex gap-4 mb-4">
        <div class="flex-grow-1 position-relative">
          <v-combobox
            v-model="sole"
            label="Đế giày"
            :items="soles"
            required
            variant="outlined"
            density="comfortable"
            @update:search="(v) => onSearchUpdate(v, 'sole')"
          ></v-combobox>
          
          <v-btn
            v-if="showAddButton.sole"
            class="add-btn"
            color="warning"
            variant="text"
            density="comfortable"
            @click="() => addNewItem('sole')"
          >
            Thêm mới "{{ searchTexts.sole }}"
          </v-btn>
        </div>

        <div class="flex-grow-1 position-relative">
          <v-combobox
            v-model="material"
            label="Chất liệu"
            :items="materials"
            required
            variant="outlined"
            density="comfortable"
            @update:search="(v) => onSearchUpdate(v, 'material')"
          ></v-combobox>
          
          <v-btn
            v-if="showAddButton.material"
            class="add-btn"
            color="warning"
            variant="text"
            density="comfortable"
            @click="() => addNewItem('material')"
          >
            Thêm mới "{{ searchTexts.material }}"
          </v-btn>
        </div>
      </div>

      <v-textarea
        v-model="description"
        label="Mô tả sản phẩm"
        variant="outlined"
        density="comfortable"
      ></v-textarea>
      <v-btn color="primary">Thêm sản phẩm</v-btn>
    </v-form>
  </v-card>
</template>

<script setup>
import { ref, computed } from 'vue'

const productName = ref('')
const category = ref('')
const brand = ref('')
const sole = ref('')
const material = ref('')
const description = ref('')

// Danh sách gợi ý sản phẩm
const productSuggestions = ref([
  'Puma 2023',
  'Converse Venom',
  'Rebound Puma V6', 
  'Nike Dunk 2022',
  'Balen Grey 2023',
  'Sneakers unisex cổ cao'
])
const showSuggestions = ref(false)
const filteredProducts = ref([])

const filterSuggestions = () => {
  if (!productName.value) {
    showSuggestions.value = false
    return
  }
  
  filteredProducts.value = productSuggestions.value.filter(product => 
    product.toLowerCase().includes(productName.value.toLowerCase())
  )
  showSuggestions.value = true
}

const selectProduct = (product) => {
  productName.value = product
  showSuggestions.value = false
}

// Danh sách các items
const categories = ref(['Giày cao cổ', 'Giày thể thao'])
const brands = ref(['Converse', 'Nike'])
const soles = ref(['Đế sắt', 'Đế cao su'])
const materials = ref(['Sắt', 'Da', 'Vải'])

// Object lưu trữ text search cho từng trường
const searchTexts = ref({
  category: '',
  brand: '',
  sole: '',
  material: ''
})

// Computed để kiểm tra hiển thị nút thêm mới cho từng trường
const showAddButton = computed(() => {
  return {
    category: searchTexts.value.category && !categories.value.includes(searchTexts.value.category),
    brand: searchTexts.value.brand && !brands.value.includes(searchTexts.value.brand),
    sole: searchTexts.value.sole && !soles.value.includes(searchTexts.value.sole),
    material: searchTexts.value.material && !materials.value.includes(searchTexts.value.material)
  }
})

// Hàm update text search
const onSearchUpdate = (text, field) => {
  searchTexts.value[field] = text
}

// Object map giữa field và ref array tương ứng
const fieldToArray = {
  category: categories,
  brand: brands,
  sole: soles,
  material: materials
}

// Object map giữa field và ref value tương ứng
const fieldToValue = {
  category: category,
  brand: brand,
  sole: sole,
  material: material
}

// Hàm thêm mới item
const addNewItem = (field) => {
  const newValue = searchTexts.value[field]
  if (newValue) {
    fieldToArray[field].value.push(newValue)
    fieldToValue[field].value = newValue
    searchTexts.value[field] = ''
  }
}
</script>

<style scoped>
.gap-4 {
  gap: 16px;
}

.add-btn {
  position: absolute;
  right: 0;
  top: 100%;
  text-transform: none;
  z-index: 1;
}

/* .v-combobox {
  max-width: 100%;
} */

.v-combobox input {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Styles cho phần gợi ý sản phẩm */
.suggestions-container {
  position: absolute;
  top: calc(100% - 16px);
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.suggestion-item {
  padding: 8px 16px;
  cursor: pointer;
}
.custom-combobox {
  max-width: 300px; /* Giới hạn chiều dài */
  white-space: nowrap; /* Ngăn nội dung xuống dòng */
  overflow: hidden; /* Ẩn phần bị tràn */
  text-overflow: ellipsis; /* Hiển thị dấu "..." khi nội dung quá dài */
}
.suggestion-item:hover {
  background-color: #f5f5f5;
}
.v-text-field .v-field {
    cursor: text !important; 
    width: 200px !important;
}
</style>