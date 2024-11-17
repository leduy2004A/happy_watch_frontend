// stores/productStore.js
import { defineStore } from 'pinia'
import { layDanhSachSanPhamTheoMaHoaDon } from '@/axios/quanlihoadon'
import { addSoLuongSanPham } from '@/axios/hoadon'
import { truSoLuongSanPham } from '@/axios/hoadon'
import { congSlSanPham } from '@/axios/quanlihoadon'
 import { useOrderSummaryStore } from '@/store/orderSumaryStore'
 import { useLoading } from "vue-loading-overlay";
 import { xoaSanPhamTrongHoaDon } from '@/axios/hoadon'
import router from '@/router/router'
const $loading = useLoading({
  loader: "bars",
  lockScroll: false,
  color: "orange",
  isFullPage: true,
  container: null,
});
export const danhSachSanPhamHoaDonStore = defineStore('SanPhamHoaDonStore', {
  // State
  state: () => ({
    products: [],
    showDialog: false
  }),

  // Getters
  getters: {
    getProducts: (state) => state.products,
    getShowDialog: (state) => state.showDialog,
    getFormattedPrices: (state) => {
      return Array.isArray(state.products)
        ? state.products.map(product => ({
            ...product,
            formattedPrice: product.giaSauGiam != null 
              ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.giaSauGiam) 
              : '',
            formattedTotalPrice: product.giaSauGiam != null && product.soLuong != null
              ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.giaSauGiam * product.soLuong) 
              : ''
          }))
        : [];
    }
    
  },

  // Actions
  actions: {
    async fetchProducts(maHoaDon) {
      try {
        const data = await layDanhSachSanPhamTheoMaHoaDon(maHoaDon)
        if(data.status === 200) {
          this.products = data.data.chiTietHoaDons
        }
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    },

   async increaseQuantity(product) {
    
      const index = this.products.findIndex(p => p.chiTietSanPhamId === product.chiTietSanPhamId)
      if (index !== -1) {
        this.products[index].soLuong++
        console.log(product)
        const data = await addSoLuongSanPham(product.chiTietHoaDonId)
        console.log(data)
      }
    },
    async increaseQuantityDSSPHoaDon(product) {
      const storeSummary = useOrderSummaryStore();
      const index = this.products.findIndex(p => p.chiTietSanPhamId === product.chiTietSanPhamId);
      
      if (index !== -1) {
        this.products[index].soLuong++;
    
        // Bắt đầu hiển thị loading overlay
        const loadingInstance = $loading.show();
    
        try {
          console.log(product);
          const data = await congSlSanPham(product.chiTietHoaDonId);
          if(data.status === 200)
            {
              await storeSummary.fetchOrderData(router.currentRoute.value.params.ma);
            }
        } catch (error) {
          console.error("Error increasing quantity:", error);
        } finally {
          // Tắt loading overlay sau khi hoàn thành
          loadingInstance.hide();
        }
      }
    },
    async decreaseQuantity(product) {
      const storeSummary = useOrderSummaryStore();
      const index = this.products.findIndex(p => p.chiTietSanPhamId === product.chiTietSanPhamId);
      
      if (index !== -1 && this.products[index].soLuong > 1) {
        this.products[index].soLuong--;
    
        // Bắt đầu hiển thị loading overlay
        const loadingInstance = $loading.show();
    
        try {
          const result = await truSoLuongSanPham(product.chiTietHoaDonId);
          if (result.status === 200) {
            // Đợi fetchOrderData hoàn tất trước khi tắt loading
          
            await storeSummary.fetchOrderData(router.currentRoute.value.params.ma);
          }
        } catch (error) {
          console.error("Error decreasing quantity:", error);
        } finally {
          // Tắt loading overlay sau khi hoàn thành tất cả xử lý
          loadingInstance.hide();
        }
      }
    },

    formatPrice(price) {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(price)
    },

    toggleDialog(value) {
      this.showDialog = value
    },
    async xoaSanPham(chiTietHoaDonId){
      const storeSummary = useOrderSummaryStore();
      const loadingInstance = $loading.show();
      try{
            const result = await xoaSanPhamTrongHoaDon(chiTietHoaDonId)
     if(result.status === 200)
      {
        await this.fetchProducts(router.currentRoute.value.params.ma)
        await storeSummary.fetchOrderData(router.currentRoute.value.params.ma);
      }
      }catch (error) {
        console.error("Error decreasing quantity:", error);
      } finally {
        // Tắt loading overlay sau khi hoàn thành tất cả xử lý
        loadingInstance.hide();
      }
 
    }
  }
})