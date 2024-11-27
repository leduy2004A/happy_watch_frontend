// stores/customerStore.js
import { defineStore } from 'pinia'

import { getTinhThanh, getQuanHuyen, getPhuongXa } from "@/axios/diachi"
export const useCustomerStore = defineStore('customer', {
  state: () => ({
    provinces: [],
    districts: [],
    wards: [],
    address:[]
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
      async updateAddressFromProps(addresses) {
        try {
          // Validate input
          if (!Array.isArray(addresses) || addresses.length === 0) {
            console.warn('Input must be a non-empty array of addresses')
            return
          }
  
          // Fetch provinces first
          await this.fetchProvinces()
  
          // Process each address
          const processedAddresses = await Promise.all(
            addresses.map(async (diachi) => {
              const {
                tinhThanhPho,
                quanHuyen,
                xaPhuongThiTran,
                dienThoai,
                diaChiCuThe,
                isDefault,
                id,
                tenNguoiNhan
              } = diachi
  
              // Find matching province
              const foundProvince = this.provinces.find(
                p => p.text.toLowerCase() === tinhThanhPho?.toLowerCase()
              )
  
              if (foundProvince) {
                // Get districts for this province
                await this.handleProvinceChange(foundProvince.value)
  
                // Find matching district
                const foundDistrict = this.districts.find(
                  d => d.text.toLowerCase() === quanHuyen?.toLowerCase()
                )
  
                if (foundDistrict) {
                  // Get wards for this district
                  await this.handleDistrictChange(foundDistrict.value)
                }
              }
  
              // Return processed address with all original fields
              return {
                id,
                tenNguoiNhan,
                dienThoai,
                tinhThanhPho,
                quanHuyen,
                xaPhuongThiTran,
                diaChiCuThe,
                isDefault
              }
            })
          )
  
          // Update store's address state
          this.address = processedAddresses
  
        } catch (error) {
          console.error('Error updating addresses:', error)
          throw error
        }
      },
      async loadAddressesWithLocation(addresses) {
        try {
          if (!Array.isArray(addresses) || addresses.length === 0) {
            return;
          }
  
          // Load tỉnh/thành phố
          await this.fetchProvinces();
  
          // Xử lý từng địa chỉ
          const processedAddresses = await Promise.all(
            addresses.map(async (diachi) => {
              const processedAddress = {
                ...diachi,
                id: diachi.id,
                tenNguoiNhan: diachi.tenNguoiNhan,
                dienThoai: diachi.dienThoai,
                diaChiCuThe: diachi.diaChiCuThe,
                isDefault: diachi.isDefault,
                tinhThanhPho: '',  // Mặc định để trống
                quanHuyen: '',     // Mặc định để trống
                xaPhuongThiTran: '' // Mặc định để trống
              };
  
              // Tìm province tương ứng
              const foundProvince = this.provinces.find(
                p => p.text.toLowerCase() === diachi.tinhThanhPho?.toLowerCase()
              );
  
              if (foundProvince) {
                processedAddress.tinhThanhPho = foundProvince.value;
                
                // Load districts của province này
                await this.handleProvinceChange(foundProvince.value);
  
                // Tìm district tương ứng
                const foundDistrict = this.districts.find(
                  d => d.text.toLowerCase() === diachi.quanHuyen?.toLowerCase()
                );
  
                if (foundDistrict) {
                  processedAddress.quanHuyen = foundDistrict.value;
                  
                  // Load wards của district này
                  await this.handleDistrictChange(foundDistrict.value);
  
                  // Tìm ward tương ứng
                  const foundWard = this.wards.find(
                    w => w.text.toLowerCase() === diachi.xaPhuongThiTran?.toLowerCase()
                  );
  
                  if (foundWard) {
                    processedAddress.xaPhuongThiTran = foundWard.value;
                  }
                }
              }
  
              return processedAddress;
            })
          );
  
          // Cập nhật state
          this.address = processedAddresses;
  
        } catch (error) {
          console.error('Error loading addresses with location:', error);
          throw error;
        }
      }
  }
})