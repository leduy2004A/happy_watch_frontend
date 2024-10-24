
import api from "./axios";
export const getKhachHang = async ()=>{
    return await api.get("/api/khach-hang/all");
}
export const getAllDiaChiKhachHang = async (idNguoiDung)=>{
    return await api.get(`/api/khach-hang/dia-chi/${idNguoiDung}`);
}
export const getDiaChiKhachHangVaDiaChi = async (idNguoiDung,idDiachi)=>{
    return await api.get(`/api/khach-hang/${idNguoiDung}/diachi/${idDiachi}`)
}
export const themDiaChiKhachHang =async (data)=>{

    return await api.post(`/api/khach-hang/add/${data.nguoiDung.id}`,data)
}