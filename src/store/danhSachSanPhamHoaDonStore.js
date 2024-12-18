// stores/productStore.js
import { defineStore } from 'pinia'
import { layDanhSachSanPhamTheoMaHoaDon } from '@/axios/quanlihoadon'
import { addSoLuongSanPham } from '@/axios/hoadon'
import { truSoLuongSanPham } from '@/axios/hoadon'
import { congSlSanPham } from '@/axios/quanlihoadon'
 import { useOrderSummaryStore } from '@/store/orderSumaryStore'
 import { useLoading } from "vue-loading-overlay";
 import { xoaSanPhamTrongHoaDon } from '@/axios/hoadon'
 import { useToast } from 'vue-toastification'
 const toast = useToast()
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
    tongCanNang:0,
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
            formattedPrice: product.giaTungSanPham != null 
              ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.giaTungSanPham) 
              : '',
            formattedTotalPrice: product.giaTungSanPham != null && product.soLuong != null
              ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.giaTungSanPham * product.soLuong) 
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
        console.log(data)
        if(data.status === 200) {
          this.products = data.data.chiTietHoaDons
          this.tongCanNang = data.data.tongCanNang
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
        
    
        // Bắt đầu hiển thị loading overlay
        const loadingInstance = $loading.show();
    
        try {
          const data = await congSlSanPham(product.chiTietHoaDonId);
          if(data.status === 200)
            {
              this.products[index].soLuong++;
              await storeSummary.fetchOrderData(router.currentRoute.value.params.ma);
              toast.success("Thêm số lượng thành công")
            }
        } catch (error) {
          toast.error(error.response.data.message)
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
       
    
        // Bắt đầu hiển thị loading overlay
        const loadingInstance = $loading.show();
    
        try {
          const result = await truSoLuongSanPham(product.chiTietHoaDonId);
          if (result.status === 200) {
            // Đợi fetchOrderData hoàn tất trước khi tắt loading
            
            this.products[index].soLuong--;
            await storeSummary.fetchOrderData(router.currentRoute.value.params.ma);
            toast.success("Đã giảm số lượng")
          }
        } catch (error) {
          toast.error(error.response.data.message)
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