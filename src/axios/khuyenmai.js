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
export const updateKhuyenMai =async (data)=>{
   return await api.put(`/api/khuyenmaihoadon/update-kmhd`,data)
}