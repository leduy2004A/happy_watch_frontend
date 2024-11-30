import api from "./axios";
export const getKhuyenMaiCongKhai = async ()=>{
    return await api.get("/api/khuyenmaihoadon/khuyenmai/toanbo");
}
export const getKhuyenMaiCaNhan= async ()=>{
    return await api.get("/api/khuyenmaihoadon/khuyenmai/canhan");
}