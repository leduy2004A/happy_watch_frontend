<template>
  <div class="auth-container">
    <div class="auth-box">
      <div class="auth-header">
        <img src="" alt="Logo" class="logo" />
        <h2>{{ isLogin ? "Đăng nhập" : "Đăng ký" }}</h2>
      </div>

      <div class="auth-form">
        <form @submit.prevent="handleSubmit">
          <!-- Form đăng ký -->
          <div v-if="!isLogin" class="p-field">
            <label for="fullname">Họ và tên</label>
            <InputText
              id="fullname"
              v-model="form.fullname"
              placeholder="Nhập họ tên của bạn"
            />
          </div>

          <div class="p-field">
            <label for="username">Username</label>
            <InputText
              id="username"
              v-model="form.username"
              placeholder="username"
            />
          </div>
          <div class="p-field" v-if="!isLogin">
            <label for="gender">Giới tính</label>
            <Dropdown
              id="gender"
              v-model="form.gioiTinh"
              :options="genderOptions"
              class="w-full"
            />
          </div>
          <div class="p-field">
            <label for="password">Mật khẩu</label>
            <Password
              id="password"
              v-model="form.password"
              :feedback="!isLogin"
              :toggleMask="true"
              placeholder="Nhập mật khẩu"
            />
          </div>
          <div class="p-field" v-if="!isLogin">
            <label for="password">Xác nhận mật khẩu</label>
            <Password
              id="password"
              v-model="form.confirm_password"
              :feedback="!isLogin"
              :toggleMask="true"
              placeholder="Nhập mật khẩu"
            />
          </div>
          <Button
            :label="isLogin ? 'Đăng nhập' : 'Đăng ký'"
            class="submit-btn"
            type="submit"
            @click="dangNhapDangKi()"
          />

          <div class="auth-footer">
            <p v-if="isLogin">
              Chưa có tài khoản?
              <a href="#" @click.prevent="isLogin = false">Đăng ký ngay</a>
            </p>
            <p v-else>
              Đã có tài khoản?
              <a href="#" @click.prevent="isLogin = true">Đăng nhập</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { dangNhap, layThongTinNguoiDung } from "@/axios/dangNhapDangKi";
import { dangKi } from "@/axios/dangNhapDangKi";
import { useRouter } from "vue-router";
const router = useRouter();
import { useToast } from "vue-toastification";
const toast = useToast();
const isLogin = ref(true);
const form = reactive({
  fullname: "",
  email: "",
  password: "",
  confirm_password: "",
  username: "",
  gioiTinh:"Nam"
});

const handleSubmit = async () => {
  console.log("Form submitted:", form);

  if (isLogin.value) {
    const dataLogin = {
      username: form.username,
      password: form.password,
    };

    try {
      const result = await dangNhap(dataLogin);
      if (result.status === 200) {
        // Lưu token vào localStorage
        localStorage.setItem("token", result.data.access_token);

        try {
          const resultUser = await layThongTinNguoiDung();
          if (resultUser.status === 200) {
            localStorage.setItem("user", JSON.stringify(resultUser.data));
            toast.success("Đăng nhập thành công");

            // Lấy vai trò từ thông tin người dùng
            const userRole = resultUser.data.vaiTro.tenVaiTro; // hoặc path phù hợp với API của bạn

            // Điều hướng dựa trên vai trò
            switch (userRole) {
              case "Admin":
                router.push("/admin/sell");
                break;
              case "Khách hàng":
                router.push("/product/");
                break;
              default:
                router.push("/product/");
                break;
            }
          }
        } catch (e) {
          toast.error("Lấy thông tin người dùng thất bại");
        }
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  } else {
    const dataRegister = {
      username: form.username,
      password: form.password,
      ten: form.fullname,

      email: "leduy4520@gmail.com",

      confirm_password: form.confirm_password,
      gioiTinh: form.gioiTinh,
    };
    try {
      const result = await dangKi(dataRegister);
      if (result.status === 200) {
        // Lưu token vào localStorage
        localStorage.setItem("token", result.data.access_token);

        try {
          const resultUser = await layThongTinNguoiDung();
          if (resultUser.status === 200) {
            localStorage.setItem("user", JSON.stringify(resultUser.data));
            toast.success("Đăng kí thành công");

            // Lấy vai trò từ thông tin người dùng
            const userRole = resultUser.data.vaiTro.tenVaiTro; // hoặc path phù hợp với API của bạn

            // Điều hướng dựa trên vai trò
            switch (userRole) {
              case "Admin":
                router.push("/admin/sell");
                break;
              case "Khách hàng":
                router.push("/product/");
                break;
              default:
                router.push("/product/");
                break;
            }
          }
        } catch (e) {
          toast.error("Lấy thông tin người dùng thất bại");
        }
      }
    } catch (error) {
      console.error("Đăng nhập thất bại:", error);
      toast.error( error.response.data.message);
    }
  }
};

const genderOptions = ["Nam", "Nữ"];
</script>
<style scoped>
/* Container chính */
.auth-container {
  display: flex;
  min-height: 100vh;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  justify-content: center;
  align-items: center;
  padding: 1rem;
}

/* Hộp chứa form */
.auth-box {
  width: 100%;
  max-width: 500px;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 1rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

/* Header */
.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.logo {
  width: 120px;
  margin-bottom: 1rem;
}

.auth-header h2 {
  color: #1e3c72;
  font-size: 2rem;
  margin: 0;
}

/* Form */
.p-field {
  margin-bottom: 1.5rem;
}

.p-field label {
  display: block;
  margin-bottom: 0.5rem;
  color: #495057;
  font-weight: 500;
}

.p-inputtext,
.p-password input {
  width: 100%;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  box-sizing: border-box;
}

.p-password input {
  width: 100%;
}

/* Button */
.submit-btn {
  width: 100%;
  background-color: #1e3c72;
  color: white;
  border: none;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  font-weight: bold;
  text-align: center;
  border-radius: 0.5rem;
  cursor: pointer;
}

.submit-btn:hover {
  background-color: #2a5298;
}

/* Footer */
.auth-footer {
  text-align: center;
  margin-top: 1.5rem;
}

.auth-footer a {
  color: #2a5298;
  text-decoration: none;
  font-weight: 600;
}

.auth-footer a:hover {
  text-decoration: underline;
}

/* Responsive */
@media (max-width: 480px) {
  .auth-box {
    padding: 1.5rem;
  }
}
</style>
