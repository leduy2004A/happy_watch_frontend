import api from "./axios";
export const getAllHoaDon = async ()=>{
    return await api.get("api/qlhd/all");
}
export const getHoaDonTheoMa = async (maHoaDon)=>{
    return await api.get(`api/qlhd/hoa-don/${maHoaDon}`);
}
export const layTrangThaiHoadonTheoMa = async (maHoaDon)=>{
    return await api.get(`api/qlhd/trang-thai/${maHoaDon}`);
}
