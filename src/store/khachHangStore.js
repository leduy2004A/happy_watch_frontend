import { defineStore } from "pinia";
import { laySanPham } from "@/axios/sanpham";
import { getAllDiaChiKhachHang } from "@/axios/khachhang";
import { themDiaChiKhachHang } from "@/axios/khachhang";
import { useAddressStore } from "./diaChiStore";
import { useToast } from "vue-toastification";
const toast = useToast()
export const useKhachHangStore = defineStore("khachHang", {
  state: () => ({
    idNguoiDung:0,
    data: [
      {
        id: 3,
        ma: "DC02",
        tinhThanhPho: "Hà Nội",
        quanHuyen: "Thạch Thất",
        xaPhuongThiTran: "Liên Quan",
        diaChiCuThe: "456 Đường B, Liên Quan",
        dienThoai: "0901235567",
        nguoiDung: {
          id: 2,
          ma: "ND02",
          avatar: "avatar1.jpg",
          ten: "Lê Văn Duy",
          username: "duy1",
          password: "123456",
          gioiTinh: "Nam",
          trangThai: true,
          email: "Duy@gmail.com",
          vaiTro: {
            id: 3,
            tenVaiTro: "Khách hàng",
          },
        },
      },
    ],
  }),

  getters: {},

  actions: {
    async fetchDataDiaChiNguoiDung(nguoiDungId){
        const result = await getAllDiaChiKhachHang(nguoiDungId)
        if(result.status === 200)
            {
                this.data = result.data
            }
        
    },
    async themDiaChiKhachHang(){
      const addressStore = useAddressStore()
      const selectedProvince = addressStore.provinces.find(p => p.value === addressStore.formData.province)
      const selectedDistrict = addressStore.districts.find(d => d.value === addressStore.formData.district)
      const selectedWard = addressStore.wards.find(w => w.value === addressStore.formData.ward)
      const dataAdress = {
        ma: "",
        tenNguoiNhan: addressStore.formData.ten,
        tinhThanhPho: selectedProvince.text,
        quanHuyen: selectedDistrict.text,
        xaPhuongThiTran: selectedWard.text,
        diaChiCuThe: addressStore.formData.detailAddress,
        dienThoai: addressStore.formData.phone,
        nguoiDung: {
          id: this.idNguoiDung,
        },
      };
      console.log(dataAdress)
      const result = await themDiaChiKhachHang(dataAdress)
      if(result.status === 200)
        {
          toast.success("Thêm địa chỉ khách hàng")
          this.data.push(result.data)
          return true
        }
        else{
        toast.error("Thêm địa chỉ khách hàng thất bại")
        return false
    }
  }
  },
});
