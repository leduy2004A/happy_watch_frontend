import api from "./axios";
export const getThongKeHomNay = async ()=>{
    return await api.get("/api/thong-ke/thong-ke-hom-nay");
}
export const getThongKeTuanNay= async ()=>{
    return await api.get("/api/thong-ke/thong-ke-tuan-nay");
}
export const getThongKeThangNay = async ()=>{
    return await api.get("/api/thong-ke/thong-ke-thang-nay");
}
export const getThongKeTheoNam= async ()=>{
    return await api.get("/api/thong-ke/all");
}
export const getThongKeHomNaySanPham = async ()=>{
    return await api.get("/api/thong-ke/san-pham-ban-chay-hom-nay");
}
export const getThongKeTuanNaySanPham= async ()=>{
    return await api.get("/api/thong-ke/san-pham-ban-chay-tuan-nay");
}
export const getThongKeThangNaySanPham = async ()=>{
    return await api.get("/api/thong-ke/san-pham-ban-chay-thang-nay");
}
export const getThongKeTheoNamSanPham= async ()=>{
    return await api.get("/api/thong-ke/san-pham-ban-chay");
}