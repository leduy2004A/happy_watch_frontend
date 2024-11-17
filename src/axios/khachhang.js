
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

export const layDiaChiDauTienCuaKhachHangToken = async()=>{
    return await api.get('api/khach-hang/dia-chi-dau-tien')
}
export const layToanBoDiaChiCuaKhachHangToken = async()=>{
    return await api.get('api/khach-hang/list-dia-chi')
}
export const themDiaChiKhachHangToken = async(data)=>{
    return await api.post('/api/khach-hang/add-dia-chi-token',data)
}