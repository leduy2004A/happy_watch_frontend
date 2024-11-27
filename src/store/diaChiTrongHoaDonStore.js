import { defineStore } from "pinia";
import { thongTinGiaoHang,} from "@/axios/quanlihoadon";
import { getTinhThanh, getQuanHuyen, getPhuongXa } from "@/axios/diachi"
import { danhSachSanPhamHoaDonStore } from "./danhSachSanPhamHoaDonStore";
import { getPhiShip } from "@/axios/giaohangnhanh";
export const useDiaChiTrongHoaDonStore = defineStore("DiaChiTrongHoaDonStore", {
  state: () => ({
    diaChi: {},
    provinces: [],
    districts: [],
    wards: [],
    selectedProvinceId: null,
    selectedDistrictId: null,
    selectedWardId: null,
    shippingFee:0
  }),
  
  actions: {
    async fetchDiaChiData(orderId) {
      try {
        const { data, status } = await thongTinGiaoHang(orderId)
        console.log(data)
        if (status === 200) {
          this.diaChi = data;
          // Gọi hàm để load dữ liệu địa chỉ
          await this.fetchProvinces();
          // Sau khi có provinces, tìm và set selected province
          const selectedProvince = this.provinces.find(
            province => province.text === this.diaChi.tinhThanhPho
          );
          if (selectedProvince) {
            this.selectedProvinceId = selectedProvince.value;
            await this.fetchDistricts(selectedProvince.value);
            
            // Tìm và set selected district
            const selectedDistrict = this.districts.find(
              district => district.text === this.diaChi.quanHuyen
            );
            if (selectedDistrict) {
              this.selectedDistrictId = selectedDistrict.value;
              await this.fetchWards(selectedDistrict.value);
              console.log(selectedDistrict)
              // Tìm và set selected ward
              const selectedWard = this.wards.find(
                ward => ward.text.toLowerCase().trim() === this.diaChi.xaPhuongThiTran.toLowerCase().trim()
              );
              if (selectedWard) {
                console.log(selectedWard)
                this.selectedWardId = selectedWard.value;
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching order data:', error)
      }
    },
    formatPrice(price) {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(price)
    },
    async calculateShippingFee(districtId, wardCode) {
      const useDSSP = danhSachSanPhamHoaDonStore()
      try {
        const dataShip = {
          district: districtId,
          ward: wardCode,
          weight: useDSSP.tongCanNang,
          name: 'Đồng hồ',
        }
        console.log(dataShip)
        const result = await getPhiShip(dataShip)
        console.log(result)
        this.shippingFee = result.data.data.total
      } catch (error) {
        console.error('Error calculating shipping fee:', error)
      }
    },
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

    async fetchDistricts(provinceId) {
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

    async fetchWards(districtId) {
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
  },
});