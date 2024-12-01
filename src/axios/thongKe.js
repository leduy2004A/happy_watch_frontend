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
export const getThongKeSanPhamSapHetHang = async (soLuong) =>{
    return await api.get(`/api/thong-ke/san-pham-sap-het?soLuong=${soLuong}`)
}


export const getThongKeHomNaySanPhamPhanTram = async ()=>{
    return await api.get("/api/thong-ke/phan-tram-hoa-don-hom-nay");
}
export const getThongKeTuanNaySanPhamPhanTram= async ()=>{
    return await api.get("/api/thong-ke/phan-tram-hoa-don-tuan-nay");
}
export const getThongKeThangNaySanPhamPhanTram = async ()=>{
    return await api.get("/api/thong-ke/phan-tram-hoa-don-thang-nay");
}
export const getThongKeTheoNamSanPhamPhanTram= async ()=>{
    return await api.get("/api/thong-ke/phan-tram-hoa-don");
}
// export const getThongKeSanPhamSapHetHang = async (soLuong) =>{
//     return await api.get(`/api/thong-ke/san-pham-sap-het?soLuong=${soLuong}`)
// }