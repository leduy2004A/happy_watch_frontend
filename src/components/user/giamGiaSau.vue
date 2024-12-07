<template>
  <div class="bg-black">
    <div class="container px-8 py-8">
      <div class="flex align-items-center justify-content-center">
        <h1 class="text-4xl font-bold text-white">GIẢM GIÁ</h1>
      </div>
      
      <div class="flex align-items-center justify-content-center mb-8 diamond-divider">
        <span v-for="n in 5" :key="n" class="diamond">♦</span>
      </div>

      <Carousel 
        :value="chunkedProducts" 
        :numVisible="1" 
        :numScroll="1"
        :showNavigators="false"
      >
        <template #item="slotProps">
          <div class="grid">
            <div v-for="product in slotProps.data" 
                :key="product.id"
                class="col-12 sm:col-6 md:col-3"
            >
              <Card>
                <template #header>
                  <div class="relative">
                    <!-- <Tag v-if="product.isNew" 
                        severity="danger"
                        class="absolute m-2"
                        value="NEW!"
                    /> -->
                    <Tag v-if="product.discount"
                        severity="warning"
                        class="absolute m-2 ml-2"
                        :value="`-${product.discount}%`"
                    />
                    <Image 
                      :src="product.image"
                      :alt="product.name"
                      height="250"
                      imageClass="w-full h-full object-cover"
                      class="card-image"
                    >
                      <template #indicator>
                        <ProgressSpinner />
                      </template>
                    </Image>
                  </div>
                </template>

                <template #title>
                  <div class="text-lg truncate pt-4">{{ product.name }} – {{ product.gioiTinh }} – {{ product.loaiKinh }} – {{ product.chatLieuVo }} – {{ product.loaiMay }} – {{ product.chatLieuDay }}</div>
                </template>

                <template #content>
                  <div class="flex flex-column">
                    <span class="text-sm line-through text-500 mb-1">
                      {{ formatPrice(product.oldPrice) }}
                    </span>
                    <span class="text-xl text-red-500">
                      {{ formatPrice(product.price) }}
                    </span>
                  </div>
                  <div class="flex justify-content-center mt-4 mb-2">
                    <Button v-for="icon in ['pi pi-eye', 'pi pi-shopping-cart', 'pi pi-bolt']"
                            :key="icon"
                            :icon="icon"
                            text
                            class="mx-1"
                            @click="useIcon(icon,product)"
                    />
                  </div>
                </template>
              </Card>
            </div>
          </div>
        </template>
      </Carousel>
      <v-dialog v-model="showQuickView" max-width="800px">
      <v-card v-if="selectedProduct">
        <v-card-title class="text-h5 pa-4">
          {{ selectedProduct.name }}
          <v-btn
            icon="mdi-close"
            variant="text"
            @click="showQuickView = false"
            class="float-right"
          ></v-btn>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-img :src="selectedProduct.image" cover height="400"></v-img>
            </v-col>
            <v-col cols="12" md="6">
              <div class="text-h6 mb-2">Thông tin sản phẩm</div>
              <div class="mb-4">
                <div class="d-flex align-center mb-2">
                  <span
                    class="text-grey-darken-1 text-decoration-line-through me-2"
                    v-if="selectedProduct.oldPrice"
                  >
                    {{ formatPrice(selectedProduct.oldPrice) }}
                  </span>
                  <span class="text-primary font-weight-bold text-h6">
                    {{ formatPrice(selectedProduct.price) }}
                  </span>
                </div>
              </div>
              <v-btn color="primary" block @click="addToCart(selectedProduct)">
                Thêm vào giỏ hàng
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { sanPhamDangKhuyenMai } from '@/axios/sanpham';
import { useRouter } from "vue-router";
import { sanPhamCuaHangStore } from "@/store/sanPhamCuaHangStore";
import { useCartStore } from "@/store/cartStore";
import useEmitter from "@/useEmitter";
import { useCheckOutStore } from "@/store/checkOutStore";
import { sanPhamNam, sanPhamNu } from "@/axios/sanpham";
const checkOutStore = useCheckOutStore();
// const router = useRouter()
const emitter = useEmitter();
const cart = useCartStore();
const router = useRouter();

const showQuickView = ref(false);
const selectedProduct = ref(null);

const products = ref([
  
])

const chunkedProducts = computed(() => {
  const chunks = []
  for (let i = 0; i < products.value.length; i += 4) {
    chunks.push(products.value.slice(i, i + 4))
  }
  return chunks
})


const navigateToProduct = (productId) => {
  router.push(`/product/detail/${productId}`);
};

const openQuickView = (product) => {
  selectedProduct.value = product;
  console.log(selectedProduct.value);
  showQuickView.value = true;
};

const addToCart = (product) => {
  emitter.emit("openModalCart", true);
  console.log(product);
  cart.addToCart(product);
};
const muaNgay = (product) => {
  const data = [
    {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      canNang: product.canNang,
      code: product.code,
      quantity: 1,
    },
  ];
  localStorage.setItem("check-out", JSON.stringify(data));
  router.push("/product/checkout");
};
const useIcon = (icon,product) =>{
  console.log(icon)
  if(icon === 'pi pi-shopping-cart')
  {
    addToCart(product)
  }
  if(icon === 'pi pi-bolt')
  {
    muaNgay(product)
  }
  if(icon === 'pi pi-eye')
  {
    openQuickView(product)
  }
}
const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price)
}
const calculateDiscount = (oldPrice, newPrice) => {
  return Math.round(((oldPrice - newPrice) / oldPrice) * 100);
};
onMounted(async ()=>{
  const result = await sanPhamDangKhuyenMai();
  if (result.status === 200) {
    products.value = result.data.map((item) => ({
      id: item.id,
          name: item.ten,
          oldPrice: item.gia,
          price: item.giaSauGiam,
          discount: calculateDiscount(item.gia, item.giaSauGiam),
          image: item.hinhAnhDauTien,
          image2: item.hinhAnhThuHai,
          secondImage: item.hinhAnhThuHai,
          soLuong: item.soLuong,
          canNang: item.canNang,
          gioiTinh:item.gioiTinh,
          loaiKinh:item.loaiKinh,
          chatLieuVo:item.chatLieuVo,
          loaiMay:item.loaiMay,
          chatLieuDay:item.chatLieuDay,
          code: item.ma 
    }));
  
  }
})
</script>

<style scoped>
.relative {
  position: relative;
}

.absolute {
  position: absolute;
  z-index: 1;
}

.diamond-divider {
  display: flex;
  align-items: center;
  margin-left: 10px;
}

.diamond {
  color: white;
  font-size: 12px;
  margin: 0 2px;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #1a1a1a;
}

::-webkit-scrollbar-thumb {
  background: #666;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #888;
}

:deep(.p-image-preview-indicator) {
  background: rgba(0, 0, 0, 0.5);
}

:deep(.p-image) {
  display: block;
}
.relative {
  position: relative;
}

.absolute {
  position: absolute;
  z-index: 1;
}

.diamond-divider {
  display: flex;
  align-items: center;
  margin-left: 10px;
}

.diamond {
  color: white;
  font-size: 12px;
  margin: 0 2px;
}

/* Hình ảnh hiển thị đều nhau */
.card-image {
  position: relative;
  width: 100%;
 /* Duy trì tỷ lệ 1:1 */
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f4f4f4;
  height: 200px;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  overflow: hidden;

}

/* Grid */
.grid .col-12 {
  display: flex;
  justify-content: center;
}

.grid .col-12 .p-card {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>