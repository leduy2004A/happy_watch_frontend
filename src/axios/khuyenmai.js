import api from "./axios";
export const layTatCaKhuyenMai =async ()=>{
    return await api.get(`/api/khuyenmaihoadon/tat-ca`)
 }
 export const addKhuyenMai =async (data)=>{
    return await api.post(`/api/khuyenmaihoadon/add-kmhd`,data)
 }
 export const layTatCaKhuyenMaiSanPham =async ()=>{
   return await api.get(`/api/khuyenmai/all`)
}

export const addKhuyenMaiSanPham =async (data)=>{
   return await api.post(`/api/khuyenmai/create`,data)
}
export const updateKhuyenMaiSanPham =async (id,data)=>{
   return await api.put(`/api/khuyenmai/${id}`,data)
}
export const updateKhuyenMai =async (data)=>{
   return await api.put(`/api/khuyenmaihoadon/update-kmhd`,data)
}
export const thayDoiTrangThaiKhuyenMaiSanPham =async (id)=>{
   return await api.put(`/api/khuyenmai/da-ket-thuc/${id}`)
}
export const thayDoiTrangThaiKhuyenMaiHoaDon =async (id)=>{
   return await api.put(`/api/khuyenmaihoadon/da-ket-thuc/${id}`)
}