<template>
  <v-container class="py-16">
    <div class="text-center mb-12">
      <h2 class="text-h3 font-weight-bold mb-3">SẢN PHẨM MỚI</h2>
      <div class="d-flex justify-center mb-6">
        <div class="diamond-divider">
          <span v-for="n in 5" :key="n" class="diamond-dot">♦</span>
        </div>
      </div>
      <p class="text-subtitle-1 text-grey-darken-1">
        Sản phẩm mới nhất trên trang web bán hàng của chúng tôi sẽ làm bạn phong
        cách và đẳng cấp hơn bao giờ hết.
      </p>
    </div>

    <!-- Men's Watches Section -->
    <div class="mb-16">
      <h2 class="text-h4 font-weight-medium text-center mb-12">ĐỒNG HỒ NAM</h2>
      <div class="">
        <v-row>
          <v-col
            v-for="watch in mensWatches"
            :key="watch.id"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <v-hover v-slot="{ isHovering, props }">
              <v-card
                v-bind="props"
                :elevation="isHovering ? 4 : 0"
                class="watch-card h-100"
              >
                <!-- Sale Badge -->
                <div v-if="watch.discount" class="sale-badge">
                  -{{ watch.discount }}%
                </div>

                <!-- Product Image -->
                <div class="product-image-container">
                  <v-img
                    v-if="!isHovering"
                    :src="watch.hinhAnh1"
                    height="250"
                    cover
                    class="product-image cursor-pointer"
                    @click="navigateToProduct(watch.id)"
                  ></v-img>
                  <v-img
                    v-else
                    :src="watch.hinhAnh2 || watch.hinhAnh1"
                    height="250"
                    cover
                    class="product-image cursor-pointer"
                    @click="navigateToProduct(watch.id)"
                  >
                    <!-- Quick Action Buttons -->
                    <div class="action-buttons show-actions" @click.stop>
                      <v-btn
                        icon="mdi-lightning-bolt"
                        variant="text"
                        class="action-btn"
                        @click="muaNgay(watch)"
                      ></v-btn>
                      <v-btn
                        icon="mdi-cart"
                        variant="text"
                        class="action-btn"
                        @click="addToCart(watch)"
                      ></v-btn>
                      <v-btn
                        icon="mdi-eye"
                        variant="text"
                        class="action-btn"
                        @click="openQuickView(watch)"
                      ></v-btn>
                    </div>
                  </v-img>
                </div>

                <!-- Product Info -->
                <v-card-text
                  class="text-center cursor-pointer"
                  @click="navigateToProduct(watch.id)"
                >
                  <div class="text-subtitle-1 text-truncate mb-2">
                    {{ watch.tenSanPham }}
                  </div>
                  <div class="d-flex justify-center align-center">
                    <span
                      class="text-grey-darken-1 text-decoration-line-through me-2"
                      v-if="watch.giaSauGiam"
                    >
                      {{ formatPrice(watch.giaSauGiam) }}
                    </span>
                    <span class="text-primary font-weight-bold">
                      {{ formatPrice(watch.gia) }}
                    </span>
                  </div>
                </v-card-text>
              </v-card>
            </v-hover>
          </v-col>
        </v-row>
      </div>
    </div>

    <!-- Women's Watches Section -->
    <div>
      <h2 class="text-h4 font-weight-medium text-center mb-12">ĐỒNG HỒ NỮ</h2>
      <v-row>
          <v-col
            v-for="watch in womensWatches"
            :key="watch.id"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <v-hover v-slot="{ isHovering, props }">
              <v-card
                v-bind="props"
                :elevation="isHovering ? 4 : 0"
                class="watch-card h-100"
              >
                <!-- Sale Badge -->
                <div v-if="watch.discount" class="sale-badge">
                  -{{ watch.discount }}%
                </div>

                <!-- Product Image -->
                <div class="product-image-container">
                  <v-img
                    v-if="!isHovering"
                    :src="watch.hinhAnh1"
                    height="250"
                    cover
                    class="product-image cursor-pointer"
                    @click="navigateToProduct(watch.id)"
                  ></v-img>
                  <v-img
                    v-else
                    :src="watch.hinhAnh2 || watch.hinhAnh1"
                    height="250"
                    cover
                    class="product-image cursor-pointer"
                    @click="navigateToProduct(watch.id)"
                  >
                    <!-- Quick Action Buttons -->
                    <div class="action-buttons show-actions" @click.stop>
                      <v-btn
                        icon="mdi-lightning-bolt"
                        variant="text"
                        class="action-btn"
                        @click="muaNgay(watch)"
                      ></v-btn>
                      <v-btn
                        icon="mdi-cart"
                        variant="text"
                        class="action-btn"
                        @click="addToCart(watch)"
                      ></v-btn>
                      <v-btn
                        icon="mdi-eye"
                        variant="text"
                        class="action-btn"
                        @click="openQuickView(watch)"
                      ></v-btn>
                    </div>
                  </v-img>
                </div>

                <!-- Product Info -->
                <v-card-text
                  class="text-center cursor-pointer"
                  @click="navigateToProduct(watch.id)"
                >
                  <div class="text-subtitle-1 text-truncate mb-2">
                    {{ watch.tenSanPham }}
                  </div>
                  <div class="d-flex justify-center align-center">
                    <span
                      class="text-grey-darken-1 text-decoration-line-through me-2"
                      v-if="watch.giaSauGiam"
                    >
                      {{ formatPrice(watch.giaSauGiam) }}
                    </span>
                    <span class="text-primary font-weight-bold">
                      {{ formatPrice(watch.gia) }}
                    </span>
                  </div>
                </v-card-text>
              </v-card>
            </v-hover>
          </v-col>
        </v-row>
    </div>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { sanPhamCuaHangStore } from "@/store/sanPhamCuaHangStore";
import { useCartStore } from "@/store/cartStore";
import useEmitter from "@/useEmitter";
import { useCheckOutStore } from "@/store/checkOutStore";
import { sanPhamNam,sanPhamNu } from "@/axios/sanpham";
const checkOutStore = useCheckOutStore();
// const router = useRouter()
const emitter = useEmitter();
const cart = useCartStore();
const router = useRouter();

const showQuickView = ref(false);
const selectedProduct = ref(null);
const mensWatches = ref([])
const womensWatches = ref([])


const navigateToProduct = (productId) => {
  router.push(`/product/detail/${productId}`);
};

const openQuickView = (product) => {
  selectedProduct.value = product;
  showQuickView.value = true;
};

const addToCart = (product) => {
  emitter.emit("openModalCart", true);
  cart.addToCart(product);
};
const muaNgay = (product) => {
  const data = [{
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.image,
    canNang: product.canNang,
    code: product.code,
    quantity: 1,
  }];
  // const dataPick = {
  //   productGoc: product,
  //   soLuongChon: 1,
  //   tongCanNang: 1 * product.canNang  // Thêm tongCanNang vào đây
  // }

  // // Thêm sản phẩm mới vào trước
  // productSelect.value.push(dataPick)

  // // Sau đó mới tính tổng cân nặng
  // const tongCanNangList = productSelect.value.reduce((total, item) => {
  //   return total + item.tongCanNang
  // }, 0)

  // console.log(tongCanNangList)
  // checkOutStore.tongCanNang = tongCanNangList

  // // Thêm vào store
  // checkOutStore.addProduct(productSelect.value)

  // console.log(checkOutStore.products)
  localStorage.setItem("check-out",JSON.stringify(data))
  router.push("/product/checkout");
};
const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };
  
onMounted(async () => {
  const result = await sanPhamNam();
  const resultNu = await sanPhamNu();
  if (result.status === 200) {
    mensWatches.value = result.data;
  }
  if (resultNu.status === 200) {
    console.log(resultNu.data);
    womensWatches.value = resultNu.data;
  }
});
</script>

<style scoped>
.scroll-container {
  height: 100%;
  overflow-y: auto;
  padding: 0 1rem;
}

.loading-container {
  display: flex;
  justify-content: center;
  padding: 2rem 0;
}

/* Thêm smooth scrolling */
.scroll-container {
  scroll-behavior: smooth;
}

/* Style cho container */
.container {
  max-width: 1200px;
  margin: 0 auto;
  height: 1100px;
  display: flex;
  flex-direction: column;
}

/* Điều chỉnh product list để hoạt động tốt với scroll container */
.product-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  padding: 1rem 0;
}

.product-list.list {
  grid-template-columns: 1fr;
}

/* Giữ nguyên các styles khác từ code ban đầu */
.product-image-container {
  position: relative;
  overflow: hidden;
}

.action-buttons {
  position: absolute;
  bottom: -50px;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  justify-content: center;
  gap: 8px;
  padding: 8px 0;
  transition: all 0.3s ease;
}

.watch-card:hover .action-buttons {
  bottom: 0;
}
.product-image-container {
  position: relative;
  overflow: hidden;
}

.action-buttons {
  position: absolute;
  bottom: -50px; /* Ẩn nút khi không hover */
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  justify-content: center;
  gap: 8px;
  padding: 8px 0;
  transition: all 0.3s ease;
}

.watch-card:hover .action-buttons {
  bottom: 0; /* Hiện nút khi hover */
}

.action-btn {
  color: #333;
}

.action-btn:hover {
  color: #1976d2;
}
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

.title {
  font-size: 2rem;
  font-weight: 700;
  margin-top: 0.5rem;
}

.breadcrumb {
  color: #666;
}

.breadcrumb a {
  color: #666;
  text-decoration: none;
  transition: color 0.3s;
}

.breadcrumb a:hover {
  color: #ff5722;
}

.breadcrumb span {
  margin: 0 0.5rem;
}

.filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.filter-group {
  display: flex;
  align-items: center;
}

.filter-label {
  margin-right: 0.5rem;
  font-weight: 500;
}

.filter-select {
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.filter-select:focus {
  outline: none;
  border-color: #ff5722;
}

.layout-btn {
  margin-left: 1rem;
  color: #ff5722;
  transition: color 0.3s;
}

.layout-btn:hover {
  color: #d84315;
}

.product-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.product-list.list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.product-list.list .product-card {
  display: flex;
  align-items: center;
}

.product-list.list .product-image {
  flex-basis: 30%;
  max-width: 200px;
  margin-right: 1.5rem;
}

.product-card {
  border: 1px solid #ccc;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.product-image {
  position: relative;
}

.product-img {
  width: 100%;
  height: auto;
  display: block;
}

.badges {
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
}

.badge-new {
  background-color: #ff5722;
  color: #fff;
}

.badge-discount {
  background-color: #ffc107;
  color: #333;
}

.product-info {
  padding: 1.5rem;
}

.product-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
}

.product-price {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.old-price {
  font-size: 0.9rem;
  color: #666;
  text-decoration: line-through;
  margin-right: 0.5rem;
}

.new-price {
  font-size: 1.25rem;
  font-weight: 700;
  color: #ff5722;
}

.product-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.action-btn {
  color: #ff5722;
  transition: color 0.3s;
}

.action-btn:hover {
  color: #d84315;
}
.watch-card {
  position: relative;
  transition: all 0.3s ease;
  border: 1px solid #eee;
}

.sale-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: #ff4081;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  z-index: 1;
}

.product-image-container {
  position: relative;
  overflow: hidden;
}

.product-image {
  transition: transform 0.3s ease;
}

.action-buttons {
  position: absolute;
  bottom: -50px;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  justify-content: center;
  gap: 8px;
  padding: 8px 0;
  transition: all 0.3s ease;
}

.show-actions {
  bottom: 0;
}

.action-btn {
  color: #333;
}

.action-btn:hover {
  color: #1976d2;
}

/* Price formatting */
.text-primary {
  color: #1976d2 !important;
}

/* Hover effects */
.watch-card:hover {
  border-color: #1976d2;
}
.product-image-container {
  position: relative;
  overflow: hidden;
}

.action-buttons {
  position: absolute;
  bottom: -50px; /* Ẩn nút khi không hover */
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  justify-content: center;
  gap: 8px;
  padding: 8px 0;
  transition: all 0.3s ease;
}

.watch-card:hover .action-buttons {
  bottom: 0; /* Hiện nút khi hover */
}

.action-btn {
  color: #333;
}

.action-btn:hover {
  color: #1976d2;
}
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

.title {
  font-size: 2rem;
  font-weight: 700;
  margin-top: 0.5rem;
}

.breadcrumb {
  color: #666;
}

.breadcrumb a {
  color: #666;
  text-decoration: none;
  transition: color 0.3s;
}

.breadcrumb a:hover {
  color: #ff5722;
}

.breadcrumb span {
  margin: 0 0.5rem;
}

.filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.filter-group {
  display: flex;
  align-items: center;
}

.filter-label {
  margin-right: 0.5rem;
  font-weight: 500;
}

.filter-select {
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.filter-select:focus {
  outline: none;
  border-color: #ff5722;
}

.layout-btn {
  margin-left: 1rem;
  color: #ff5722;
  transition: color 0.3s;
}

.layout-btn:hover {
  color: #d84315;
}

.product-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.product-list.list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.product-list.list .product-card {
  display: flex;
  align-items: center;
}

.product-list.list .product-image {
  flex-basis: 30%;
  max-width: 200px;
  margin-right: 1.5rem;
}

.product-card {
  border: 1px solid #ccc;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.product-image {
  position: relative;
}

.product-img {
  width: 100%;
  height: auto;
  display: block;
}

.badges {
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
}

.badge-new {
  background-color: #ff5722;
  color: #fff;
}

.badge-discount {
  background-color: #ffc107;
  color: #333;
}

.product-info {
  padding: 1.5rem;
}

.product-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
}

.product-price {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.old-price {
  font-size: 0.9rem;
  color: #666;
  text-decoration: line-through;
  margin-right: 0.5rem;
}

.new-price {
  font-size: 1.25rem;
  font-weight: 700;
  color: #ff5722;
}

.product-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.action-btn {
  color: #ff5722;
  transition: color 0.3s;
}

.action-btn:hover {
  color: #d84315;
}
.watch-card {
  position: relative;
  transition: all 0.3s ease;
  border: 1px solid #eee;
}

.sale-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: #ff4081;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  z-index: 1;
}

.product-image-container {
  position: relative;
  overflow: hidden;
}

.product-image {
  transition: transform 0.3s ease;
}

.action-buttons {
  position: absolute;
  bottom: -50px;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  justify-content: center;
  gap: 8px;
  padding: 8px 0;
  transition: all 0.3s ease;
}

.show-actions {
  bottom: 0;
}

.action-btn {
  color: #333;
}

.action-btn:hover {
  color: #1976d2;
}

/* Price formatting */
.text-primary {
  color: #1976d2 !important;
}

/* Hover effects */
.watch-card:hover {
  border-color: #1976d2;
}
</style>
