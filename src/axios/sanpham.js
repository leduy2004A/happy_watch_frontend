import api from "./axios";
export const laySanPham =async ()=>{
   return await api.get("/api/sanpham/all")
}
export const laySanPhamCuaHang = async (page,size)=>{
   return await api.get(`/api/home/all-ctsp?page=${page}&size=${size}`)
}