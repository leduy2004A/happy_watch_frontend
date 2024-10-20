import api from "./axios";
export const laySanPham =async ()=>{
   return await api.get("/api/sanpham/all")
}