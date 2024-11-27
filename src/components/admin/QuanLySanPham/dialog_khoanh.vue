<template>
  <v-dialog v-model="dialog" max-width="1300px">
    <v-card>
      <v-card-title class="text-h6 pa-4"> Kho ảnh </v-card-title>
      <v-card-text>
        <v-container>
          <!-- Danh sách ảnh đã chọn -->
          <h3 class="mb-4">Danh sách ảnh đã chọn</h3>
          <v-row v-if="selectedImages.length">
            <v-col
              cols="12"
              sm="3"
              md="2"
              v-for="(image, index) in selectedImages"
              :key="index"
            >
              <v-card class="selected-image-card">
                <v-img :src="image.url" height="150" cover>
                  <template v-slot:placeholder>
                    <v-row
                      class="fill-height ma-0"
                      align="center"
                      justify="center"
                    >
                      <v-progress-circular indeterminate></v-progress-circular>
                    </v-row>
                  </template>
                </v-img>
                <v-btn
                  icon="mdi-close"
                  size="small"
                  color="error"
                  class="remove-btn"
                  @click="removeSelectedImage(index)"
                ></v-btn>
              </v-card>
            </v-col>
          </v-row>

          <!-- Danh sách ảnh mẫu -->
          <div class="d-flex justify-space-between align-center mt-6 mb-4">
            <h3>Danh sách ảnh mẫu</h3>
            <v-btn
              color="primary"
              prepend-icon="mdi-plus"
              @click="openFileInput"
            >
              THÊM ẢNH
            </v-btn>
          </div>

          <v-row>
            <v-col
              v-for="(image, index) in sampleImages"
              :key="index"
              cols="12"
              sm="4"
              md="2"
            >
              <v-card
                class="sample-image-card"
                :class="{ selected: isSelected(image) }"
                @click="toggleImageSelection(image)"
              >
                <v-img :src="image.url" height="150" cover>
                  <template v-slot:placeholder>
                    <v-row
                      class="fill-height ma-0"
                      align="center"
                      justify="center"
                    >
                      <v-progress-circular indeterminate></v-progress-circular>
                    </v-row>
                  </template>
                </v-img>
                <v-checkbox
                  v-model="image.selected"
                  class="selection-checkbox"
                  color="primary"
                  hide-details
                ></v-checkbox>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" variant="text" @click="close()">Hủy</v-btn>
        <v-btn color="success" variant="text" @click="saveImage()"> Lưu </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import useEmitter from "@/useEmitter";
import { useCTSPStore } from "@/store/quanLyChiTietSanPhamStore";
import { useToast } from "vue-toastification";
const toast = useToast();
const storeCTSP = useCTSPStore();
const emitter = useEmitter();
const imageList = ref([]);
const fileInput = ref(null);
const selectedImages = ref([]);
const sampleImages = ref([]);
onMounted(() => {
  loadSampleImages();
});
const saveSampleImages = () => {
  localStorage.setItem("sampleImages", JSON.stringify(sampleImages.value));
};

// Thêm hàm lấy sampleImages từ localStorage
const loadSampleImages = () => {
  const savedImages = localStorage.getItem("sampleImages");
  if (savedImages) {
    sampleImages.value = JSON.parse(savedImages);
  }
};
const widget = window.cloudinary.createUploadWidget(
  {
    cloudName: "donjej4tg",
    uploadPreset: "upload-datn",
    showAdvancedOptions: true,
    sources: ["local", "url"],
    multiple: true,
    clientAllowedFormats: ["image"],
  },
  (error, result) => {
    if (!error && result && result.event === "success") {
      sampleImages.value.push({ url: result.info.url, selected: false });
      saveSampleImages();
    }
  }
);

const dialog = ref(false);
const valid = ref(false);

// Form data local state

const props = defineProps({
  modal: Boolean,
});

watch(
  () => props.modal,
  async (newVal) => {
    dialog.value = newVal;
  }
);

const close = () => {
  dialog.value = false;
  emitter.emit("closeModalKhoAnh", false);
};

const openFileInput = () => {
  widget.open();
};

const isSelected = (image) => {
  return image.selected;
};

const toggleImageSelection = (image) => {
  image.selected = !image.selected;
  if (image.selected) {
    selectedImages.value.push(image);
  } else {
    const index = selectedImages.value.findIndex(
      (img) => img.url === image.url
    );
    if (index !== -1) {
      selectedImages.value.splice(index, 1);
    }
  }
};

const removeSelectedImage = (index) => {
  const removedImage = selectedImages.value[index];
  selectedImages.value.splice(index, 1);

  // Unselect from sample images
  const sampleIndex = sampleImages.value.findIndex(
    (img) => img.url === removedImage.url
  );
  if (sampleIndex !== -1) {
    sampleImages.value[sampleIndex].selected = false;
  }
};
const saveImage = () => {
  storeCTSP.listHinhAnh = selectedImages.value;
  toast.success("Chọn hình ảnh thành công");
  dialog.value = false;
  emitter.emit("closeModalKhoAnh", false);
};
// const closeDialog = () => {
//   emit('close');
// };
</script>

<style scoped>
.selected-image-card {
  position: relative;
}

.remove-btn {
  position: absolute;
  top: -10px;
  right: -10px;
}

.sample-image-card {
  position: relative;
  cursor: pointer;
  border: 2px solid transparent;
}

.sample-image-card.selected {
  border-color: #1976d2;
}

.selection-checkbox {
  position: absolute;
  top: 5px;
  right: 5px;
}
</style>
