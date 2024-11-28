<template>
  <v-dialog v-model="dialog" max-width="1300px">
    <v-card>
      <v-card-title class="text-h6 pa-4"> Thêm sản phẩm </v-card-title>
      <v-card-text>
        <v-container>
          <h2 class="text-center mb-6">Thêm sản phẩm</h2>

          <v-form ref="form" v-model="valid">
            <v-row>

              <v-col cols="12" md="6">
                <div class="position-relative">
                  <v-text-field
                v-model="store.product.ma"
                label="Mã"
                required
                variant="outlined"
                class="mb-4"
                density="comfortable"
                :rules="[(v) => !!v || 'Tên là bắt buộc']"
                @input="store.filterSuggestions"
              ></v-text-field>
                </div>
              </v-col>


              <v-col cols="12" md="6">
                <div class="position-relative">
                  <v-text-field
                v-model="store.product.kichThuoc"
                label="Kích Thước"
                required
                variant="outlined"
                class="mb-4"
                density="comfortable"
                :rules="[(v) => !!v || 'Kích thước là bắt buộc']"
                @input="store.filterSuggestions"
              ></v-text-field>
                </div>
              </v-col>

              <v-col cols="12" md="6">
                <div class="position-relative">
                  <v-text-field
                v-model="store.product.chongNuoc"
                label="Chống Nước"
                required
                variant="outlined"
                class="mb-4"
                density="comfortable"
                :rules="[(v) => !!v || 'Chống nước là bắt buộc']"
                @input="store.filterSuggestions"
              ></v-text-field>
                </div>
              </v-col>

              <v-col cols="12" md="6">
                <div class="position-relative">
                  <v-text-field
                v-model="store.product.xuatXu"
                label="Xuất Xứ"
                required
                variant="outlined"
                class="mb-4"
                density="comfortable"
                :rules="[(v) => !!v || 'Xuất xứ là bắt buộc']"
                @input="store.filterSuggestions"
              ></v-text-field>
                </div>
              </v-col>

              <v-col cols="12" md="6">
                <div class="position-relative">
                  <v-text-field
                v-model="store.product.gia"
                label="Giá"
                required
                variant="outlined"
                class="mb-4"
                density="comfortable"
                :rules="[(v) => !!v || 'Giá là bắt buộc']"
                @input="store.filterSuggestions"
              ></v-text-field>
                </div>
              </v-col>

              <v-col cols="12" md="6">
                <div class="position-relative">
                  <v-text-field
                v-model="store.product.soLuong"
                label="Số lượng"
                required
                variant="outlined"
                class="mb-4"
                density="comfortable"
                type="number"
                :rules="[(v) => !!v || 'Số lượng là bắt buộc']"
                @input="store.filterSuggestions"
              ></v-text-field>
                </div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="position-relative">
                  <v-text-field
                v-model="store.product.canNang"
                label="Cân nặng"
                required
                variant="outlined"
                class="mb-4"
                density="comfortable"
                type="number"
                :rules="[(v) => !!v || 'Cân nặng là bắt buộc']"
                @input="store.filterSuggestions"
              ></v-text-field>
                </div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="position-relative">
                  <v-combobox
                    v-model="store.product.mauSac"
                    :items="store.mauSac"
                    item-title="ten"
                    item-value="id"
                    label="Màu sắc"
                    required
                    variant="outlined"
                    density="comfortable"
                    :rules="[(v) => !!v || 'Màu sắc là bắt buộc']"
                    @update:search="(v) => onSearchUpdate(v, 'mauSac')"
                  ></v-combobox>

                  <v-btn
                    v-if="store.showAddButton.mauSac"
                    class="add-btn"
                    color="warning"
                    variant="text"
                    density="comfortable"
                    @click="() => addNewItem('mauSac')"
                  >
                    Thêm mới "{{ store.searchTexts.mauSac }}"
                  </v-btn>
                </div>
              </v-col>

              <v-col cols="12" md="6">
                <div class="position-relative">
                  <v-combobox
                    v-model="store.product.hinhDang"
                    :items="store.hinhDang"
                    label="Hình dáng"
                    item-title="ten"
                    item-value="id"
                    required
                    variant="outlined"
                    density="comfortable"
                    :rules="[(v) => !!v || 'Hình dáng là bắt buộc']"
                    @update:search="(v) => onSearchUpdate(v, 'hinhDang')"
                  ></v-combobox>

                  <v-btn
                    v-if="store.showAddButton.hinhDang"
                    class="add-btn"
                    color="warning"
                    variant="text"
                    density="comfortable"
                    @click="() => addNewItem('hinhDang')"
                  >
                    Thêm mới "{{ store.searchTexts.hinhDang }}"
                  </v-btn>
                </div>
              </v-col>

              <v-col cols="12" md="6">
                <div class="position-relative">
                  <v-combobox
                    v-model="store.product.loaiMay"
                    :items="store.loaiMay"
                    item-title="ten"
                    item-value="id"
                    label="Loại máy"
                    required
                    variant="outlined"
                    density="comfortable"
                    :rules="[(v) => !!v || 'Loại máy là bắt buộc']"
                    @update:search="(v) => onSearchUpdate(v, 'loaiMay')"
                  ></v-combobox>

                  <v-btn
                    v-if="store.showAddButton.loaiMay"
                    class="add-btn"
                    color="warning"
                    variant="text"
                    density="comfortable"
                    @click="() => addNewItem('loaiMay')"
                  >
                    Thêm mới "{{ store.searchTexts.loaiMay }}"
                  </v-btn>
                </div>
              </v-col>

              <v-col cols="12" md="6">
                <div class="position-relative">
                  <v-combobox
                    v-model="store.product.chatLieuVo"
                    :items="store.chatLieuVo"
                    label="Chất liệu vỏ"
                    item-title="ten"
                    item-value="id"
                    required
                    variant="outlined"
                    density="comfortable"
                    :rules="[(v) => !!v || 'Thương hiệu là bắt buộc']"
                    @update:search="(v) => onSearchUpdate(v, 'chatLieuVo')"
                  ></v-combobox>

                  <v-btn
                    v-if="store.showAddButton.chatLieuVo"
                    class="add-btn"
                    color="warning"
                    variant="text"
                    density="comfortable"
                    @click="() => addNewItem('chatLieuVo')"
                  >
                    Thêm mới "{{ store.searchTexts.chatLieuVo }}"
                  </v-btn>
                </div>
              </v-col>


              <v-col cols="12" md="6">
                <div class="position-relative">
                  <v-combobox
                    v-model="store.product.chatLieuDay"
                    :items="store.chatLieuDay"
                    item-title="ten"
                    item-value="id"
                    label="Chất liệu dây"
                    required
                    variant="outlined"
                    density="comfortable"
                    :rules="[(v) => !!v || 'Chất liệu dây là bắt buộc']"
                    @update:search="(v) => onSearchUpdate(v, 'chatLieuDay')"
                  ></v-combobox>

                  <v-btn
                    v-if="store.showAddButton.chatLieuDay"
                    class="add-btn"
                    color="warning"
                    variant="text"
                    density="comfortable"
                    @click="() => addNewItem('chatLieuDay')"
                  >
                    Thêm mới "{{ store.searchTexts.chatLieuDay }}"
                  </v-btn>
                </div>
              </v-col>

              <v-col cols="12" md="6">
                <div class="position-relative">
                  <v-combobox
                    v-model="store.product.loaiKinh"
                    :items="store.loaiKinh"
                    label="Loại kính"
                    item-title="ten"
                    item-value="id"
                    required
                    variant="outlined"
                    density="comfortable"
                    :rules="[(v) => !!v || 'Loại kính là bắt buộc']"
                    @update:search="(v) => onSearchUpdate(v, 'loaiKinh')"
                  ></v-combobox>

                  <v-btn
                    v-if="store.showAddButton.loaiKinh"
                    class="add-btn"
                    color="warning"
                    variant="text"
                    density="comfortable"
                    @click="() => addNewItem('loaiKinh')"
                  >
                    Thêm mới "{{ store.searchTexts.loaiKinh }}"
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

              <v-col cols="12">
          <div class="d-flex align-center gap-4">
            <!-- <v-sheet width="100" height="100" class="d-flex align-center justify-center">
              <v-icon size="40">mdi-qr-code</v-icon>
            </v-sheet> -->
            
            <template v-for="n in store.listHinhAnh" :key="n">
              <v-sheet
                width="100"
                height="100"
                class="d-flex align-center justify-center border rounded mr-2"
              >
                <v-img
                  :src="n.url"
                  cover
                  height="100%"
                ></v-img>
              </v-sheet>
            </template>

            <v-sheet
              width="100"
              height="100"
              class="d-flex align-center justify-center border rounded cursor-pointer"
              @click="handleAddImage"
            >
              <v-icon size="40">mdi-plus</v-icon>
            </v-sheet>
          </div>
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
import { useCTSPStore } from '@/store/quanLyChiTietSanPhamStore'
import { ref, onMounted, watch } from 'vue'
import { useToast } from 'vue-toastification'
import useEmitter from '@/useEmitter'
import { useRoute } from 'vue-router'
const route = useRoute()
import dialog_khoanh from './dialog_khoanh.vue'

import { quanLyCTSPMAIN } from '@/store/quanLyCTSPMain'
const useQuanLyCTSPMAIN = quanLyCTSPMAIN()

const store = useCTSPStore()
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
  const result = await store.saveProduct(route.params.id)
  console.log(result)
  if (result.status === 200) {
    dialog.value = false
    emitter.emit('closeModalThemSanPham', false)
    await useQuanLyCTSPMAIN.fetchProducts(route.params.id)
    toast.success('Thêm sản phẩm thành công')
  }
}

const close = () => {
  dialog.value = false
  emitter.emit('closeModalThemSanPham', false)
}

onMounted(async () => {
  emitter.on('closeModalKhoAnh', (value) => {
    console.log("okk")
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
