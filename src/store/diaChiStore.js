// stores/addressStore.js
import { defineStore } from 'pinia'
import { getTinhThanh, getQuanHuyen, getPhuongXa } from "@/axios/diachi"
import { xacNhanDonHang,xacNhanDonHangMuaTaiQuay } from "@/axios/hoadon"
import { useOrderStore } from './tienStore'
export const useAddressStore = defineStore('address', {
  state: () => ({
    formData: {
      ten: "",
      address: "",
      phone: "",
      province: "",
      district: "",
      ward: "",
      detailAddress: "",
      note: "",
    },
    provinces: [],
    districts: [],
    wards: [],
    hoaDonId: 0,
    valid: true
  }),

  actions: {
    async fetchProvinces() {
      try {
        const response = await getTinhThanh()
        if (response.status === 200) {
          this.provinces = response.data.data.map((province) => ({
            text: province.ProvinceName,
            value: province.ProvinceID,
          }))
        }
      } catch (error) {
        console.error("Error fetching provinces:", error)
      }
    },

    async handleProvinceChange(provinceId) {
      try {
        const response = await getQuanHuyen(provinceId)
        if (response.status === 200) {
          this.districts = response.data.data.map((district) => ({
            text: district.DistrictName,
            value: district.DistrictID,
          }))
        }
      } catch (error) {
        console.error("Error fetching districts:", error)
      }
    },

    async handleDistrictChange(districtId) {
      try {
        const response = await getPhuongXa(districtId)
        if (response.status === 200) {
          this.wards = response.data.data.map((ward) => ({
            text: ward.WardName,
            value: ward.WardCode,
          }))
        }
      } catch (error) {
        console.error("Error fetching wards:", error)
      }
    },

    async updateAddressFromProps(diachi) {
      try {
        if (diachi) {
          const { tinhThanhPho, dienThoai, quanHuyen, xaPhuongThiTran, nguoiDung } = diachi

          await this.fetchProvinces()
          
          const foundProvince = this.provinces.find(
            p => p.text.toLowerCase() === tinhThanhPho?.toLowerCase()
          )

          if (foundProvince) {
            this.formData.province = foundProvince.value
            await this.handleProvinceChange(foundProvince.value)

            const foundDistrict = this.districts.find(
              d => d.text.toLowerCase() === quanHuyen?.toLowerCase()
            )

            if (foundDistrict) {
              this.formData.district = foundDistrict.value
              await this.handleDistrictChange(foundDistrict.value)

              const foundWard = this.wards.find(
                w => w.text.toLowerCase() === xaPhuongThiTran?.toLowerCase()
              )

              if (foundWard) {
                this.formData.ward = foundWard.value
              }
            }
          }

          this.formData.phone = dienThoai ?? ""
          this.formData.ten = nguoiDung?.ten ?? ""
        }
      } catch (error) {
        console.error('Error updating address:', error)
      }
    },

    async xacNhanDonHang() {
        const tienStore = useOrderStore()
        
        // Tìm tên tỉnh/thành phố từ ID
        const selectedProvince = this.provinces.find(p => p.value === this.formData.province)
        const selectedDistrict = this.districts.find(d => d.value === this.formData.district)
        const selectedWard = this.wards.find(w => w.value === this.formData.ward)
  
        const data = {
          hoaDonId: tienStore.hoaDonId,
          province: selectedProvince?.text || this.formData.province,
          district: selectedDistrict?.text || this.formData.district,
          ward: selectedWard?.text || this.formData.ward,
          diaChiCuThe: `${this.formData.detailAddress}, ${selectedWard?.text || ''}, ${selectedDistrict?.text || ''}, ${selectedProvince?.text || ''}`,
          dienThoai: this.formData.phone,
          ten: this.formData.ten,
          tongTienHoaDon:tienStore.totalAmountValue,
          phiShip:tienStore.shippingFee,
          maKhuyenMaiHoaDon:tienStore.discountCode
        }
        console.log(data)
        try {
          const result = await xacNhanDonHang(data)
          return{
            result,
            data
          } 
        } catch (error) {
          console.error('Error confirming order:', error)
          throw error
        }
      },
      async xacNhanDonHangTaiQuay() {
        const tienStore = useOrderStore()
        
        // Tìm tên tỉnh/thành phố từ ID
        const selectedProvince = this.provinces.find(p => p.value === this.formData.province)
        const selectedDistrict = this.districts.find(d => d.value === this.formData.district)
        const selectedWard = this.wards.find(w => w.value === this.formData.ward)
  
        const data = {
          hoaDonId: tienStore.hoaDonId,
          province: selectedProvince?.text || this.formData.province,
          district: selectedDistrict?.text || this.formData.district,
          ward: selectedWard?.text || this.formData.ward,
          diaChiCuThe: `${this.formData.detailAddress}, ${selectedWard?.text || ''}, ${selectedDistrict?.text || ''}, ${selectedProvince?.text || ''}`,
          dienThoai: this.formData.phone,
          ten: this.formData.ten,
          tongTienHoaDon:tienStore.totalAmountValue,
          phiShip:tienStore.shippingFee,
          maKhuyenMaiHoaDon:tienStore.discountCode
        }
        console.log(data)
        try {
          const result = await xacNhanDonHangMuaTaiQuay(data)
          return{
            result,
            data
          } 
        } catch (error) {
          console.error('Error confirming order:', error)
          throw error
        }
      },

    setHoaDonId(id) {
      this.hoaDonId = id
    }
  },

  getters: {
    getFormData: (state) => state.formData,
    getShippingData: (state) => ({
      province: state.formData.province,
      district: state.formData.district,
      ward: state.formData.ward
    })
  }
})