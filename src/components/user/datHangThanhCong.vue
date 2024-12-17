<template>
  <v-container>
      <div class="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 flex items-center justify-center p-4 px-10">
    <div class="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md transform transition-all" 
         :class="{ 'translate-y-0 opacity-100': show, 'translate-y-4 opacity-0': !show }">
      <!-- Animated Success Icon -->
      <div class="success-animation-container mb-6">
        <!-- Animated Background Circles -->
        <div class="success-ring"></div>
        <div class="success-ring ring2"></div>
        <div class="success-ring ring3"></div>
        
        <!-- Bouncing Check Icon -->
        <div class="check-container">
          <v-icon color="white" size="40" class="bouncing-check">mdi-check</v-icon>
        </div>
      </div>

      <!-- Content -->
      <h1 class="text-2xl font-weight-bold text-gray-800 text-center mb-4 sliding-text">
        Đặt hàng thành công!
      </h1>
      
      <p class="text-gray-600 text-center mb-6 fade-in-text">
        Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ xử lý đơn hàng của bạn trong thời gian sớm nhất.
      </p>

      <!-- Order Number -->
      <div class="bg-gray-50 rounded-lg p-4 mb-6 pulse-animation">
        <p class="text-center text-gray-700">
          Mã đơn hàng: <span class="font-weight-medium">#{{ route.params.ma }}</span>
        </p>
      </div>

      <!-- Actions -->
      <div class="flex flex-col gap-3 slide-up">
        <v-btn
          block
          x-large
          color="success"
          elevation="2"
          @click="continueShopping"
          class="text-white hover-scale"
        >
          Tiếp tục mua sắm
        </v-btn>
      </div>
    </div>
  </div>
  </v-container>

</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useToast } from 'vue-toastification';
import { thanhToanHoaDon } from '@/axios/hoadon';
import { thanhToanMuaNgayV2 } from '@/axios/thanhtoan';
const show = ref(false);
const toast = useToast();
const router = useRouter();
const route = useRoute();

onMounted(async () => {
  setTimeout(() => {
    show.value = true;
  }, 100);

  console.log(route.query);
  if (route.query.code === "00" && route.query.status === "PAID") {
    const dataPayment = {
      maHoaDon: route.params.ma,
      soTien: route.query.soTien,
      phuongThuc: 'Chuyển khoản'
    };
    console.log(dataPayment);
    try {
      const resultPayment = await thanhToanMuaNgayV2(dataPayment);
      if (resultPayment.status == 200) {
        localStorage.setItem("cart-items", JSON.stringify([]));
        toast.success("Thanh toán thành công");
      }
    } catch (error) {
      console.log(error);
      const errorMessage = error.response?.data || "Có lỗi xảy ra khi thanh toán";
      toast.error(errorMessage);
    }
  }
});

function continueShopping() {
  router.push('/product/cua-hang');
}
</script>

<style scoped>
/* Success Animation Container */
.success-animation-container {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto;
}

/* Animated Rings */
.success-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 4px solid #4CAF50;
  animation: ring-pulse 2s ease-out infinite;
}

.ring2 {
  animation-delay: 0.3s;
}

.ring3 {
  animation-delay: 0.6s;
}

/* Check Icon Container */
.check-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  background: #4CAF50;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: bounce 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

.bouncing-check {
  animation: pop 0.5s ease-out 0.4s both;
}

/* Text Animations */
.sliding-text {
  animation: slideDown 0.6s ease-out forwards;
  opacity: 0;
}

.fade-in-text {
  animation: fadeIn 0.8s ease-out 0.3s forwards;
  opacity: 0;
}

.slide-up {
  animation: slideUp 0.6s ease-out 0.6s forwards;
  opacity: 0;
}

/* Pulse Animation for Order Number */
.pulse-animation {
  animation: pulse 2s infinite;
}

/* Hover Effect for Button */
.hover-scale {
  transition: transform 0.2s ease;
}

.hover-scale:hover {
  transform: scale(1.02);
}

/* Keyframes */
@keyframes ring-pulse {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(1.3);
    opacity: 0;
  }
}

@keyframes bounce {
  0% {
    transform: translate(-50%, -50%) scale(0);
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
  }
}

@keyframes pop {
  0% {
    transform: scale(0);
  }
  90% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes slideDown {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
  100% {
    transform: scale(1);
  }
}

/* Customize Vuetify button */
:deep(.v-btn) {
  text-transform: none;
  font-weight: 500;
  height: 48px !important;
  border-radius: 8px;
}
</style>