import { defineStore } from "pinia";
import { ref } from "vue";
import { laySanPhamCuaHang } from "@/axios/sanpham";

export const sanPhamCuaHangStore = defineStore("sanPhamCuaHangStore", {
  state: () => ({
    products: [],
    isLoading: false,
    currentPage: 1,
    itemsPerPage: 6,
    layoutType: "grid",
    totalItems: 0,
    // Thêm các state cho bộ lọc
    activeFilters: [],
    priceRange: [0, 200000000],
    originalProducts: [], // Lưu trữ danh sách sản phẩm gốc
  }),

  getters: {
    // Getter để lọc sản phẩm
    filteredProducts(state) {
      console.log(state.activeFilters);
      return state.originalProducts.filter((product) => {
        const matchesFilter =
          state.activeFilters.length === 0 ||
          state.activeFilters.includes(product.thuongHieu) || 
          state.activeFilters.includes(product.gioiTinh) || state.activeFilters.includes(product.loaiMay);
    
        // Lọc theo khoảng giá
        const matchesPrice =
          product.price >= state.priceRange[0] &&
          product.price <= state.priceRange[1];
    
        return matchesFilter && matchesPrice;
      });
    },

    // Các getter khác giữ nguyên
    gridClasses(state) {
      return {
        "grid-layout": state.layoutType === "grid",
        "list-layout": state.layoutType === "list",
      };
    },

    totalPages(state) {
      return Math.ceil(this.filteredProducts.length / state.itemsPerPage);
    },

    // Getter để lấy sản phẩm theo trang hiện tại
    currentPageProducts(state) {
      const start = (state.currentPage - 1) * state.itemsPerPage;
      const end = start + state.itemsPerPage;
      return this.filteredProducts.slice(start, end);
    },
  },

  actions: {
    // Thêm actions cho bộ lọc
    setFilters(filters) {
      console.log(filters);
      this.activeFilters = filters;
      this.currentPage = 1; // Reset về trang 1
    },

    setPriceRange(range) {
      this.priceRange = range;
      this.currentPage = 1; // Reset về trang 1
    },

    async resetFilters() {
      this.activeFilters = [];
      this.priceRange = [0, 200000000];
      this.currentPage = 1;
      // await this.loadProducts()
    },

    // Sửa lại action loadProducts
    async loadProducts() {
      const result = await this.fetchProducts(1, 1000); // Lấy tất cả sản phẩm
      this.originalProducts = result.products;
      this.totalItems = result.total;
      // Cập nhật products dựa trên trang hiện tại
      this.products = this.currentPageProducts;
    },

    // Các actions khác giữ nguyên
    formatPrice(price) {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(price);
    },

    calculateDiscount(oldPrice, newPrice) {
      return Math.round(((oldPrice - newPrice) / oldPrice) * 100);
    },

    async fetchProducts(page, limit) {
      try {
        this.isLoading = true;
        const response = await laySanPhamCuaHang(page - 1, limit);

        if (!response.data.content) {
          return {
            products: [],
            total: 0,
          };
        }

        const formattedProducts = response.data.content.map((item) => ({
          id: item.id,
          name: item.ten,
          oldPrice: item.gia,
          price: item.giaSauGiam,
          discount: this.calculateDiscount(item.gia, item.giaSauGiam),
          image: item.hinhAnhDauTien,
          image2: item.hinhAnhThuHai,
          secondImage: item.hinhAnhThuHai,
          soLuong: item.soLuong,
          canNang: item.canNang,
          gioiTinh: item.gioiTinh,
          loaiKinh: item.loaiKinh,
          chatLieuVo: item.chatLieuVo,
          loaiMay: item.loaiMay,
          chatLieuDay: item.chatLieuDay,
          thuongHieu: item.thuongHieu,
          code: item.ma,
        }));
        console.log(formattedProducts);
        return {
          products: formattedProducts,
          total: response.data.totalElements, // Giả sử API trả về tổng số sản phẩm
        };
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
        return {
          products: [],
          total: 0,
        };
      } finally {
        this.isLoading = false;
      }
    },

    handlePageChange(newPage) {
      this.currentPage = newPage;
      this.products = this.currentPageProducts;
    },

    toggleLayout() {
      this.layoutType = this.layoutType === "grid" ? "list" : "grid";
    },

    setItemsPerPage(value) {
      this.itemsPerPage = value;
      this.currentPage = 1;
      this.products = this.currentPageProducts;
    },
  },
});
