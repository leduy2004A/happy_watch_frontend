<template>
  <v-dialog v-model="dialog" max-width="1300px">
    <v-card>
      <v-card-title class="text-h6 pa-4"> Thêm sản phẩm </v-card-title>
      <v-card-text>
        <v-container>
          <h2 class="text-center mb-6">Thêm sản phẩm</h2>

          <v-form ref="form" v-model="valid">
            <v-text-field
                v-model="store.maSanPham"
                label="Mã sản phẩm"
                required
                variant="outlined"
                class="mb-4"
                density="comfortable"
                :rules="[(v) => !!v || 'Mã là bắt buộc']"
              ></v-text-field>
            <div class="position-relative">
              <v-text-field
                v-model="store.productName"
                label="Tên sản phẩm"
                required
                variant="outlined"
                class="mb-4"
                density="comfortable"
                :rules="[(v) => !!v || 'Tên là bắt buộc']"
                @input="store.filterSuggestions"
              ></v-text-field>

              <div
                v-if="store.showSuggestions && store.filteredProducts.length > 0"
                class="suggestions-container"
              >
                <div
                  v-for="product in store.filteredProducts"
                  :key="product"
                  class="suggestion-item"
                  @click="store.selectProduct(product)"
                >
                  {{ product }}
                </div>
              </div>
            </div>
            <v-row>
              <v-col cols="12" md="6">
                <div class="position-relative">
                  <v-combobox
                    v-model="store.product.category"
                    :items="store.categories"
                    item-title="ten"
                    item-value="id"
                    label="Giới tính"
                    required
                    variant="outlined"
                    density="comfortable"
                    :rules="[(v) => !!v || 'Giới tính là bắt buộc']"
                    @update:search="(v) => onSearchUpdate(v, 'category')"
                  ></v-combobox>

                  <v-btn
                    v-if="store.showAddButton.category"
                    class="add-btn"
                    color="warning"
                    variant="text"
                    density="comfortable"
                    @click="() => addNewItem('category')"
                  >
                    Thêm mới "{{ store.searchTexts.category }}"
                  </v-btn>
                </div>
              </v-col>

              <v-col cols="12" md="6">
                <div class="position-relative">
                  <v-combobox
                    v-model="store.product.brand"
                    :items="store.brands"
                    label="Thương hiệu"
                    item-title="ten"
                    item-value="id"
                    required
                    variant="outlined"
                    density="comfortable"
                    :rules="[(v) => !!v || 'Thương hiệu là bắt buộc']"
                    @update:search="(v) => onSearchUpdate(v, 'brand')"
                  ></v-combobox>

                  <v-btn
                    v-if="store.showAddButton.brand"
                    class="add-btn"
                    color="warning"
                    variant="text"
                    density="comfortable"
                    @click="() => addNewItem('brand')"
                  >
                    Thêm mới "{{ store.searchTexts.brand }}"
                  </v-btn>
                </div>
              </v-col>

              <v-col cols="12">
                <v-textarea
                  v-model="store.product.description"
                  label="Mô tả sản phẩm"
                  rows="3"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-form>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" variant="text" @click="close()">Hủy</v-btn>
        <v-btn
          color="success"
          variant="text"
          @click="saveProduct()"
          :disabled="!valid"
        >
          Lưu
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <dialog_khoanh :modal="modalKhoAnh"></dialog_khoanh>
</template>

<script setup>
import { useQLSPStore } from '@/store/quanLySanPhamStore'
import { ref, onMounted, watch } from 'vue'
import { useToast } from 'vue-toastification'
import useEmitter from '@/useEmitter'
import dialog_khoanh from './dialog_khoanh.vue'
import { useDanhSachSP } from '@/store/danhSachSanPhamStore'
const useDanhSachSPStore = useDanhSachSP()
const store = useQLSPStore()
const emitter = useEmitter()
const toast = useToast()
const dialog = ref(false)
const valid = ref(false)
const modalKhoAnh = ref(false)

const props = defineProps({
  modal: Boolean
})

watch(() => props.modal, newVal => {
  dialog.value = newVal
})

const handleAddImage = () => {
  modalKhoAnh.value = true
}

const onSearchUpdate = (text, field) => {
  store.searchTexts[field] = text
}

const addNewItem = async (field) => {
  const result = await store.addNewItem(field)
  if (result?.status === 200) {
    toast.success(`Thêm ${field === 'category' ? 'giới tính' : 'thương hiệu'} mới thành công`)
  }
}

const saveProduct = async () => {
  try{
      const result = await store.saveProduct()
  if (result.status === 200) {
    dialog.value = false
    emitter.emit('closeModalThemSanPham', false)
    await useDanhSachSPStore.fetchProducts()
    toast.success('Thêm sản phẩm thành công')
  }
  }catch(e){
    toast.error(e.response.data.message)
  }

}

const close = () => {
  dialog.value = false
  emitter.emit('closeModalThemSanPham', false)
}

onMounted(async () => {
  emitter.on('closeModalKhoAnh', (value) => {
    modalKhoAnh.value = value
  })
  await store.fetchInitialData()
})
</script>

<style scoped>
.suggestion-item:hover {
  background-color: #f5f5f5;
}
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
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.suggestion-item {
  padding: 8px 16px;
  cursor: pointer;
}
</style>
