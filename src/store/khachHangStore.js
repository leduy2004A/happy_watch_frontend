import { defineStore } from "pinia";
import { laySanPham } from "@/axios/sanpham";
import { getAllDiaChiKhachHang } from "@/axios/khachhang";
import { themDiaChiKhachHang } from "@/axios/khachhang";
import { useAddressStore } from "./diaChiStore";
import { useToast } from "vue-toastification";
import { useOrderStore } from "./tienStore";
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
                console.log(this.data)
            }
        
    },
    async themDiaChiKhachHang() {
      const addressStore = useAddressStore()
      const diaChiStore = useOrderStore()
      // Lưu text trước khi gửi dữ liệu
      let provinceName = addressStore.provinces.find(p => p.value === addressStore.formData.province)?.text
      let districtName = addressStore.districts.find(d => d.value === addressStore.formData.district)?.text
      let wardName = addressStore.wards.find(w => w.value === addressStore.formData.ward)?.text
    
      // Sử dụng giá trị text đã lưu nếu không tìm được từ value
      provinceName = provinceName || addressStore.formData.province
      districtName = districtName || addressStore.formData.district 
      wardName = wardName || addressStore.formData.ward
    
      // Lưu lại mã vào biến tạm để dùng cho shipping
      const districtCode = addressStore.formData.district
      const wardCode = addressStore.formData.ward
    console.log(districtCode)
    console.log(wardCode)
      const dataAdress = {
        ma: "",
        tenNguoiNhan: addressStore.formData.ten,
        tinhThanhPho: provinceName,
        quanHuyen: districtName,
        xaPhuongThiTran: wardName,
        diaChiCuThe: addressStore.formData.detailAddress,
        dienThoai: addressStore.formData.phone,
        nguoiDung: {
          id: this.idNguoiDung,
        },
      }
    
      // Sau khi có mã trong biến tạm, mới cập nhật formData với text
      addressStore.formData.province = provinceName
      addressStore.formData.district = districtName
      addressStore.formData.ward = wardName
    console.log(addressStore.formData.province)
      try {
        const result = await themDiaChiKhachHang(dataAdress)
        if (result.status === 200) {
          toast.success("Thêm địa chỉ khách hàng thành công")
          this.data.push(result.data)
          // Sau khi thêm địa chỉ thành công, tính phí ship với mã đã lưu
          await diaChiStore.calculateShippingFee(districtCode, wardCode)
          return true
        } else {
          toast.error("Thêm địa chỉ khách hàng thất bại") 
          return false
        }
      } catch (error) {
        console.error("Lỗi khi thêm địa chỉ:", error)
        toast.error("Có lỗi xảy ra khi thêm địa chỉ")
        return false
      }
    }
  },
});
