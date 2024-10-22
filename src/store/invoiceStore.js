// stores/invoiceStore.js
import { defineStore } from 'pinia'
import { 
  addHoaDon, 
  hienThiHoaDonChoThanhToan, 
  huyHoaDon 
} from '@/axios/hoadon'

export const useInvoiceStore = defineStore('invoice', {
  // State
  state: () => ({
    tabs: [],
    hoaDonId:0,               // Danh sách các tabs hóa đơn
    currentTab: null,        // Tab hiện tại đang được chọn
    nextOrderNumber: 1,      // Số thứ tự cho hóa đơn tiếp theo
    isLoading: false,        // Trạng thái loading
    error: null             // Lưu trữ lỗi nếu có
  }),

  // Getters
  getters: {
    // Lấy tab hiện tại
    getCurrentTab: (state) => state.currentTab,
    
    // Lấy tất cả các tabs
    getAllTabs: (state) => state.tabs,
    
    // Kiểm tra có tabs nào không
    hasTabs: (state) => state.tabs.length > 0,
    
    // Lấy số lượng tabs
    tabCount: (state) => state.tabs.length,
    
    // Lấy tab theo id
    getTabById: (state) => (id) => {
      return state.tabs.find(tab => tab.id === id)
    },
    
    // Kiểm tra trạng thái loading
    getLoadingStatus: (state) => state.isLoading,
    getHoaDonId:(state)=>state.hoaDonId,
    // Lấy thông tin lỗi
    getError: (state) => state.error
  },

  // Actions
  actions: {
    // Reset state
    resetState() {
      this.tabs = []
      this.currentTab = null
      this.nextOrderNumber = 1
      this.error = null
    },

    // Cập nhật trạng thái lỗi
    setError(error) {
      this.error = error
    },

    // Set loading state
    setLoading(status) {
      this.isLoading = status
    },

    // Fetch danh sách hóa đơn
    async fetchInvoices() {
      try {
        this.setLoading(true)
        this.resetState()
        
        const dataResult = (await hienThiHoaDonChoThanhToan()).data
        
        dataResult.forEach(hoaDon => {
          this.tabs.push({
            ma: hoaDon.ma,
            id: hoaDon.id
          })
          this.currentTab = this.nextOrderNumber
          this.nextOrderNumber++
        })
        
        return this.tabs
      } catch (error) {
        this.setError(error.message)
        throw error
      } finally {
        this.setLoading(false)
      }
    },
    
    // Thêm hóa đơn mới
    async addNewInvoice() {
      try {
        this.setLoading(true)
        const data = (await addHoaDon()).data
        
        const newInvoice = {
          ma: data.ma,
          id: data.id
        }
        
        this.tabs.push(newInvoice)
        this.currentTab = newInvoice
        
        return newInvoice
      } catch (error) {
        this.setError(error.message)
        throw error
      } finally {
        this.setLoading(false)
      }
    },
    setHoaDonId(hoaDonId)
    {
        this.hoaDonId = hoaDonId
    },
    // Xóa hóa đơn
    async removeInvoice(tabToRemove) {
      try {
        this.setLoading(true)
        const currentIndex = this.tabs.findIndex(t => t.id === tabToRemove.id)
        
        if (currentIndex !== -1) {
          // Lưu lại tab hiện tại trước khi xóa
          const isCurrentTab = this.currentTab?.id === tabToRemove.id
          
          // Hủy hóa đơn trong database
          await huyHoaDon(tabToRemove.id)
          
          // Xóa tab khỏi danh sách
          this.tabs.splice(currentIndex, 1)
          
          // Nếu còn tabs
          if (this.tabs.length > 0) {
            if (isCurrentTab) {
              // Ưu tiên chọn tab phía trước (nếu có)
              if (currentIndex > 0) {
                this.currentTab = this.tabs[currentIndex - 1]
              }
              // Nếu không có tab trước, chọn tab đầu tiên còn lại
              else {
                this.currentTab = this.tabs[0]
              }
            }
            // Nếu xóa tab không phải tab hiện tại, giữ nguyên tab hiện tại
            return this.currentTab
          } else {
            this.currentTab = null
            return null
          }
        }
      } catch (error) {
        this.setError(error.message)
        throw error
      } finally {
        this.setLoading(false)
      }
    },

    // Cập nhật tab hiện tại
    setCurrentTab(tab) {
      this.currentTab = tab
    }
  }
})