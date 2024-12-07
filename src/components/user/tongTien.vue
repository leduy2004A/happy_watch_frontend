<template>
  <v-card max-width="500" class="mx-auto">
    <v-card-text>
      <!-- Product Item -->
      <v-row no-gutters align="center" class="mb-4" v-for="product in checkoutStore.products">
        <v-col cols="auto" class="mr-4 position-relative">
          <v-img
            :src="product.productGoc.image"
            width="80"
            height="80"
            cover
            class="bg-grey-lighten-2 rounded"
          >
            <template v-slot:placeholder>
              <v-row
                class="fill-height ma-0"
                align="center"
                justify="center"
              >
                <v-progress-circular
                  indeterminate
                  color="grey-lighten-5"
                ></v-progress-circular>
              </v-row>
            </template>
          </v-img>
          <!-- Quantity Badge -->
          <v-badge
            :content="product.soLuongChon"
            color="orange"
            class="quantity-badge"
          ></v-badge>
        </v-col>
        <v-col>
          <div class="text-subtitle-1">{{ product.productGoc.name }}</div>
          <v-chip
            color="orange"
            text-color="white"
            size="small"
            class="mt-1"
          >
            size: {{ product.productGoc.size }}
          </v-chip>
          <div class="text-red font-weight-medium mt-1">
            {{ formatPrice(product.productGoc.price) }} đ
          </div>
        </v-col>
      </v-row>

      <!-- Coupon Input -->
      <v-row no-gutters class="mb-4">
        <v-col>
          <v-text-field
            v-model="checkoutStore.countCode"
            label="Phiếu giảm giá"
            variant="outlined"
            density="compact"
            hide-details
            class="rounded-e-0 mb-2"
            disabled
          >
           
          </v-text-field>
         
              <v-btn
                color="black"
                class="rounded"
                height="44"
                @click="chonMaGiamGia()"
              >
                CHỌN
              </v-btn>
         
        </v-col>
      </v-row>

      <!-- Order Details -->
      <v-list>
        <v-list-item>
          <template v-slot:title>
            <div class="d-flex justify-space-between">
              <span class="text-body-1">Phí vận chuyển</span>
              <span class="text-red">{{formatPrice(checkoutStore.shippingFee)  }} đ</span>
            </div>
          </template>
        </v-list-item>

        <v-list-item>
          <template v-slot:title>
            <div class="d-flex justify-space-between">
              <span class="text-body-1">Giảm giá</span>
              <span>{{ formatPrice(checkoutStore.discount)  }} đ</span>
            </div>
          </template>
        </v-list-item>

        <v-list-item>
          <template v-slot:title>
            <div class="d-flex justify-space-between">
              <span class="text-body-1">Tổng Tiền Hàng:</span>
              <span class="text-red">{{formatPrice( checkoutStore.tinhTongTienHang()) }} đ</span>
            </div>
          </template>
        </v-list-item>
      </v-list>

      <!-- Total -->
      <v-divider class="my-4"></v-divider>
      <div class="d-flex justify-space-between align-center">
        <span class="text-h6">Tổng số tiền</span>
        <span class="text-h6 font-weight-bold text-red">
          {{ formatPrice(checkoutStore.tinhTongTien()) }} đ
        </span>
      </div>
    </v-card-text>
    <dialog-ma-giam-gia :modalMGG="modal"></dialog-ma-giam-gia>
  </v-card>
  
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import useEmitter from '@/useEmitter';
import { layChiTietSanPhamTuIdCTSP } from '@/axios/sanpham';
const emitter = useEmitter()
import { useOrderStore } from '@/store/tienStore';
import dialogMaGiamGia from './dialogMaGiamGia.vue';
const store = useOrderStore()
import { useCheckOutStore } from '@/store/checkOutStore';
const checkoutStore = useCheckOutStore()
// Khai báo các biến trạng thái
const couponCode = ref('');
const modal = ref(false)
const product = reactive({
  name: 'Balen Grey 2023 Bạc Đế nhựa',
  size: 42,
  price: 104500,
  shippingFee: 34000,
  discount: 0,
  expectedDeliveryDate: '23-12-2023',
  image: 'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
  quantity: 1
});

// Định nghĩa hàm formatPrice
const formatPrice = (price) => {
  return price.toLocaleString('vi-VN');
};

const chonMaGiamGia = ()=>{
  modal.value = true
}
// Định nghĩa hàm calculateTotal
const calculateTotal = () => {
  return product.price + product.shippingFee - product.discount;
};
const checkOutCart = async () => {
  const data = JSON.parse(localStorage.getItem("check-out")); 

  const result = await Promise.all(
    data.map(async (item) => {
      const response = await layChiTietSanPhamTuIdCTSP(item.id);
      const canNangGoc = response.data.canNang;
      return {
        // {{ product.name }} – {{ product.gioiTinh }} – {{ product.loaiKinh }} – {{ product.chatLieuVo }} – {{ product.loaiMay }} – {{ product.chatLieuDay }}
        id: response.data.id,
        name: response.data.ten + '-'+response.data.gioiTinh + '-'+response.data.loaiKinh + '-'+ response.data.chatLieuVo + '-'+response.data.loaiMay +'-'+response.data.chatLieuDay,
        price: response.data.giaSauGiam,
        image: response.data.hinhAnhDauTien,
        canNangGoc: canNangGoc,
        canNang: canNangGoc,
        code: item.ma,
        quantity: item.quantity,
      };
    })
  );
  
  localStorage.setItem("check-out", JSON.stringify(result));
  
  const dataPickList = result.map(product => ({
    productGoc: product,
    soLuongChon: product.quantity,
    tongCanNang: product.quantity * product.canNangGoc  // Sử dụng canNangGoc để tính
  }));

  const tongCanNangList = dataPickList.reduce((total, item) => {
    return total + item.tongCanNang;
  }, 0);
  
  console.log(tongCanNangList);
  checkoutStore.tongCanNang = tongCanNangList;

  checkoutStore.addProduct(dataPickList);
};
onMounted(()=>{
  emitter.on("dataShip", async (data) => {
    await checkoutStore.calculateShippingFee(data.district, data.ward,checkoutStore.tongCanNang)
  })
  emitter.on("closeDialog",val =>{
    modal.value = val
  })
  checkOutCart()
})

</script>


<style scoped>
.v-text-field :v-deep .v-field__append-inner {
  padding-inline-end: 0;
}

.text-red {
  color: #ff0000 !important;
}

.position-relative {
  position: relative;
}

.quantity-badge {
  position: absolute !important;
  top: 0px;
  right: 0px;
  /* top: 8px;
  left: -8px; */
}
</style>