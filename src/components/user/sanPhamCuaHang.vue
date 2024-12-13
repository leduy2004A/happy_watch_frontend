<template>
  <div class="container">
    <div class="header">
      <h1 class="title">CỬA HÀNG</h1>
    </div>

    <div class="filters">
      <div class="filter-group">
        <span class="filter-label">Hiển thị</span>
        <select
          class="filter-select"
          :value="store.itemsPerPage" 
          @change="(e) => store.setItemsPerPage(Number(e.target.value))"
        >
          <option :value="6">6</option>
          <option :value="15">15</option>
          <option :value="30">30</option>
        </select>
      </div>
      <!-- Other filters remain the same -->
    </div>

    <div class="product-list" :class="store.gridClasses">
      <v-hover
      v-for="product in store.currentPageProducts"
      v-slot="{ isHovering, props }"
      :key="product.id" 
    >
      <v-card
        v-bind="props"
        :elevation="isHovering ? 4 : 0"
        class="watch-card h-100"
      >
        <div v-if="product.discount" class="sale-badge">
          -{{ product.discount }}%
        </div>

        <div class="product-image-container">
          <v-img
            v-if="!isHovering"
            :src="product.image"
            height="250"
            cover
            class="product-image cursor-pointer"
            @click="navigateToProduct(product.id)"
          ></v-img>
          <v-img
            v-else
            :src="product.secondImage || product.image"
            height="250"
            cover
            class="product-image cursor-pointer"
            @click="navigateToProduct(product.id)"
          >
            <div class="action-buttons show-actions" @click.stop>
              <v-btn
                icon="mdi-lightning-bolt"
                variant="text"
                class="action-btn"
                @click="muaNgay(product)"
              ></v-btn>
              <v-btn
                icon="mdi-cart"
                variant="text"
                class="action-btn"
                @click="addToCart(product)"
              ></v-btn>
              <v-btn
                icon="mdi-eye"
                variant="text"
                class="action-btn"
                @click="openQuickView(product)"
              ></v-btn>
            </div>
          </v-img>
        </div>

        <v-card-text
          class="text-center cursor-pointer"
          @click="navigateToProduct(product.id)"
        >
          <div class="text-subtitle-1 mb-2" >
            {{ product.name }} – {{ product.gioiTinh }} – {{ product.loaiKinh }} – {{ product.chatLieuVo }} – {{ product.loaiMay }} – {{ product.chatLieuDay }}
          </div>
          <div class="d-flex justify-center align-center">
            <span
              class="text-grey-darken-1 text-decoration-line-through me-2"
              v-if="product.oldPrice === product.price ? false : true"
            >
              {{ store.formatPrice(product.oldPrice) }}
            </span>
            <span class="text-primary font-weight-bold">
              {{ store.formatPrice(product.price) }}
            </span>

          </div>
          <span class="text-primary font-weight-bold">
              Số lượng: {{ product.soLuong }}
            </span>
        </v-card-text>
      </v-card>
    </v-hover>
    </div>

    <!-- Pagination -->
    <div class="pagination-container">
      <v-pagination
        v-model="store.currentPage"
        :length="store.totalPages"
        :total-visible="7"
        @update:model-value="store.handlePageChange"
      ></v-pagination>
    </div>

    <!-- Quick View Dialog -->
    <v-dialog v-model="showQuickView" max-width="800px">
      <v-card v-if="selectedProduct">
        <v-card-title class="text-h5 pa-4">
          {{ selectedProduct.name }} – {{ selectedProduct.gioiTinh }} – {{ selectedProduct.loaiKinh }} – {{ selectedProduct.chatLieuVo }} – {{ selectedProduct.loaiMay }} – {{ selectedProduct.chatLieuDay }}
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
                    v-if="selectedProduct.oldPrice === selectedProduct.price ? false : true"
                  >
                    {{ store.formatPrice(selectedProduct.oldPrice) }}
                  </span>
                  <span class="text-primary font-weight-bold text-h6">
                    {{ store.formatPrice(selectedProduct.price) }}
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
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useToast } from "vue-toastification";
const toast = useToast()
import { useRouter } from "vue-router";
import { sanPhamCuaHangStore } from "@/store/sanPhamCuaHangStore";
import { useCartStore } from "@/store/cartStore";
import useEmitter from "@/useEmitter";
import { useCheckOutStore } from "@/store/checkOutStore";
import Sweetalert2 from "sweetalert2";

const checkOutStore = useCheckOutStore();
// const router = useRouter()
const emitter = useEmitter();
const cart = useCartStore();
const router = useRouter();
const store = sanPhamCuaHangStore();
const showQuickView = ref(false);
const selectedProduct = ref(null);


const navigateToProduct = (productId) => {
  router.push(`/product/detail/${productId}`);
};

const openQuickView = (product) => {
  console.log(product)
  selectedProduct.value = product;
  showQuickView.value = true;
};

const addToWishlist = (product) => {
  console.log("Add to wishlist:", product);
};

const addToCart = (product) => {
  if(product.soLuong === 0)
  {
    toast.error("sản phẩm hết hàng !")
  }else{
      emitter.emit("openModalCart", true);
  cart.addToCart(product);
  }

};
const muaNgay =async (product) => {
  if(product.soLuong === 0)
  {
    toast.error("Sản phẩm hết hàng")
  }
  else{
    const { value: number } = await Sweetalert2.fire({
  input: "number",
  inputLabel: "Nhập số lượng",
  inputPlaceholder: "số lượng",
  inputAttributes: {
    "aria-label": "Type your message here"
  },
  showCancelButton: true
});
if (number) {
  if(number > 0 && number <= product.soLuong)
  {
    const data = [{
    
    id: product.id,
    name:  product.name + '–'+  product.gioiTinh+ '–' +  product.loaiKinh + '–'+ product.chatLieuVo + '-'+ product.loaiMay + '–' +  product.chatLieuDay ,
    price: product.price,
    image: product.image,
    canNang: product.canNang,
    code: product.code,
    quantity: number,
  }];
  localStorage.setItem("check-out",JSON.stringify(data))
  router.push("/product/checkout");
  }
  else if(number > product.soLuong)
  {
    toast.error("Sản phẩm không đủ số lượng")
  }else{
    toast.error("Số lượng phải lớn hơn 0")
  }
  }
  
}
      

};
onMounted(() => {
  store.loadProducts();
});
</script>
<style scoped>
/* Giữ nguyên các styles hiện có và thêm styles mới */
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
  /* height: 1100px; */
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
