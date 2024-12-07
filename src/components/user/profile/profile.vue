<template>
  <v-container class="profile-container pa-6">
    <v-card class="profile-card">
      <v-card-text>
        <v-row align="center">
          <!-- Avatar Section -->
          <v-col cols="12" md="3" class="text-center">
            <div class="avatar-wrapper">
              <Avatar
                :image="image || employee.avatar"
                class="profile-avatar"
                size="xlarge"
                shape="circle"
                v-model="employee.avatar"
                
              />
              <div class="avatar-overlay" @click="themAnh()">
                <v-icon>mdi-camera</v-icon>
              </div>
            </div>
            <p class="mt-2 text-caption text-grey">Nhấp để thay đổi ảnh</p>
          </v-col>

          <!-- Form Section -->
          <v-col cols="12" md="9">
            <v-row>
              <v-col cols="12">
                <h2 class="text-h5 mb-6">Thông tin cá nhân</h2>
              </v-col>
              
              <v-col cols="12" md="6">
                <div class="form-group">
                  <label for="fullName" class="form-label">Họ và tên</label>
                  <InputText 
                    id="fullName" 
                    v-model="employee.ten" 
                    class="w-full form-input"
                    placeholder="Nhập họ và tên"
                  />
                </div>
              </v-col>

              <v-col cols="12" md="6">
                <div class="form-group">
                  <label for="email" class="form-label">Email</label>
                  <InputText
                    id="email"
                    v-model="employee.email"
                    type="email"
                    class="w-full form-input"
                    placeholder="Nhập email"
                  />
                </div>
              </v-col>

              <v-col cols="12" md="6">
                <div class="form-group">
                  <label for="phone" class="form-label">Số điện thoại</label>
                  <InputText 
                    id="phone" 
                    v-model="employee.dienThoai" 
                    class="w-full form-input"
                    placeholder="Nhập số điện thoại"
                  />
                </div>
              </v-col>

              <v-col cols="12" md="6">
                <div class="form-group">
                  <label for="gender" class="form-label">Giới tính</label>
                  <Dropdown
                    id="gender"
                    v-model="employee.gioiTinh"
                    :options="genderOptions"
                    class="w-full form-input"
                    placeholder="Chọn giới tính"
                  />
                </div>
              </v-col>

              <v-col cols="12" class="text-right mt-4">
                <v-btn
                  color="warning"
                  @click="updateNguoiDung()"
                  class="save-button text-white"
                  elevation="2"
                >
                  <v-icon left>mdi-content-save</v-icon>
                  Lưu thay đổi
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { updateKhachHang } from "@/axios/sanpham";
import { useToast } from "vue-toastification";
import Sweetalert2 from "sweetalert2";
const toast = useToast();
import { update } from "lodash-es";
const genderOptions = ["Nam", "Nữ"];
const employee = ref({});
const employees = ref([]);
const imageUser = ref("")
const widget = window.cloudinary.createUploadWidget(
  {
    cloudName: "donjej4tg",
    uploadPreset: "upload-datn",
    showAdvancedOptions: true,
    sources: ["local", "url"],
    multiple: false,
    clientAllowedFormats: ["image"],
  },
  (error, result) => {
    if (!error && result && result.event === "success") {
      employee.value.avatar = result.info.url

    }
  }
);
onMounted(() => {
  const data = JSON.parse(localStorage.getItem("user"));
  console.log(data);
  employee.value.avatar = data.avatar;
  employee.value.ten = data.ten;
  employee.value.email = data.email;
  employee.value.dienThoai = data.dienThoai;
  employee.value.gioiTinh = data.gioiTinh;
  employee.value.id = data.id;
});
const updateNguoiDung = async () => {
  Sweetalert2.fire({
    title: "Bạn có muốn thay đổi thông tin không ?",
    showCancelButton: true,
    confirmButtonText: "Có",
  }).then(async (result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
    const data = {
      // ma: "ND02",
      id: employee.value.id,
      ten: employee.value.ten,
      dienThoai: employee.value.dienThoai,
      gioiTinh: employee.value.gioiTinh,

      email: employee.value.email,
      avatar: employee.value.avatar,
    };
    try {
      const resultUpdate = await updateKhachHang(data);
      if (resultUpdate.status === 200) {
        toast.success("Đã update thành công");
        localStorage.setItem("user", JSON.stringify(data));
      }
    } catch (e) {
      toast.error("Có lỗi xảy ra");
    }}
  });
};

const themAnh = ()=>{
  widget.open()
}
</script>
<style scoped>
.profile-container {
  max-width: 1200px;
  margin: 0 auto;
}

.profile-card {
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1) !important;
}

.avatar-wrapper {
  position: relative;
  display: inline-block;
  cursor: pointer;
}

.profile-avatar {
  border: 4px solid #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.avatar-wrapper:hover .avatar-overlay {
  opacity: 1;
}

.avatar-overlay i {
  color: white;
  font-size: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.6);
}

.form-input {
  border-radius: 8px !important;
  transition: all 0.3s ease;
}

.form-input:focus {
  box-shadow: 0 0 0 2px rgba(var(--v-theme-warning), 0.2);
}

.save-button {
  padding: 0 24px;
  height: 44px;
  font-weight: 500;
  text-transform: none;
  letter-spacing: 0.5px;
}

/* Responsive adjustments */
@media (max-width: 960px) {
  .profile-container {
    padding: 16px;
  }
  
  .avatar-wrapper {
    margin-bottom: 24px;
  }
}
</style>