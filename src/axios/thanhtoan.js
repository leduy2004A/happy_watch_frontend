import api from "./axios";
export const thanhtoan =async (data)=>{
    return await api.put(`http://localhost:8080/api/hoadon/update-status/${data.hoaDonId}?tienKhachDua=${data.tienKhachDua}&phuongThuc=${data.phuongThuc}`)
}