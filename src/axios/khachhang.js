import api from "./axios";
export const getKhachHang = async ()=>{
    return await api.get("/api/khach-hang/all");
}